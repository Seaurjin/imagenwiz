from datetime import datetime
# Fix circular import issue - import from parent package
from .. import db, bcrypt

class SiteSettings(db.Model):
    """
    Site-wide settings for the application, editable by admins
    """
    __tablename__ = 'site_settings'
    
    id = db.Column(db.Integer, primary_key=True)
    setting_key = db.Column(db.String(100), unique=True, nullable=False)
    setting_value = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convert setting to dictionary for API responses"""
        return {
            'id': self.id,
            'key': self.setting_key,
            'value': self.setting_value,
            'updated_at': self.updated_at.isoformat()
        }

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    credits = db.Column(db.Integer, default=0, nullable=False)
    credit_balance = db.Column(db.Integer, default=0, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_admin = db.Column(db.Boolean, default=False)
    
    # Relationships
    recharge_history = db.relationship('RechargeHistory', backref='user', lazy=True)
    matting_history = db.relationship('MattingHistory', backref='user', lazy=True)
    
    def set_password(self, password):
        """Hash password before storing"""
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')
        
    def check_password(self, password):
        """Check if provided password matches stored hash"""
        return bcrypt.check_password_hash(self.password, password)
        
    def to_dict(self):
        """Convert user to dictionary for API responses"""
        return {
            'id': self.id,
            'username': self.username,
            'credits': self.credits,  # Updated for consistency
            'created_at': self.created_at.isoformat(),
            'is_admin': self.is_admin
        }
        
class RechargeHistory(db.Model):
    """
    RechargeHistory tracks payments and credit recharges.
    The is_yearly and package_id columns may be missing in older database instances
    and will be added by a migration script.
    """
    __tablename__ = 'recharge_history'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    credit_gained = db.Column(db.Integer, nullable=False)
    payment_status = db.Column(db.String(20), nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)
    stripe_payment_id = db.Column(db.String(100))
    # These columns may be missing and need to be added by migrations
    is_yearly = db.Column(db.Boolean, default=False)
    package_id = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert recharge history to dictionary for API responses"""
        result = {
            'id': self.id,
            'user_id': self.user_id,
            'amount': float(self.amount),
            'credit_gained': self.credit_gained,
            'payment_status': self.payment_status,
            'payment_method': self.payment_method,
            'stripe_payment_id': self.stripe_payment_id,
            'created_at': self.created_at.isoformat()
        }
        
        # Only add these fields if they exist in the model
        if hasattr(self, 'is_yearly'):
            result['is_yearly'] = self.is_yearly
        else:
            result['is_yearly'] = False
            
        if hasattr(self, 'package_id'):
            result['package_id'] = self.package_id
        else:
            result['package_id'] = None
            
        return result
        
class MattingHistory(db.Model):
    __tablename__ = 'matting_history'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    original_image_url = db.Column(db.String(255), nullable=False)
    processed_image_url = db.Column(db.String(255), nullable=False)
    credit_spent = db.Column(db.Integer, default=1, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert matting history to dictionary for API responses"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'original_image_url': self.original_image_url,
            'processed_image_url': self.processed_image_url,
            'credit_spent': self.credit_spent,
            'created_at': self.created_at.isoformat()
        }