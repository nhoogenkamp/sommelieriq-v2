from functools import wraps
from flask import session, jsonify


# Checks that the user is logged in before allowing access.
# https://flask.palletsprojects.com/en/stable/patterns/viewdecorators/
# https://flask-user.readthedocs.io/en/latest/authorization.html

def login_required(function):
    @wraps(function)
    def decorated_function(*args, **kwargs):
        if not session.get("loggedin"):
            return jsonify({
                "error": "Please login first"
            }), 401
        return function(*args, **kwargs)
    return decorated_function

# Checks that the logged-in user has one of the allowed roles.
def roles_required(allowed_roles):
    def decorator(function):
        @wraps(function)
        def decorated_function(*args, **kwargs):
            # User must be logged in first.
            if not session.get("loggedin"):
                return jsonify({
                    "error": "Please login first"
                }), 401

            # User must have one of the allowed roles.
            if session.get("role") not in allowed_roles:
                return jsonify({
                    "error": "You do not have permission to take this action, please contact your system administrator."
                }), 403

            return function(*args, **kwargs)
        return decorated_function
    return decorator