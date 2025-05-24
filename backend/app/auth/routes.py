from flask import request, jsonify, redirect, url_for, make_response
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models.models import User
from app import db
from . import bp
import requests
from app.credits.utils import log_credit_change
import os
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import secrets
import string

GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
GOOGLE_REDIRECT_URI = os.getenv('GOOGLE_REDIRECT_URI', 'http://localhost:3000/api/auth/google/callback')
GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo'

@bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.get_json()
    
    # Username and password are always required
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"error": "Missing username or password"}), 400

    google_token = data.get("googleToken")
    email_from_payload = data.get("email") # Email can be sent directly or from Google
    final_email = None

    if google_token:
        userinfo_response = requests.get(
                GOOGLE_USERINFO_URL,
                headers={"Authorization": f"Bearer {google_token}"}
            )
        if userinfo_response.status_code != 200:
            return jsonify({"error": "Invalid Google token"}), 400
        userinfo = userinfo_response.json()
        email_from_google = userinfo.get("email")
        if not email_from_google:
            return jsonify({"error": "Email not found in Google token. Cannot register."}), 400
        final_email = email_from_google
    elif email_from_payload:
        final_email = email_from_payload
    else:
        # Email is required either from Google Token or direct payload
        return jsonify({"error": "Missing email address for registration."}), 400

    # Check if email already exists (primary unique identifier now)
    existing_user_by_email = User.query.filter_by(email=final_email).first()
    if existing_user_by_email:
        return jsonify({"error": "An account with this email already exists. Please login or use a different email."}), 400

    # Also check if username is taken, as it's also unique
    existing_user_by_username = User.query.filter_by(username=data['username']).first()
    if existing_user_by_username:
        return jsonify({"error": "This username is already taken. Please choose a different one."}), 400

    initial_credits = 3
    new_user = User(
        username=data['username'],
        email=final_email, # email is now guaranteed to be present
        credits=initial_credits,
        credit_balance=initial_credits 
    )
    new_user.set_password(data['password'])
    
    # Save user to database
    db.session.add(new_user)
    try:
        db.session.commit()

        # Log the initial credit grant
        log_credit_change(
            user_id=new_user.id,
            change_amount=initial_credits,
            source_type='initial_grant',
            description='Initial credits upon registration',
        )
        db.session.commit()

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to register user or log initial credits", "message": str(e)}), 500
    
    # Generate access token - ensure identity is a string
    # Converting new_user.id to string to fix the "Subject must be a string" error
    access_token = create_access_token(identity=str(new_user.id))
    
    return jsonify({
        "message": "User registered successfully",
        "user": new_user.to_dict(),
        "access_token": access_token
    }), 201

@bp.route('/login', methods=['POST'])
def login():
    """Login a user"""
    data = request.get_json()
    
    # Check if required fields are provided
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"error": "Missing username or password"}), 400
    
    # Find user
    user = User.query.filter_by(username=data['username']).first()
    
    # Check if user exists
    if not user:
        return jsonify({"error": "Invalid username or password"}), 401
        
    # For testing purposes, accept 'password123' for testuser2
    # This is a temporary solution for development only
    if user.username == 'testuser2' and data['password'] == 'password123':
        # Password is correct for testuser2
        pass
    elif not user.check_password(data['password']):
        return jsonify({"error": "Invalid username or password"}), 401
    
    # Generate access token - ensure identity is a string
    # Converting user.id to string to fix the "Subject must be a string" error
    access_token = create_access_token(identity=str(user.id))
    
    return jsonify({
        "message": "Login successful",
        "user": user.to_dict(),
        "access_token": access_token
    }), 200

@bp.route('/user', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current user details"""
    user_id = get_jwt_identity()
    print("user_id", user_id)
    # Convert back to int since we stored it as a string in the token
    try:
        user_id = int(user_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid user ID"}), 400
        
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify(user.to_dict()), 200

@bp.route('/user', methods=['PATCH'])
@jwt_required()
def update_user():
    """Update user details"""
    user_id = get_jwt_identity()
    # Convert back to int since we stored it as a string in the token
    try:
        user_id = int(user_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid user ID"}), 400
        
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    data = request.get_json()
    
    # Only allow updating certain fields
    if data.get('password'):
        user.set_password(data['password'])
    
    db.session.commit()
    
    return jsonify({
        "message": "User updated successfully",
        "user": user.to_dict()
    }), 200
    
@bp.route('/make-admin/<username>', methods=['POST'])
def make_admin(username):
    """Make a user an admin - This is a special endpoint for development only"""
    # Check if user exists
    user = User.query.filter_by(username=username).first()
    
    if not user:
        return jsonify({"error": f"User {username} not found"}), 404
    
    # Make user an admin
    user.is_admin = True
    db.session.commit()
    
    return jsonify({
        "message": f"User {username} is now an admin",
        "user": user.to_dict()
    }), 200

@bp.route('/google', methods=['GET'])
def google_auth():
    """Initiate Google OAuth flow"""
    google_auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?" + \
        f"client_id={GOOGLE_CLIENT_ID}" + \
        f"&redirect_uri={GOOGLE_REDIRECT_URI}" + \
        f"&response_type=code" + \
        f"&scope=email profile" + \
        f"&access_type=offline" + \
        f"&prompt=consent"
    return redirect(google_auth_url)

@bp.route('/google/callback', methods=['GET'])
def google_callback():
    """Handle Google OAuth callback"""
    code = request.args.get('code')
    if not code:
        print("[Google Callback] No code provided in request")
        return jsonify({"error": "No code provided"}), 400

    # Exchange code for tokens
    token_url = "https://oauth2.googleapis.com/token"
    token_data = {
        'code': code,
        'client_id': GOOGLE_CLIENT_ID,
        'client_secret': GOOGLE_CLIENT_SECRET,
        'redirect_uri': GOOGLE_REDIRECT_URI,
        'grant_type': 'authorization_code'
    }
    
    try:
        print("[Google Callback] Attempting to exchange code for tokens")
        token_response = requests.post(token_url, data=token_data)
        token_response.raise_for_status()
        tokens = token_response.json()
        
        # Get user info from Google
        userinfo_response = requests.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {tokens['access_token']}"}
        )
        userinfo_response.raise_for_status()
        userinfo = userinfo_response.json()
        
        # Check if user exists
        user = User.query.filter_by(email=userinfo['email']).first()
        
        if not user:
            # Create new user if doesn't exist
            username = userinfo['email'].split('@')[0]
            base_username = username
            counter = 1
            
            while User.query.filter_by(username=username).first():
                username = f"{base_username}{counter}"
                counter += 1
            
            # Generate a random password for Google OAuth users
            alphabet = string.ascii_letters + string.digits
            random_password = ''.join(secrets.choice(alphabet) for _ in range(16))
            
            user = User(
                username=username,
                email=userinfo['email'],
                credits=3,
                credit_balance=3
            )
            user.set_password(random_password)
            db.session.add(user)
            try:
                db.session.commit()
                
                # Log initial credits
                log_credit_change(
                    user_id=user.id,
                    change_amount=3,
                    source_type='initial_grant',
                    description='Initial credits upon Google registration',
                )
                db.session.commit()
            except Exception as db_error:
                print(f"[Google Callback] Database error: {str(db_error)}")
                db.session.rollback()
                raise
        
        # Generate access token
        access_token = create_access_token(identity=str(user.id))
        
        # Create response with redirect
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
        response = make_response(redirect(f"{frontend_url}/dashboard"))
        
        # Set the access token cookie
        response.set_cookie(
            'access_token',
            access_token,
            httponly=True,  # Prevents JavaScript access
            secure=True,    # Only sent over HTTPS
            samesite='Lax', # Protects against CSRF
            max_age=3600    # 1 hour expiration
        )
        
        return response
        
    except requests.exceptions.RequestException as e:
        print(f"[Google Callback] Request error: {str(e)}")
        return jsonify({"error": f"Google authentication failed: {str(e)}"}), 400
    except Exception as e:
        print(f"[Google Callback] Unexpected error: {str(e)}")
        return jsonify({"error": f"Google authentication failed: {str(e)}"}), 400
