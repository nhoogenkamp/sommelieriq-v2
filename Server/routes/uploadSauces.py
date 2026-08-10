from flask import request, jsonify, session
from db import get_db_connection
from routes.validations import validate_sauce
# https://overiq.com/mysql-connector-python-101/exception-handling-in-connector-python/index.html
import mysql.connector


def upload_sauces():

    if not session.get("loggedin"):
        return jsonify({
            "error": "Please login first"
        }), 401

    data = request.get_json()

    if not data or "sauces" not in data:
        return jsonify({
            "error": "Please provide sauces"
        }), 400

    sauces = data["sauces"]

    if not isinstance(sauces, list) or len(sauces) == 0:
        return jsonify({
            "error": "Please provide at least one sauce"
        }), 400

    validation_errors = []

    # Checks every sauce using the already existing validation function.
    # https://www.geeksforgeeks.org/python/enumerate-in-python/
    for index, sauce in enumerate(sauces):
        errors = validate_sauce(sauce)

        if errors:
            validation_errors.append({
                "row": index + 2,
                "errors": errors
            })

    # Nothing is inserted when one or more sauces are invalid.
    if validation_errors:
        return jsonify({
            "error": "Some sauces contain invalid data",
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

    sql = "INSERT INTO sauces (restaurant_id, name, body_modifier, tannin_modifier, acidity_modifier, sweetness_modifier, available) " \
          "VALUES (%s, %s, %s, %s, %s, %s, %s)"

    try:
        for sauce in sauces:
            name = sauce["name"]
            body_modifier = sauce["body_modifier"]
            tannin_modifier = sauce["tannin_modifier"]
            acidity_modifier = sauce["acidity_modifier"]
            sweetness_modifier = sauce["sweetness_modifier"]
            available = sauce["available"]

            values = (restaurant_id,name,body_modifier, tannin_modifier,acidity_modifier, sweetness_modifier,available )

            cursor.execute(sql, values)

        # Saves every sauce only after all inserts succeed.
        con.commit()

    except mysql.connector.Error as err:
        print("Error:", err)
        con.rollback()

        return jsonify({
            "error": "Could not upload sauces to database"
        }), 500

    finally:
        cursor.close()
        con.close()

    return jsonify({
        "message": f"{len(sauces)} sauces uploaded successfully"
    }), 201