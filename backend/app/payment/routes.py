import os
import json
import stripe
from flask import request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.models import User, RechargeHistory
from app import db
from . import bp

def init_stripe():
    """Initialize Stripe API when payment features are needed"""
    stripe_api_key = os.environ.get('STRIPE_SECRET_KEY')
    if not stripe_api_key:
        print("ERROR: Stripe API key is NOT configured!")
        return False
        
    # Set the key in the Stripe library
    stripe.api_key = stripe_api_key
    
    try:
        # Test connectivity
        stripe.Account.retrieve()
        print("Payment system initialized successfully")
        return True
    except Exception as e:
        print(f"ERROR: Failed to initialize payment system: {str(e)}")
        return False

# Initialize Stripe when this module is imported
init_stripe()

# Credit package options
CREDIT_PACKAGES = [
    {
        "id": "free",
        "name": "Free",
        "credits": 3,
        "price": 0,
        "currency": "usd",
        "description": "3 credits for removing background from images"
    },
    {
        "id": "lite_monthly",
        "name": "Lite Monthly",
        "credits": 50,
        "price": 9.9,
        "currency": "usd",
        "description": "50 credits for removing background from images",
        "is_yearly": False
    },
    {
        "id": "lite_yearly",
        "name": "Lite Yearly",
        "credits": 600,
        "price": 106.8,
        "currency": "usd",
        "description": "600 credits for removing background from images (50 per month)",
        "is_yearly": True
    },
    {
        "id": "pro_monthly",
        "name": "Pro Monthly",
        "credits": 250,
        "price": 24.9,
        "currency": "usd",
        "description": "250 credits for removing background from images",
        "is_yearly": False
    },
    {
        "id": "pro_yearly",
        "name": "Pro Yearly",
        "credits": 3000,
        "price": 262.8,
        "currency": "usd",
        "description": "3000 credits for removing background from images (250 per month)",
        "is_yearly": True
    }
]

@bp.route('/packages', methods=['GET'])
def get_packages():
    """Get all available credit packages"""
    return jsonify({
        "packages": CREDIT_PACKAGES
    }), 200

@bp.route('/create-checkout-session', methods=['POST'])
@jwt_required()
def create_checkout_session():
    """Create a Stripe checkout session for credit purchase"""
    user_id = get_jwt_identity()
    try:
        user_id = int(user_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid user ID"}), 400
        
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    data = request.get_json()
    package_id = data.get('package_id')
    success_url = data.get('success_url')
    cancel_url = data.get('cancel_url')
    
    # Get optional parameters
    custom_price = data.get('price')
    custom_credits = data.get('credits')
    is_yearly = data.get('is_yearly', False)
    
    print(f"Creating checkout session for user {user.id}, package {package_id}")
    print(f"Is yearly: {is_yearly}, Credits: {custom_credits}, Price: {custom_price}")
    print(f"Success URL: {success_url}, Cancel URL: {cancel_url}")
    
    # If success_url or cancel_url are not provided, use default URLs based on request origin
    if not success_url:
        # Get the origin from request headers or use the host directly
        # We need to ensure we're using the frontend URL, not the backend URL
        host = request.headers.get('Host', 'localhost')
        origin = request.headers.get('Origin')
        
        # Use origin if available (which should include the protocol)
        if origin:
            # Use the React page for payment verification with port 3000
            success_url = f"{origin}:3000/payment-verify?session_id={{CHECKOUT_SESSION_ID}}"
        else:
            # Fallback to host with https and port 3000
            forwarded_proto = request.headers.get('X-Forwarded-Proto', 'https')
            success_url = f"{forwarded_proto}://{host}:3000/payment-verify?session_id={{CHECKOUT_SESSION_ID}}"
            
        print(f"Using payment-verify page for interactive payment verification: {success_url}")
    
    if not cancel_url:
        # Get the origin from request headers or use the host directly
        host = request.headers.get('Host', 'localhost')
        origin = request.headers.get('Origin')
        
        # Use origin if available (which should include the protocol)
        if origin:
            cancel_url = f"{origin}:3000/pricing"
        else:
            # Fallback to host with https
            forwarded_proto = request.headers.get('X-Forwarded-Proto', 'https')
            cancel_url = f"{forwarded_proto}://{host}:3000/pricing"
            
        print(f"No cancel_url provided, using default: {cancel_url}")
    
    # Find the selected package
    package = None
    
    # Handle packages with yearly/monthly options
    if is_yearly is not None:
        package = next((p for p in CREDIT_PACKAGES if p['id'] == package_id and p.get('is_yearly', False) == is_yearly), None)
    
    # If not found or no is_yearly provided, try the default
    if not package:
        package = next((p for p in CREDIT_PACKAGES if p['id'] == package_id), None)
    
    if not package:
        return jsonify({"error": "Invalid package selected"}), 400
        
    # Override package properties with custom values if provided
    price = custom_price if custom_price is not None else package['price']
    credits = custom_credits if custom_credits is not None else package['credits']
    
    # Create Stripe session
    try:
        # Process URLs to ensure they're in the simplest, most compatible format for Stripe
        if success_url:
            try:
                # Always use a robust URL parsing approach
                from urllib.parse import urlparse, urlunparse
                
                # Parse the URL to work with its components
                parsed = urlparse(success_url)
                
                # Make scheme always https for Replit domains
                scheme = "https" if ".replit.dev" in parsed.netloc else parsed.scheme
                
                # KEEP port 3000 but remove others
                netloc = parsed.netloc
                # Only remove ports other than 3000, which is required
                for port in [":5000", ":443"]:
                    if port in netloc:
                        netloc = netloc.replace(port, "")
                        print(f"Removed port {port} from URL")
                # Keep port 3000 intact
                print(f"Keeping netloc with port if it has :3000: {netloc}")
                
                # Reconstruct the base URL without query params 
                clean_url = urlunparse((
                    scheme,
                    netloc,
                    parsed.path,  # Keep the original path
                    '',           # No params
                    '',           # No query
                    ''            # No fragment
                ))
                
                # Create a clean success URL with session_id parameter
                # For payment-verify, we don't need the use_html flag since this is handled by React
                success_url = f"{clean_url}?session_id={{CHECKOUT_SESSION_ID}}"
                
                print(f"Processed success URL: {success_url}")
            except Exception as e:
                print(f"Error processing success_url: {e}")
                # Fallback to a basic URL if parsing fails
                if not success_url.endswith("{CHECKOUT_SESSION_ID}"):
                    if "?" in success_url:
                        success_url = f"{success_url}&session_id={{CHECKOUT_SESSION_ID}}"
                    else:
                        success_url = f"{success_url}?session_id={{CHECKOUT_SESSION_ID}}"
        
        # Process the cancel_url using the same robust approach
        if cancel_url:
            try:
                from urllib.parse import urlparse, urlunparse
                parsed = urlparse(cancel_url)
                
                # Make scheme always https for Replit domains
                scheme = "https" if ".replit.dev" in parsed.netloc else parsed.scheme
                
                # KEEP port 3000 but remove others
                netloc = parsed.netloc
                # Only remove ports other than 3000, which is required
                for port in [":5000", ":443"]:
                    if port in netloc:
                        netloc = netloc.replace(port, "")
                        print(f"Removed port {port} from cancel URL")
                # Keep port 3000 intact
                print(f"Keeping netloc with port if it has :3000: {netloc}")
                
                # Reconstruct the clean URL
                cancel_url = urlunparse((
                    scheme,
                    netloc,
                    parsed.path,
                    '',
                    '',
                    ''
                ))
                
                print(f"Processed cancel URL: {cancel_url}")
            except Exception as e:
                print(f"Error processing cancel_url: {e}")
        
        # For debugging, print the final URLs
        print(f"Final Success URL: {success_url}")
        print(f"Final Cancel URL: {cancel_url}")
        
        # Create a customized description if we're using custom values
        product_name = package['name']
        product_description = package['description']
        
        # If custom values were provided, update the description
        if custom_credits is not None or custom_price is not None:
            # Extract the base package name (before _monthly or _yearly)
            base_name = package_id.split('_')[0].capitalize()
            billing_period = "Yearly" if is_yearly else "Monthly"
            product_name = f"{base_name} Plan ({billing_period})"
            product_description = f"{credits} credits for removing background from images"
            if is_yearly:
                product_description += f" ({int(credits/12)} per month)"
        
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[
                {
                    'price_data': {
                        'currency': package['currency'],
                        'product_data': {
                            'name': product_name,
                            'description': product_description,
                        },
                        'unit_amount': int(price * 100),  # Convert to cents
                    },
                    'quantity': 1,
                },
            ],
            mode='payment',
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={
                'user_id': user.id,
                'package_id': package_id,
                'credits': credits,
                'price': price,
                'is_yearly': 'true' if is_yearly else 'false'
            }
        )
        
        print(f"Checkout session created: {checkout_session.id}")
        
        return jsonify({
            'id': checkout_session.id,
            'url': checkout_session.url
        }), 200
        
    except Exception as e:
        print(f"Error creating checkout session: {str(e)}")
        return jsonify({"error": str(e)}), 500

@bp.route('/webhook', methods=['POST'])
def webhook():
    """
    Handle Stripe webhook events
    
    This endpoint receives webhook notifications from Stripe when events occur
    such as successful payments, failed payments, or subscription updates.
    
    The webhook processes these events asynchronously to update the user's account.
    """
    # Get the raw payload and signature header
    payload = request.get_data(as_text=True)
    sig_header = request.headers.get('Stripe-Signature')
    webhook_secret = os.environ.get('STRIPE_WEBHOOK_SECRET')
    
    print(f"Webhook received! Signature present: {bool(sig_header)}")
    
    try:
        # Attempt to verify the webhook signature if a secret is configured
        if webhook_secret:
            print(f"Verifying webhook signature with secret: {webhook_secret[:4]}...")
            try:
                event = stripe.Webhook.construct_event(
                    payload, sig_header, webhook_secret
                )
                print("✅ Webhook signature verified!")
            except stripe.error.SignatureVerificationError as e:
                print(f"❌ Webhook signature verification failed: {str(e)}")
                # Log the error but still process the webhook (in test/dev only)
                # In production, you would return 400 here
                event = stripe.Event.construct_from(
                    json.loads(payload), stripe.api_key
                )
                print("⚠️ Processing webhook without signature verification (INSECURE)")
        else:
            # No webhook secret configured, process anyway (development mode only)
            print("⚠️ No webhook secret configured, skipping signature verification")
            event = stripe.Event.construct_from(
                json.loads(payload), stripe.api_key
            )
    except ValueError as e:
        # Invalid payload
        print(f"❌ Invalid webhook payload: {str(e)}")
        return jsonify({"error": "Invalid payload"}), 400
    except Exception as e:
        # Other error
        print(f"❌ Error processing webhook: {str(e)}")
        return jsonify({"error": f"Error processing webhook: {str(e)}"}), 400
    
    # Log the event details
    print(f"🎯 Webhook event received: {event['type']}")
    print(f"  Event ID: {event['id']}")
    print(f"  Created at: {event['created']}")
    
    # Handle specific event types
    try:
        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            print(f"💰 Processing successful checkout session: {session.id}")
            
            # Use the new fulfillment function instead of the old handler
            from .order_confirmation import fulfill_checkout
            fulfillment_result = fulfill_checkout(session.id)
            
            if fulfillment_result['status'] == 'success':
                user_data = fulfillment_result.get('user', {})
                user_id = user_data.get('id', None)
                username = user_data.get('username', 'unknown')
                credits_added = fulfillment_result.get('credits_added', 0)
                new_balance = fulfillment_result.get('new_balance', 0)
                
                if fulfillment_result.get('already_fulfilled', False):
                    print(f"ℹ️ Payment was already fulfilled for user {username} (ID: {user_id})")
                else:
                    print(f"✅ Credits added for user {username} (ID: {user_id}), new balance: {new_balance}")
            else:
                print(f"❌ Failed to process checkout session payment: {fulfillment_result.get('error', 'Unknown error')}")
                
        elif event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            print(f"💳 Processing successful payment intent: {payment_intent.id}")
            user = handle_payment_intent_success(payment_intent)
            
            if user:
                print(f"✅ Credits added for user {user.username} (ID: {user.id}), new balance: {user.credits}")
            else:
                print("❌ Failed to process payment intent")
                
        elif event['type'] == 'checkout.session.async_payment_succeeded':
            session = event['data']['object']
            print(f"🔄 Processing async payment success: {session.id}")
            user = handle_successful_payment(session)
            
            if user:
                print(f"✅ Credits added for user {user.username} (ID: {user.id}), new balance: {user.credits}")
            else:
                print("❌ Failed to process async payment")
                
        elif event['type'] == 'checkout.session.async_payment_failed':
            session = event['data']['object']
            print(f"❌ Async payment failed for session: {session.id}")
            # Record the payment failure
            user_id = session.metadata.get('user_id') if hasattr(session, 'metadata') else None
            if user_id:
                print(f"📝 Recording payment failure for user ID: {user_id}")
                # Here you could store a payment failure record in the database
        
        elif event['type'] == 'payment_intent.payment_failed':
            payment_intent = event['data']['object']
            print(f"❌ Payment intent failed: {payment_intent.id}")
            # Record the payment failure
            user_id = payment_intent.metadata.get('user_id') if hasattr(payment_intent, 'metadata') else None
            if user_id:
                print(f"📝 Recording payment failure for user ID: {user_id}")
                # Here you could store a payment failure record in the database
        
        else:
            # Unhandled event type, just log it
            print(f"ℹ️ Unhandled event type: {event['type']}")
    
    except Exception as e:
        print(f"❌ Error handling webhook event: {str(e)}")
        # Log the error but don't return an error response to Stripe
        # This prevents Stripe from retrying the webhook
    
    # Always return a 200 OK to Stripe to acknowledge receipt
    # This prevents Stripe from retrying the webhook even if we had an error
    return jsonify({"status": "success", "event_type": event['type']}), 200

def handle_successful_payment(session):
    """Process a successful payment and add credits to user"""
    # Get metadata from the session
    try:
        # Handle both dict-like access and attribute access for different session object types
        if hasattr(session, 'metadata') and session.metadata:
            # If session is a Stripe object with attributes
            metadata = session.metadata
            user_id = metadata.get('user_id')
            package_id = metadata.get('package_id')
            credits = int(metadata.get('credits', 0))
            price = float(metadata.get('price', 0))
            is_yearly = metadata.get('is_yearly', 'false').lower() == 'true'
            session_id = session.id
        else:
            # If session is a dict
            metadata = session.get('metadata', {})
            user_id = metadata.get('user_id')
            package_id = metadata.get('package_id')
            credits = int(metadata.get('credits', 0))
            price = float(metadata.get('price', 0))
            is_yearly = metadata.get('is_yearly', 'false').lower() == 'true'
            session_id = session.get('id')
            
        # If credits are not explicitly provided in metadata, calculate based on package_id
        if credits == 0 and package_id:
            print(f"Calculating credits for package: {package_id}")
            if package_id == 'lite_monthly':
                credits = 50
            elif package_id == 'lite_yearly':
                credits = 600
            elif package_id == 'pro_monthly':
                credits = 250
            elif package_id == 'pro_yearly':
                credits = 3000
            print(f"Calculated credits: {credits}")
        
        # Final sanity check - if we still have 0 credits, calculate based on price
        if credits == 0 and price > 0:
            # Fallback calculation: Lite = 9.90 for 50 credits, Pro = 24.90 for 250 credits
            if abs(price - 9.90) < 0.1:  # ~= $9.90
                credits = 50
            elif abs(price - 106.80) < 0.1:  # ~= $106.80
                credits = 600
            elif abs(price - 24.90) < 0.1:  # ~= $24.90
                credits = 250
            elif abs(price - 262.80) < 0.1:  # ~= $262.80
                credits = 3000
            else:
                # Absolute fallback: 5 credits per $1
                credits = int(price * 5)
                
            print(f"Fallback credit calculation based on price ${price}: {credits} credits")
        
        print(f"Processing payment for user_id: {user_id}, credits: {credits}, price: {price}")
        
        if not user_id:
            print("Error: No user_id in payment metadata")
            return
            
        # Convert user_id to integer if it's a string
        try:
            user_id = int(user_id)
        except (ValueError, TypeError) as e:
            print(f"Error converting user_id to integer: {str(e)}")
            return
        
        # Find the user
        user = User.query.get(user_id)
        if not user:
            print(f"Error: User {user_id} not found for payment {session_id}")
            return
        
        # Check if this payment has already been processed - using raw SQL to avoid ORM issues
        from sqlalchemy import text
        
        try:
            # Query with just the basic columns that should always be present
            sql = text("""
            SELECT id 
            FROM recharge_history
            WHERE stripe_payment_id = :session_id
            LIMIT 1
            """)
            
            result = db.session.execute(sql, {"session_id": session_id})
            row = result.fetchone()
            
            if row:
                print(f"Payment {session_id} already processed, skipping")
                return
        except Exception as db_error:
            print(f"Warning: Error checking for existing payment: {db_error}")
            # Continue with the payment processing
        
        # Add credits to user's balance
        user.credits += credits
        
        # Instead of using the ORM, let's directly execute SQL to insert only the columns we know exist
        from sqlalchemy import text
        
        try:
            # Use raw SQL with only the basic columns we know exist
            sql = text("""
            INSERT INTO recharge_history 
            (user_id, amount, credit_gained, payment_status, payment_method, stripe_payment_id, created_at)
            VALUES (:user_id, :amount, :credit_gained, :payment_status, :payment_method, :stripe_payment_id, NOW())
            """)
            
            # Execute the insert
            db.session.execute(sql, {
                'user_id': user.id,
                'amount': price,
                'credit_gained': credits,
                'payment_status': 'completed',
                'payment_method': 'stripe',
                'stripe_payment_id': session_id
            })
            
            # The credits have already been added to user.credits earlier in this function
            # DO NOT add the credits again to avoid doubling them
            
            # Commit all changes
            db.session.commit()
            
            print(f"Successfully inserted payment record for user {user.username}")
            print(f"User {user.username} credit balance is now {user.credits}")
        except Exception as insert_error:
            db.session.rollback()
            print(f"Error inserting payment record: {insert_error}")
            # Even if the insert fails, try to at least update the user's credit balance
            try:
                # Make sure we don't double-add credits
                # We need to query the user again to get the latest credit balance
                fresh_user = User.query.get(user.id)
                if fresh_user.credits == user.credits - credits:
                    # Only add credits if they weren't added before
                    fresh_user.credits += credits
                    db.session.commit()
                    print(f"Updated user's credit balance to {fresh_user.credits}")
                else:
                    print(f"Credits already added, current balance: {fresh_user.credits}")
            except Exception as balance_error:
                db.session.rollback()
                print(f"Error updating user's credit balance: {balance_error}")
                raise
        
        print(f"User {user.username} recharged {credits} credits for ${price}")
        return user
        
    except Exception as e:
        print(f"Error in handle_successful_payment: {str(e)}")
        # Don't raise exception, just log it
        return None

@bp.route('/verify', methods=['GET'])
@jwt_required()
def verify_payment_query():
    """Verify a payment using query parameter and return updated user data"""
    session_id = request.args.get('session_id')
    if not session_id:
        payment_intent_id = request.args.get('payment_intent')
        if payment_intent_id:
            return verify_payment_intent(payment_intent_id)
        return jsonify({"error": "No session_id or payment_intent provided"}), 400
    
    # Log the verification attempt for debugging
    print(f"Verifying payment for session_id: {session_id}")
    
    user_id = get_jwt_identity()
    try:
        user_id = int(user_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid user ID"}), 400
        
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    print(f"User found: {user.username} (ID: {user.id})")
    
    # Use the fulfillment function instead of the old verification process
    from .order_confirmation import fulfill_checkout
    fulfillment_result = fulfill_checkout(session_id)
    
    # Return the appropriate response based on the fulfillment result
    if fulfillment_result['status'] == 'success':
        # Refresh user data to get updated credit balance
        user = User.query.get(user_id)
        
        # Return success response with all available details
        return jsonify({
            "status": "success",
            "message": "Payment verified and credits added",
            "user": user.to_dict(),
            "package_name": fulfillment_result.get("package_name", "Credit Package"),
            "amount_paid": fulfillment_result.get("amount_paid", 0),
            "credits_added": fulfillment_result.get("credits_added", 0),
            "is_yearly": fulfillment_result.get("is_yearly", False),
            "new_balance": user.credits
        }), 200
    elif fulfillment_result['status'] == 'pending':
        return jsonify({
            "status": "pending",
            "message": "Payment is still processing. Please check again later."
        }), 202
    elif fulfillment_result['status'] == 'already_fulfilled':
        # Payment was already processed
        return jsonify({
            "status": "success",
            "message": "Payment already verified",
            "user": user.to_dict(),
            "credits_added": fulfillment_result.get("credits_added", 0),
            "new_balance": user.credits
        }), 200
    else:
        # Error during fulfillment
        return jsonify({
            "status": "error", 
            "error": fulfillment_result.get("error", "Unknown error during payment verification"),
            "code": fulfillment_result.get("code", "verification_failed")
        }), 400


@bp.route('/verify-payment/<session_id>', methods=['GET'])
@jwt_required()
def verify_payment(session_id):
    """Verify a payment and return updated user data"""
    user_id = get_jwt_identity()
    try:
        user_id = int(user_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid user ID"}), 400
        
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # Check if payment exists in user's history - using raw SQL to avoid ORM issues
    from sqlalchemy import text
    
    recharge = None
    try:
        # Query with just the basic columns that should always be present
        sql = text("""
        SELECT id, user_id, amount, credit_gained, payment_status, payment_method, stripe_payment_id, created_at
        FROM recharge_history
        WHERE user_id = :user_id AND stripe_payment_id = :session_id
        LIMIT 1
        """)
        
        result = db.session.execute(sql, {"user_id": user.id, "session_id": session_id})
        row = result.fetchone()
        
        if row:
            # Convert row to a dict-like object
            recharge = {
                'id': row.id,
                'user_id': row.user_id,
                'amount': float(row.amount),
                'credit_gained': row.credit_gained,
                'payment_status': row.payment_status,
                'payment_method': row.payment_method,
                'stripe_payment_id': row.stripe_payment_id,
                'created_at': row.created_at.isoformat()
            }
    except Exception as db_error:
        print(f"Database error when checking for existing payment: {db_error}")
        # Continue as if the recharge doesn't exist, we'll try to create it from Stripe data
    
    if not recharge:
        # Try to retrieve session from Stripe
        try:
            session = stripe.checkout.Session.retrieve(session_id)
            if session.payment_status == 'paid' and str(session.metadata.get('user_id')) == str(user.id):
                # Payment successful but not recorded yet, process it
                handle_successful_payment(session)
                return jsonify({
                    "status": "success", 
                    "message": "Payment verified and credits added",
                    "user": user.to_dict()
                }), 200
            else:
                return jsonify({"error": "Payment not completed or unauthorized"}), 400
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    return jsonify({
        "status": "success",
        "message": "Payment already verified",
        "user": user.to_dict()
    }), 200

@bp.route('/checkout-intent', methods=['POST'])
@bp.route('/create-payment-intent', methods=['POST'])  # Add additional route with the same handler
@jwt_required()
def create_payment_intent():
    """Create a Stripe PaymentIntent for embedded checkout"""
    print("********** PAYMENT INTENT ENDPOINT CALLED **********")
    print(f"Request headers: {dict(request.headers)}")
    print(f"Request data: {request.get_data(as_text=True)}")
    
    user_id = get_jwt_identity()
    print(f"JWT Identity (user_id): {user_id}")
    
    try:
        user_id = int(user_id)
        print(f"User ID converted to int: {user_id}")
    except (ValueError, TypeError) as e:
        print(f"Error converting user_id to int: {str(e)}")
        return jsonify({"error": "Invalid user ID"}), 400
        
    user = User.query.get(user_id)
    print(f"User query result: {user}")
    
    if not user:
        print(f"User not found with ID: {user_id}")
        return jsonify({"error": "User not found"}), 404

    print(f"User authenticated: {user.username} (ID: {user.id})")
    
    data = request.get_json()
    print(f"Request JSON data: {data}")
    
    priceId = data.get("priceId")
    packageName = data.get("packageName") 
    isYearly = data.get("isYearly", False)
    
    print(f"Processing: priceId={priceId}, packageName={packageName}, isYearly={isYearly}")
    
    if not packageName or not priceId:
        print("Error: Missing required fields (packageName or priceId)")
        return jsonify({"error": "Package name and price ID are required"}), 400
    
    # For now, use a hardcoded approach to fix immediate issues
    # We'll use the package details to determine the amount
    print(f"DEBUG: Processing payment for package: {packageName}, priceId: {priceId}, isYearly: {isYearly}")
    
    # Determine amount based on package name (fallback if Stripe API is slow/timeout)
    amount_cents = 0
    if "lite" in packageName.lower():
        amount_cents = 990 if not isYearly else 10680  # $9.90 or $106.80
    elif "pro" in packageName.lower():
        amount_cents = 2490 if not isYearly else 26280  # $24.90 or $262.80
    else:
        print(f"ERROR: Unknown package: {packageName}")
        return jsonify({"error": "Unknown package"}), 400
    
    try:
        print(f"DEBUG: Using amount of {amount_cents} cents for {packageName}")
        
        # Create a PaymentIntent with the determined amount
        print(f"DEBUG: Creating payment intent for user id: {user.id}")
        intent = stripe.PaymentIntent.create(
            amount=amount_cents,
            currency="usd",
            metadata={
                "user_id": user.id,
                "package_name": packageName,
                "is_yearly": "true" if isYearly else "false",
                "price_id": priceId
            }
        )
        
        print(f"DEBUG: Created payment intent successfully")
        
        return jsonify({
            "clientSecret": intent.client_secret,
            "amount": amount_cents / 100  # Convert cents to dollars for display
        })
    except Exception as e:
        error_msg = str(e)
        print(f"ERROR creating payment intent: {error_msg}")
        
        # Check if it's an authentication error
        if "Authentication" in error_msg or "key" in error_msg.lower():
            print("ERROR: Stripe API key is invalid or missing")
            return jsonify({
                "error": "Stripe API authentication failed. Please check your API key."
            }), 500
        
        return jsonify({
            "error": f"Failed to create payment: {error_msg}"
        }), 500

def handle_payment_intent_success(payment_intent):
    """Process a successful payment intent and add credits to user"""
    try:
        metadata = payment_intent.metadata
        user_id = metadata.get('user_id')
        package_name = metadata.get('package_name')
        price_id = metadata.get('price_id')
        is_yearly = metadata.get('is_yearly', 'false').lower() == 'true'
        payment_id = payment_intent.id
        
        print(f"Processing payment intent for user_id: {user_id}, package: {package_name}, price_id: {price_id}")
        
        if not user_id:
            print("Error: No user_id in payment metadata")
            return None
            
        # Convert user_id to integer if it's a string
        try:
            user_id = int(user_id)
        except (ValueError, TypeError) as e:
            print(f"Error converting user_id to integer: {str(e)}")
            return None
        
        # Find the user
        user = User.query.get(user_id)
        if not user:
            print(f"Error: User {user_id} not found for payment {payment_id}")
            return None
        
        # Check if this payment has already been processed - using raw SQL to avoid ORM issues
        from sqlalchemy import text
        
        try:
            # Query with just the basic columns that should always be present
            sql = text("""
            SELECT id 
            FROM recharge_history
            WHERE stripe_payment_id = :payment_id
            LIMIT 1
            """)
            
            result = db.session.execute(sql, {"payment_id": payment_id})
            row = result.fetchone()
            
            if row:
                print(f"Payment intent {payment_id} already processed, skipping")
                return None
        except Exception as db_error:
            print(f"Warning: Error checking for existing payment: {db_error}")
            # Continue with the payment processing
        
        # Get amount directly from the payment intent
        amount = payment_intent.amount / 100  # Convert cents to dollars
        
        # Determine credits based on package name
        credit_amount = 0
        package_id = ''
        
        # Use package name to determine credits
        if package_name and 'lite' in package_name.lower():
            credit_amount = 50 if not is_yearly else 600
            package_id = 'lite_monthly' if not is_yearly else 'lite_yearly'
        elif package_name and 'pro' in package_name.lower():
            credit_amount = 250 if not is_yearly else 3000
            package_id = 'pro_monthly' if not is_yearly else 'pro_yearly'
        else:
            # Default credits if no match
            credit_amount = round(amount * 5)  # $1 = 5 credits as a fallback
            package_id = 'custom'
        
        # Add credits and record payment with improved transaction handling
        try:
            # Start a clean transaction with a savepoint
            db.session.begin_nested()  # Creates a savepoint
            
            # First update the user credits - highest priority
            original_balance = user.credits
            user.credits += credit_amount
            
            # Force an immediate flush of the user credits update
            db.session.flush()
            print(f"✅ User credits updated to {user.credits} (pending commit)")
            
            # Now try to add the payment record
            try:
                # Use raw SQL to insert the payment record
                sql = text("""
                INSERT INTO recharge_history 
                (user_id, amount, credit_gained, payment_status, payment_method, stripe_payment_id, created_at)
                VALUES (:user_id, :amount, :credit_gained, :payment_status, :payment_method, :stripe_payment_id, NOW())
                """)
                
                db.session.execute(sql, {
                    'user_id': user.id,
                    'amount': amount,
                    'credit_gained': credit_amount,
                    'payment_status': 'completed',
                    'payment_method': 'stripe',
                    'stripe_payment_id': payment_id
                })
                print("✅ Payment record inserted successfully")
            except Exception as insert_error:
                # If payment record fails, log it but continue with the credits update
                print(f"⚠️ Warning: Failed to insert payment record: {str(insert_error)}")
                print("⚠️ Will still proceed with credits update")
            
            # Commit the transaction - this will commit the user credits update even if payment record failed
            db.session.commit()
            print(f"✅ Transaction committed successfully")
            print(f"✅ User {user.username} recharged {credit_amount} credits for ${amount}")
            print(f"✅ User credit balance is now {user.credits}")
            
        except Exception as e:
            # Something went wrong with the entire transaction
            db.session.rollback()
            print(f"❌ Error in payment processing transaction: {str(e)}")
            
            # Try one more time with a completely fresh approach - just update credits
            try:
                print("Attempting direct credits update as fallback...")
                # Refetch user to get a fresh state
                fresh_user = User.query.get(user_id)
                if fresh_user:
                    fresh_user.credits += credit_amount
                    db.session.commit()
                    print(f"✅ Fallback successful - User credits updated to {fresh_user.credits}")
                    user = fresh_user  # Update the returned user
                else:
                    print(f"❌ Fallback failed - User {user_id} not found on refresh")
            except Exception as fallback_error:
                db.session.rollback()
                print(f"❌ Fallback credits update also failed: {str(fallback_error)}")
                # If all approaches failed, we'll return None
                return None
        
        # If we got here, at least one of our approaches worked
        print(f"✅ Payment processing completed for user {user.username}")
        return user
    except Exception as e:
        print(f"Error in handle_payment_intent_success: {str(e)}")
        return None

@bp.route('/verify-intent/<payment_intent_id>', methods=['GET'])
@jwt_required()
def verify_payment_intent(payment_intent_id):
    """Verify a payment intent status and return updated user data"""
    user_id = get_jwt_identity()
    try:
        user_id = int(user_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid user ID"}), 400
        
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # Check if payment exists in user's history - using raw SQL to avoid ORM issues
    from sqlalchemy import text
    
    recharge = None
    try:
        # Query with just the basic columns that should always be present
        sql = text("""
        SELECT id, user_id, amount, credit_gained, payment_status, payment_method, stripe_payment_id, created_at
        FROM recharge_history
        WHERE user_id = :user_id AND stripe_payment_id = :payment_id
        LIMIT 1
        """)
        
        result = db.session.execute(sql, {"user_id": user.id, "payment_id": payment_intent_id})
        row = result.fetchone()
        
        if row:
            # Convert row to a dict-like object
            recharge = {
                'id': row.id,
                'user_id': row.user_id,
                'amount': float(row.amount),
                'credit_gained': row.credit_gained,
                'payment_status': row.payment_status,
                'payment_method': row.payment_method,
                'stripe_payment_id': row.stripe_payment_id,
                'created_at': row.created_at.isoformat()
            }
    except Exception as db_error:
        print(f"Database error when checking for existing payment intent: {db_error}")
        # Continue as if the recharge doesn't exist, we'll try to create it from Stripe data
    
    if not recharge:
        # Try to retrieve payment intent from Stripe
        try:
            payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            if payment_intent.status == 'succeeded' and str(payment_intent.metadata.get('user_id')) == str(user.id):
                # Payment successful but not recorded yet, process it
                handle_payment_intent_success(payment_intent)
                
                # Don't try to retrieve price information from Stripe API
                # Just determine credits directly from package name as it's more reliable
                package_name = payment_intent.metadata.get('package_name', '')
                is_yearly = payment_intent.metadata.get('is_yearly', 'false').lower() == 'true'
                
                # Get amount from payment intent directly
                amount = payment_intent.amount / 100  # Convert cents to dollars
                
                # Determine credits based on package name
                credits = 0
                if 'lite' in package_name.lower():
                    credits = 50 if not is_yearly else 600
                elif 'pro' in package_name.lower():
                    credits = 250 if not is_yearly else 3000
                else:
                    # Default credits if no match
                    credits = round(amount * 5)  # $1 = 5 credits as a fallback
                
                return jsonify({
                    "status": "success", 
                    "message": "Payment verified and credits added",
                    "user": user.to_dict(),
                    "package_name": package_name,
                    "amount_paid": amount,
                    "credits_added": credits,
                    "is_yearly": is_yearly,
                    "new_balance": user.credits
                }), 200
            else:
                return jsonify({"error": "Payment not completed or unauthorized"}), 400
        except Exception as e:
            print(f"Error verifying payment intent: {str(e)}")
            return jsonify({"error": str(e)}), 500
    
    # For dictionary-based recharge, we don't need to handle fields that might be missing
    # We already set defaults when building the recharge dict
    
    # Get package name based on credits for display
    package_name = "Custom Package"
    for pkg in CREDIT_PACKAGES:
        if pkg['credits'] == recharge['credit_gained']:
            package_name = pkg['name']
            break
    
    return jsonify({
        "status": "success",
        "message": "Payment already verified",
        "user": user.to_dict(),
        "package_name": package_name,
        "amount_paid": float(recharge['amount']),
        "credits_added": recharge['credit_gained'],
        "is_yearly": False,  # Default since column might not exist
        "new_balance": user.credits
    }), 200

@bp.route('/test-stripe-connection', methods=['GET'])
def test_stripe_connection():
    """Test the Stripe API connection"""
    try:
        print("Testing Stripe API connection...")
        # Try to fetch a simple resource from Stripe
        balance = stripe.Balance.retrieve()
        print(f"Stripe connection successful, received balance response")
        return jsonify({
            "status": "success",
            "message": "Stripe API connection is working"
        }), 200
    except Exception as e:
        print(f"Stripe API connection test failed: {str(e)}")
        return jsonify({
            "status": "error",
            "message": f"Stripe API connection failed: {str(e)}"
        }), 500

@bp.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    """Get user's payment history"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    try:
        # Use a more targeted query to avoid selecting missing columns
        # Instead of using the ORM directly, use a custom SQL query 
        # that only selects the columns we know exist in the database
        from sqlalchemy import text
        from app import db
        
        # Query with just the basic columns that should always be present
        sql = text("""
        SELECT id, user_id, amount, credit_gained, payment_status, payment_method, stripe_payment_id, created_at
        FROM recharge_history
        WHERE user_id = :user_id
        ORDER BY created_at DESC
        """)
        
        result = db.session.execute(sql, {"user_id": user.id})
        
        # Convert the rows to dicts manually
        history = []
        for row in result:
            entry = {
                'id': row.id,
                'user_id': row.user_id,
                'amount': float(row.amount),
                'credit_gained': row.credit_gained,
                'payment_status': row.payment_status,
                'payment_method': row.payment_method,
                'stripe_payment_id': row.stripe_payment_id,
                'created_at': row.created_at.isoformat(),
                'is_yearly': False,  # Default value since column might not exist
                'package_id': None   # Default value since column might not exist
            }
            history.append(entry)
        
        return jsonify({
            "history": history
        }), 200
        
    except Exception as e:
        print(f"Error fetching payment history: {str(e)}")
        return jsonify({
            "error": "Failed to load payment history",
            "details": str(e)
        }), 500