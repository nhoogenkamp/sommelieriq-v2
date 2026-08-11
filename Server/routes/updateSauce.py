from flask import request, jsonify, session
from db import get_db_connection
from routes.validations import validate_sauce
import mysql.connector


def update_sauce():

    data = request.get_json()

    # Uses the already existing sauce validation.
    errors = validate_sauce(data)

    # Checks sauce_id separately because it is only needed when updating.
    if "sauce_id" not in data:
        errors.append("sauce_id is required")

    elif not isinstance(data.get("sauce_id"), int):
        errors.append("sauce_id must be a whole number")

    elif data["sauce_id"] < 1:
        errors.append("sauce_id must be greater than 0")

    if errors:
        return jsonify({
            "errors": errors
        }), 400

    sauce_id = data["sauce_id"]
    name = data["name"]
    body_modifier = data["body_modifier"]
    tannin_modifier = data["tannin_modifier"]
    acidity_modifier = data["acidity_modifier"]
    sweetness_modifier = data["sweetness_modifier"]
    available = data["available"]

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

    # Checks if the sauce exists and belongs to the logged-in restaurant.
    check_sql = """ SELECT * FROM sauces WHERE sauce_id = %s AND restaurant_id = %s """

    check_values = ( sauce_id, restaurant_id)

    try:
        cursor.execute(check_sql, check_values)

        sauce_exists = cursor.fetchone()

        if not sauce_exists:
            return jsonify({
                "error": "Sauce ID does not exist"
            }), 404

        # Updates the selected sauce.
        sql = """ UPDATE sauces SET name = %s, body_modifier = %s, tannin_modifier = %s, acidity_modifier = %s, sweetness_modifier = %s, available = %s
            WHERE sauce_id = %s AND restaurant_id = %s"""

        values = ( name, body_modifier, tannin_modifier,  acidity_modifier,sweetness_modifier, available, sauce_id,restaurant_id )

        cursor.execute(sql, values)

        con.commit()

    except mysql.connector.Error as err:
        print("Error:", err)
        con.rollback()

        return jsonify({
            "error": "Could not update sauce in database"
        }), 500

    finally:
        cursor.close()
        con.close()

    return jsonify({
        "message": "Sauce updated successfully"
    }), 200