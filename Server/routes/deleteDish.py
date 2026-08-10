from flask import request, jsonify, session
from db import get_db_connection
from routes.validations import validate_delete_dish
import mysql.connector


def delete_dish():

    if not session.get("loggedin"):
        return jsonify({
            "error": "Please login first"
        }), 401

    data = request.get_json()

    # Checks the food ID using the existing validation function.
    errors = validate_delete_dish(data)

    if errors:
        return jsonify({
            "errors": errors
        }), 400

    food_id = data["food_id"]

    # 503 error for connection.
    try:
        con = get_db_connection()
        cursor = con.cursor(dictionary=True)

    except mysql.connector.Error as err:
        print("Error:", err.errno)

        return jsonify({
            "error": "Could not connect with database"
        }), 503

    restaurant_id = session["restaurant_id"]

    # Checks if the dish exists and belongs to the logged-in restaurant.
    check_sql = "SELECT * FROM food_items WHERE food_id = %s AND restaurant_id = %s"
    check_value = (food_id, restaurant_id)

    try:
        cursor.execute(check_sql, check_value)

        dish_exists = cursor.fetchone()

        if not dish_exists:
            return jsonify({
                "error": "Food ID does not exist"
            }), 404

        # Deletes the dish from the correct restaurant.
        sql = "DELETE FROM food_items WHERE food_id = %s AND restaurant_id = %s"
        values = (food_id, restaurant_id)

        cursor.execute(sql, values)

        con.commit()

    except mysql.connector.Error as err:
        print("Error:", err)
        con.rollback()

        return jsonify({
            "error": "Could not delete dish from database"
        }), 500

    finally:
        cursor.close()
        con.close()

    return jsonify({
        "message": "Dish is deleted"
    }), 200