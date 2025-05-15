from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.models import User, CreditLog, db
from . import bp

@bp.route('/history', methods=['GET'])
@jwt_required()
def get_credit_history():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int)

    try:
        credit_logs_pagination = CreditLog.query.filter_by(user_id=user.id)\
            .order_by(CreditLog.timestamp.desc())\
            .paginate(page=page, per_page=limit, error_out=False)
        
        credit_logs = credit_logs_pagination.items
        
        return jsonify({
            "history": [log.to_dict() for log in credit_logs],
            "total_pages": credit_logs_pagination.pages,
            "current_page": page,
            "total_items": credit_logs_pagination.total
        }), 200

    except Exception as e:
        # Log the exception e
        return jsonify({"error": "Could not retrieve credit history", "message": str(e)}), 500 