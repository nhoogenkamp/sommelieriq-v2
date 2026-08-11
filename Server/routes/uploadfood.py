from flask import request, jsonify, session
from db import get_db_connection
from routes.validations import validate_dishes
# https://overiq.com/mysql-connector-python-101/exception-handling-in-connector-python/index.html
import mysql.connector
# copied from upload wines and changed accordingly for food upload

def upload_dishes():

    data = request.get_json()

    if not data or "dishes" not in data:
        return jsonify({
            "error": "Please provide dishes"
        }), 400

    dishes = data["dishes"]

    if not isinstance(dishes, list) or len(dishes) == 0:
        return jsonify({
            "error": "Please provide at least one dish"
        }), 400

    validation_errors = []

    # Checks every dish using the already existing validation function.
    # https://www.geeksforgeeks.org/python/enumerate-in-python/
    for index, dish in enumerate(dishes):
        errors = validate_dishes(dish)

        if errors:
            validation_errors.append({
                "row": index + 2,
                "errors": errors
            })

    # Nothing is inserted when one or more dishes are invalid.
    if validation_errors:
        return jsonify({
            "error": "Some dishes contain invalid data",
            "errors": validation_errors
        }), 400

    restaurant_id = session["restaurant_id"]

    try:
        con = get_db_connection()
        cursor = con.cursor(dictionary=True)

    except mysql.connector.Error as err:
        print("Error:", err.errno)

        return jsonify({
            "error": "Could not connect with database"
        }), 503

    sql = "INSERT INTO food_items (restaurant_id, dish_name, category, description, colour_score, body_score, tannin_score, acidity_score, sweetness_score, available, colour_wine, requires_sauce) " \
        "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"

    try:
        for dish in dishes:
            dish_name = dish["dish_name"]
            category = dish["category"]
            description = dish["description"]
            body_score = dish["body_score"]
            tannin_score = dish["tannin_score"]
            acidity_score = dish["acidity_score"]
            sweetness_score = dish["sweetness_score"]
            available = dish["available"]
            colour_wine = dish["colour_wine"]
            requires_sauce = dish["requires_sauce"]
            # Colour is always set automatically.
            colour_score = 20


            values = (restaurant_id, dish_name, category, description, colour_score, body_score, tannin_score, acidity_score, sweetness_score, available, colour_wine, requires_sauce)

            cursor.execute(sql, values)

        # Saves every wine only after all inserts succeed.
        con.commit()

    except mysql.connector.Error as err:
        print("Error:", err)
        con.rollback()

        return jsonify({
            "error": "Could not upload dishes to database"
        }), 500

    finally:
        cursor.close()
        con.close()

    return jsonify({
        "message": f"{len(dishes)} Dishes uploaded successfully"
    }), 201