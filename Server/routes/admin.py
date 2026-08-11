from flask import session, request, jsonify
from db import get_db_connection
# flask library that helps create and read passwords
from werkzeug.security import generate_password_hash, check_password_hash
from routes.validations import validate_registration, validate_login
import mysql.connector

def add_admin():

    # get JSON data sent from JavaScript
    data = request.get_json()

    # checking erros in validations.py
    errors = validate_registration(data)

    if errors:
        return jsonify({
            "errors": errors
        }), 400

    if session["role"] == "manager" and data["role"] == "owner":
        return jsonify({
            "errors": ["Managers cannot create an Owner"]
        }), 403

    restaurant_id = session["restaurant_id"]
    username = data["username"]
    password = data["password"]
    role = data["role"]

    # turn normal password into hashed password
    password_hash = generate_password_hash(password)
    
    # 503 error for connection: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status
    try:
        con = get_db_connection()
        cursor = con.cursor(dictionary=True)

    except mysql.connector.Error as err:
        print("Error:", err.errno)

        return jsonify({
            "error": "Could not connect with database"
        }), 503
    
    try:
        # checking if user exist
        check_sql = "SELECT * FROM admins WHERE username = %s"
        check_value= (username,)
        
        cursor.execute(check_sql, check_value)

        admin_exists = cursor.fetchone()
        if admin_exists:
            return jsonify({
                "error": "Username already exists"
            }), 400

        # insert admin into admins table
        sql = "INSERT INTO admins (restaurant_id, username, password_hash, role) VALUES (%s, %s, %s, %s)"
        values = (restaurant_id, username, password_hash, role)

        cursor.execute(sql, values)

        con.commit()

    # rollback https://www.geeksforgeeks.org/python/commit-rollback-operation-in-python/
    except mysql.connector.Error as err:
        print("Error:", err)
        con.rollback()

        return jsonify({
            "error": "Could not add an account to the database"
        }), 500
    
    # https://www.w3schools.com/python/showpython.asp?filename=demo_try_except5
    finally: 
        cursor.close()
        con.close()

    return jsonify({
        "message": "Admin account created"
    }), 201

def login_admin():

    data = request.get_json()
    # checking erros in validations.py
    errors = validate_login(data)

    if errors:
        return jsonify({
            "errors": errors
        }), 400

    username = data["username"]
    password = data["password"]
    
    # 503 error for connection
    try:
        con = get_db_connection()
        cursor = con.cursor(dictionary=True)

    except mysql.connector.Error as err:
        print("Error:", err.errno)

        return jsonify({
            "error": "Could not connect with database"
        }), 503
    
    sql = "SELECT * FROM admins WHERE username = %s"
    values = (username,)

   # return 500 if query fails
    try:
        cursor.execute(sql, values)
        admin = cursor.fetchone()

    except mysql.connector.Error as err:
        print("Error:", err)

        return jsonify({
            "error": "Could not check login details"
        }), 500
    
    finally:
        cursor.close()
        con.close()


    # adding sessions: https://www.geeksforgeeks.org/python/login-and-registration-project-using-flask-and-mysql/
    # check if admin exists and password matches hashed password: https://medium.com/%40premnathm/implementing-login-functionality-in-a-flask-application-64929c6f146e#:~:text=if%20hashed_password%20and%20check_password_hash(hashed_password%5B0%5D%2C%20password)%3A%20%23%20Verify%20the%20password%20using%20check_password_hash%0Asession%5B%E2%80%98username%E2%80%99%5D%20%3D%20username%20%23%20Start%20a%20user%20session%0Aflash(%E2%80%98You%20were%20successfully%20logged%20in%E2%80%99)%0Areturn%20redirect(url_for(%E2%80%98index%E2%80%99))
    if admin and check_password_hash(admin["password_hash"], password):
        session["loggedin"] = True
        session["admin_id"] = admin["admin_id"]
        session["restaurant_id"] = admin["restaurant_id"]
        session["username"] = admin["username"]
        session["role"] = admin["role"]

        print(session)

        return jsonify({
            "message": "Login successful",
            "username": admin["username"],
            "restaurant_id": admin["restaurant_id"],
            "role": admin["role"]
        }), 200

    return jsonify({
        "error": "Incorrect username or password"
    }), 401

# checking if admin is logged in
def check_admin():

    if "loggedin" in session:

        return jsonify({
            "logged_in": True,
            "username": session["username"],
            "restaurant_id": session["restaurant_id"],
            "role": session["role"]
        }), 200

    return jsonify({
        "logged_in": False,
        "error": "Please login first"
    }), 401

# logout : https://www.geeksforgeeks.org/python/login-and-registration-project-using-flask-and-mysql/
def logout_admin():
    session.pop("loggedin", None)
    session.pop("admin_id", None)
    session.pop("restaurant_id", None)
    session.pop("username", None)
    session.pop("role", None)

    return jsonify({
        "message": "Logged out successfully"
    }), 200