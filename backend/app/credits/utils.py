from app.models.models import CreditLog, User, db
from datetime import datetime

def log_credit_change(user_id, change_amount, source_type, description, source_details=None):
    """
    Logs a credit change for a user and updates their credit balance.
    Ensures atomicity by handling session commits carefully.

    Args:
        user_id (int): The ID of the user.
        change_amount (int): The amount of credits changed (positive for addition, negative for deduction).
        source_type (str): The source of the credit change (e.g., 'plan_purchase', 'image_processing').
        description (str): A human-readable description of the transaction.
        source_details (str/JSON, optional): Additional details about the source.

    Returns:
        CreditLog or None: The created CreditLog object if successful, None otherwise.
    """
    user = User.query.get(user_id)
    if not user:
        # Optionally, log this error: print(f"Error: User with ID {user_id} not found for credit logging.")
        return None

    try:
        # Update user's credit balance
        # Assuming User model has a 'credits' field for the balance.
        # If you use 'credit_balance', adjust accordingly.
        user.credits = (user.credits or 0) + change_amount
        balance_after_change = user.credits

        new_log = CreditLog(
            user_id=user_id,
            timestamp=datetime.utcnow(),
            change_amount=change_amount,
            balance_after_change=balance_after_change,
            source_type=source_type,
            source_details=source_details,
            description=description
        )
        db.session.add(new_log)
        # The calling function should be responsible for db.session.commit()
        # to ensure this log is part of a larger atomic transaction if needed.
        # However, if this is a standalone operation, a commit here might be desired.
        # For now, we'll assume the caller handles the commit.
        # db.session.commit() # Example if standalone commit is needed

        return new_log
    except Exception as e:
        # Optionally, log this exception: print(f"Error logging credit change for user {user_id}: {e}")
        db.session.rollback() # Rollback in case of error during this operation
        return None 