from flask import request, jsonify
from db import get_db_connection
from routes.validations import validate_restaurant_ID
import mysql.connector


# Gets all available food items for the selected restaurant.
def get_food():
    data = request.get_json()

    errors = validate_restaurant_ID(data)

    if errors:
        return jsonify({
            "errors": errors
        }), 400

    restaurant_id = data["restaurant_id"]

    # Returns 503 if the database connection fails.
    try:
        con = get_db_connection()
        cursor = con.cursor(dictionary=True)

    except mysql.connector.Error as err:
        print("Error:", err.errno)

        return jsonify({
            "error": "Could not connect with database"
        }), 503

    check_sql = """
        SELECT *
        FROM food_items
        WHERE restaurant_id = %s
          AND available = 1
        ORDER BY
            FIELD(
                category,
                'starter',
                'main',
                'dessert'
            ),
            dish_name ASC
    """

    check_value = (restaurant_id,)

    try:
        cursor.execute(check_sql, check_value)
        foods = cursor.fetchall()

    except mysql.connector.Error as err:
        print("Error:", err)

        return jsonify({
            "error": "Could not get food items from database"
        }), 500

    finally:
        cursor.close()
        con.close()

    return jsonify(foods), 200


# Gets all available sauces for the selected restaurant.
def get_sauces():
    data = request.get_json()

    errors = validate_restaurant_ID(data)

    if errors:
        return jsonify({
            "errors": errors
        }), 400

    restaurant_id = data["restaurant_id"]

    # Returns 503 if the database connection fails.
    try:
        con = get_db_connection()
        cursor = con.cursor(dictionary=True)

    except mysql.connector.Error as err:
        print("Error:", err.errno)

        return jsonify({
            "error": "Could not connect with database"
        }), 503

    check_sql = """
        SELECT *
        FROM sauces
        WHERE restaurant_id = %s
          AND available = 1
        ORDER BY name ASC
    """

    check_value = (restaurant_id,)

    try:
        cursor.execute(check_sql, check_value)
        sauces = cursor.fetchall()

    except mysql.connector.Error as err:
        print("Error:", err)

        return jsonify({
            "error": "Could not get sauces from database"
        }), 500

    finally:
        cursor.close()
        con.close()

    return jsonify(sauces), 200


# Gets all food items for the selected restaurant.
def get_dishes():
    data = request.get_json()
    errors = validate_restaurant_ID(data)

    if errors:
        return jsonify({
            "errors": errors
        }), 400

    restaurant_id = data["restaurant_id"]

    # Returns 503 if the database connection fails.
    try:
        con = get_db_connection()
        cursor = con.cursor(dictionary=True)

    except mysql.connector.Error as err:
        print("Error:", err.errno)

        return jsonify({
            "error": "Could not connect with database"
        }), 503

    check_sql = """
        SELECT *
        FROM food_items
        WHERE restaurant_id = %s
        ORDER BY
            FIELD(
                category,
                'starter',
                'main',
                'dessert'
            ),
            dish_name ASC
    """

    check_value = (restaurant_id,)

    try:
        cursor.execute(check_sql, check_value)
        foods = cursor.fetchall()

    except mysql.connector.Error as err:
        print("Error:", err)

        return jsonify({
            "error": "Could not get food items from database"
        }), 500

    finally:
        cursor.close()
        con.close()

    return jsonify(foods), 200
