from flask import request, jsonify, session
from db import get_db_connection
from routes.validations import validate_delete_wine
import mysql.connector

def delete_wine():
    
    data = request.get_json()
    
    errors = validate_delete_wine(data)

    if errors:
        return jsonify({
            "errors": errors
        }), 400

    wine_id = data["wine_id"]

    # 503 error for connection
    try:
        con = get_db_connection()
        cursor = con.cursor(dictionary=True)

    except mysql.connector.Error as err:
        print("Error:", err.errno)

        return jsonify({
            "error": "Could not connect with database"
        }), 503
    
    restaurant_id = session["restaurant_id"]
    # checking if wine exist
    check_sql = "SELECT * FROM wines WHERE wine_id = %s AND restaurant_id = %s"
    check_value= (wine_id,restaurant_id,)
    
    try:
        cursor.execute(check_sql, check_value)

        wine_exists = cursor.fetchone()
        if not wine_exists:
            return jsonify({
                "error": "wine id does not exist"
            }), 404
    
        # delete wine from wines table 
        sql = "DELETE FROM wines WHERE wine_id = %s AND restaurant_id = %s"
        values = (wine_id,)

        cursor.execute(sql, values)

        con.commit()

    except mysql.connector.Error as err:
        print("Error:", err)
        con.rollback()

        return jsonify({
            "error": "Could not delete wine from database"
        }), 500

    finally:
        cursor.close()
        con.close()

    return jsonify({
        "message": "Wine is deleted"
    }), 200   