from flask import Blueprint

bp = Blueprint('settings', __name__, url_prefix='/settings')

# Import the routes
from . import routes