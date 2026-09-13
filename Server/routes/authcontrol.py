from functools import wraps
from flask import session, jsonify
from db import get_db_connection


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
            if isinstance(allowed_roles, str):
                roles = [allowed_roles]
            else:
                roles = allowed_roles

            if session.get("role") not in roles:
                return jsonify({
                    "error": "Access denied"
                }), 403

            return function(*args, **kwargs)
        return decorated_function
    return decorator

# Checks that the logged-in user has the correct plan
def professional_required(function):
    @wraps(function)
    def decorated_function(*args, **kwargs):
        restaurant_id = session.get("restaurant_id")

        if not restaurant_id:
            return jsonify({
                "error": "Please login first"
            }), 401

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        sql = """ SELECT companies.plan FROM restaurants JOIN companies ON restaurants.company_id = companies.company_id WHERE restaurants.restaurant_id = %s """
        cursor.execute(sql, (restaurant_id,))
        company = cursor.fetchone()
        cursor.close()
        connection.close()

        if not company:
            return jsonify({
                "error": "Company subscription could not be found."
            }), 403

        if company["plan"] != "professional":
            return jsonify({
                "error": "This feature requires a Professional subscription."
            }), 403
        
        return function(*args, **kwargs)
    return decorated_function