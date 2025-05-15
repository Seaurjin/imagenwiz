from flask import Blueprint

bp = Blueprint('credits', __name__, url_prefix='/api/credits')

from . import routes 