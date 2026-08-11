from flask import request, jsonify, session
from db import get_db_connection
from routes.validations import validate_availability
import mysql.connector

def available_wine():

    data = request.get_json()

    # checking erros in validations.py
    errors = validate_availability(data)

    if errors:
        return jsonify({
            "errors": errors
        }), 400

    wine_id = data["wine_id"]
    available = data["available"]

    # 503 error for connection
    try:
        con = get_db_connection()
        cursor = con.cursor(dictionary=True)

    except mysql.connector.Error as err:
        print("Error:", err.errno)

        return jsonify({
            "error": "Could not connect with database"
        }), 503    

    # checking if wine exist with restaurant id
    restaurant_id = session["restaurant_id"]
    check_sql = "SELECT * FROM wines WHERE wine_id = %s AND restaurant_id = %s"
    check_value= (wine_id, restaurant_id,)
    
    try:
        cursor.execute(check_sql, check_value)

        wine_exists = cursor.fetchone()
        if not wine_exists:
            return jsonify({
                "error": "wine id does not exist"
            }), 404
        
        # update wine in wines table
        sql = "UPDATE wines SET available = %s WHERE wine_id = %s" 
        values = (available,wine_id)

        cursor.execute(sql, values)

        con.commit()
    except mysql.connector.Error as err:
        print("Error:", err)
        con.rollback()

        return jsonify({
            "error": "Could not update avialability wine from database"
        }), 500
    
    finally:
        cursor.close()
        con.close()

    return jsonify({
        "message": "Availability is updated"
    }), 200    