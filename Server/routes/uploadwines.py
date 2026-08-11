from flask import request, jsonify, session
from db import get_db_connection
from routes.validations import validate_wine
# https://overiq.com/mysql-connector-python-101/exception-handling-in-connector-python/index.html
import mysql.connector


def upload_wines():

    data = request.get_json()

    if not data or "wines" not in data:
        return jsonify({
            "error": "Please provide wines"
        }), 400

    wines = data["wines"]

    if not isinstance(wines, list) or len(wines) == 0:
        return jsonify({
            "error": "Please provide at least one wine"
        }), 400

    validation_errors = []

    # Checks every wine using the already existing validation function.
    # https://www.geeksforgeeks.org/python/enumerate-in-python/
    for index, wine in enumerate(wines):
        errors = validate_wine(wine)

        if errors:
            validation_errors.append({
                "row": index + 2,
                "errors": errors
            })

    # Nothing is inserted when one or more wines are invalid.
    if validation_errors:
        return jsonify({
            "error": "Some wines contain invalid data",
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

    sql = "INSERT INTO wines (restaurant_id, name, wine_type, grape, country, region, year, bottle_type, price, available, description, colour_score, body_score, tannin_score, acidity_score, sweetness_score) " \
          "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"

    try:
        for wine in wines:
            name = wine["name"]
            wine_type = wine["wine_type"]
            grape = wine["grape"]
            country = wine["country"]
            region = wine["region"]
            year = wine["year"]
            bottle_type = wine["bottle_type"]
            price = wine["price"]
            available = wine["available"]
            description = wine["description"]
            # Colour is always set automatically.
            colour_score = 20
            body_score = wine["body_score"]
            tannin_score = wine["tannin_score"]
            acidity_score = wine["acidity_score"]
            sweetness_score = wine["sweetness_score"]

            values = (restaurant_id, name, wine_type, grape, country, region, year, bottle_type, price, available, description, colour_score, body_score, tannin_score, acidity_score, sweetness_score)

            cursor.execute(sql, values)

        # Saves every wine only after all inserts succeed.
        con.commit()

    except mysql.connector.Error as err:
        print("Error:", err)
        con.rollback()

        return jsonify({
            "error": "Could not upload wines to database"
        }), 500

    finally:
        cursor.close()
        con.close()

    return jsonify({
        "message": f"{len(wines)} wines uploaded successfully"
    }), 201