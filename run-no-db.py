from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Mock data for auth responses
users = [
    {
        "id": 1,
        "username": "admin",
        "email": "admin@example.com",
        "role": "admin"
    },
    {
        "id": 2,
        "username": "testuser2",
        "password": "password123",
        "email": "test@example.com",
        "role": "user"
    }
]

@app.route('/')
def index():
    return jsonify({
        "status": "ok",
        "message": "iMagenWiz API server is running in no-DB mode"
    })

@app.route('/api/auth/login', methods=['POST'])
def login():
    # Return mock login response
    return jsonify({
        "success": True,
        "message": "Login successful",
        "user": users[1],
        "access_token": "mock_token_12345",
        "token_type": "Bearer"
    })

@app.route('/api/auth/user', methods=['GET'])
def user_profile():
    # Return mock user profile
    return jsonify({
        "success": True,
        "user": users[1]
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "iMagenWiz API",
        "mode": "no-database"
    })

@app.route('/api/settings/logo', methods=['GET'])
def logo():
    return jsonify({
        "logo_url": "/logo.png",
        "logo_dark_url": "/logo-dark.png"
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)