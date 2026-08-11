from flask import request, jsonify, session
from db import get_db_connection
from routes.validations import validate_dishes
import mysql.connector


def update_dish():

    data = request.get_json()

    # Uses the already existing dish validation.
    errors = validate_dishes(data)

    # Checks food_id separately because it is only needed when updating.
    if "food_id" not in data:
        errors.append("food_id is required")

    elif not isinstance(data.get("food_id"), int):
        errors.append("food_id must be a whole number")

    elif data["food_id"] < 1:
        errors.append("food_id must be greater than 0")

    if errors:
        return jsonify({
            "errors": errors
        }), 400

    food_id = data["food_id"]
    dish_name = data["dish_name"]
    category = data["category"]
    description = data["description"]
    body_score = data["body_score"]
    tannin_score = data["tannin_score"]
    acidity_score = data["acidity_score"]
    sweetness_score = data["sweetness_score"]
    available = data["available"]
    colour_wine = data["colour_wine"]
    requires_sauce = data["requires_sauce"]

    # Uses the restaurant belonging to the logged-in administrator.
    restaurant_id = session["restaurant_id"]

    # 503 error for connection.
    try:
        con = get_db_connection()
        cursor = con.cursor(dictionary=True)

    except mysql.connector.Error as err:
        print("Error:", err.errno)

        return jsonify({
            "error": "Could not connect with database"
        }), 503

    # Checks if the dish exists and belongs to the logged-in restaurant.
    check_sql = """ SELECT * FROM food_items WHERE food_id = %s AND restaurant_id = %s"""

    check_values = (food_id, restaurant_id)

    try:
        cursor.execute(check_sql, check_values)

        dish_exists = cursor.fetchone()

        if not dish_exists:
            return jsonify({
                "error": "Food ID does not exist"
            }), 404

        # Updates the selected dish.
        sql = """ UPDATE food_items SET dish_name = %s, category = %s, description = %s, body_score = %s, tannin_score = %s, acidity_score = %s, sweetness_score = %s, available = %s, colour_wine = %s, requires_sauce = %s
            WHERE food_id = %s AND restaurant_id = %s """

        values = ( dish_name, category, description, body_score, tannin_score, acidity_score, sweetness_score, available, colour_wine, requires_sauce, food_id, restaurant_id)

        cursor.execute(sql, values)

        con.commit()

    except mysql.connector.Error as err:
        print("Error:", err)
        con.rollback()

        return jsonify({
            "error": "Could not update dish in database"
        }), 500

    finally:
        cursor.close()
        con.close()

    return jsonify({
        "message": "Dish updated successfully"
    }), 200