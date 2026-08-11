from functools import wraps
from flask import session, jsonify


# Checks that the user is logged in before allowing access.
# https://flask.palletsprojects.com/en/stable/patterns/viewdecorators/

def login_required(function):
    @wraps(function)
    def decorated_function(*args, **kwargs):
        if not session.get("loggedin"):
            return jsonify({
                "error": "Please login first"
            }), 401
        return function(*args, **kwargs)
    return decorated_function