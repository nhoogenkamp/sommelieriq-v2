from flask import request, jsonify, session
from db import get_db_connection
from routes.validations import validate_restaurant_ID
import mysql.connector

# reference: https://www.youtube.com/watch?v=14HTiBQEQ9M
# added dictorionary = true to read data in client side: https://stackoverflow.com/questions/22769873/python-mysql-connector-dictcursor
# order changed https://www.w3schools.com/sql/sql_orderby.asp

def get_tables():
    con = get_db_connection()
    cursor = con.cursor()
    cursor.execute("SHOW TABLES;")
    tables = cursor.fetchall()
    cursor.close()
    con.close()
    table_names = [table[0] for table in tables]
    return jsonify({"tables": table_names}), 200

#Home page wines available and set per restaurant
def get_wines():
    data = request.get_json()

    errors = validate_restaurant_ID(data)

    if errors:
        return jsonify({
            "errors": errors
        }), 400
    restaurant_id = data["restaurant_id"]

    # 503 error for connection
    try:
        con = get_db_connection()
        cursor = con.cursor(dictionary=True)

    except mysql.connector.Error as err:
        print("Error:", err.errno)

        return jsonify({
            "error": "Could not connect with database"
        }), 503

    check_sql ="""
    SELECT * FROM wines WHERE restaurant_id = %s AND available = 1
    ORDER BY
        FIELD(
            bottle_type,
            'Glass',
            'Half Bottle',
            'Bottle',
            'Magnum',
            'Double Magnum',
            'Jeroboam',
            'Imperial',
            'Salmanazar',
            'Melchior'
        ),
        wine_type ASC,
        country ASC,
        price ASC
    """ 
    check_value= (restaurant_id,)
    try:
        cursor.execute(check_sql,check_value)
        wines = cursor.fetchall()
    
    except mysql.connector.Error as err:
        print("Error:", err)

        return jsonify({
            "error": "Could not get wines from database"
        }), 500 
        

    finally:  
        cursor.close()
        con.close()
    return jsonify(wines), 200

def get_all_wines():
    
    restaurant_id = session["restaurant_id"]

    # 503 error for connection
    try:
        con = get_db_connection()
        cursor = con.cursor(dictionary=True)

    except mysql.connector.Error as err:
        print("Error:", err.errno)

        return jsonify({
            "error": "Could not connect with database"
        }), 503
    check_sql = """
    SELECT * FROM wines WHERE restaurant_id = %s
    ORDER BY
        FIELD(
            bottle_type,
            'Glass',
            'Half Bottle',
            'Bottle',
            'Magnum',
            'Double Magnum',
            'Jeroboam',
            'Imperial',
            'Salmanazar',
            'Melchior'
        ),
        wine_type ASC,
        country ASC,
        price ASC
    """
    check_value= (restaurant_id,)
    try:
        cursor.execute(check_sql,check_value)
        wines = cursor.fetchall()
    
    except mysql.connector.Error as err:
        print("Error:", err)

        return jsonify({
            "error": "Could not get wines from database"
        }), 500  

    finally:  
        cursor.close()
        con.close()
    return jsonify(wines), 200