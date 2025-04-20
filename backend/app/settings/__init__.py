from flask import Blueprint

bp = Blueprint('settings', __name__, url_prefix='/api/settings')

# Import the routes
from . import routes