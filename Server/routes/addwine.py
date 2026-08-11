from flask import request, jsonify, session
from db import get_db_connection
from routes.validations import validate_wine
#https://overiq.com/mysql-connector-python-101/exception-handling-in-connector-python/index.html
import mysql.connector

def add_wine():
    
    data = request.get_json()

    # checking erros in validations.py
    errors = validate_wine(data)

    if errors:
        return jsonify({
            "errors": errors
        }), 400

    restaurant_id = session["restaurant_id"]
    name = data["name"]
    wine_type = data["wine_type"]
    grape = data["grape"]
    country = data["country"]
    region = data["region"]
    year = data["year"]
    bottle_type = data["bottle_type"]
    price = data["price"]
    available = data["available"]
    description = data["description"]
    #colour is always 20
    colour_score = 20
    body_score = data["body_score"]
    tannin_score = data["tannin_score"]
    acidity_score = data["acidity_score"]
    sweetness_score = data["sweetness_score"]
    
    # 503 error for connection: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status
    try:
        con = get_db_connection()
        cursor = con.cursor(dictionary=True)

    except mysql.connector.Error as err:
        print("Error:", err.errno)

        return jsonify({
            "error": "Could not connect with database"
        }), 503

   
    # insert admin into admins table
    sql = "INSERT INTO wines (restaurant_id, name, wine_type, grape,country,region,year,bottle_type,price,available,description,colour_score,body_score,tannin_score,acidity_score,sweetness_score) " \
    "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    values = (restaurant_id, name, wine_type, grape,country,region,year,bottle_type,price,available,description,colour_score,body_score,tannin_score,acidity_score,sweetness_score)

    # executing try catch with rollback in case it fails 
    try:
        cursor.execute(sql, values)
        con.commit()

    # rollback https://www.geeksforgeeks.org/python/commit-rollback-operation-in-python/
    except mysql.connector.Error as err:
        print("Error:", err)
        con.rollback()

        return jsonify({
            "error": "Could not add wine to database"
        }), 500
    
    # https://www.w3schools.com/python/showpython.asp?filename=demo_try_except5
    finally: 
        cursor.close()
        con.close()

    # https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status#:~:text=The%20request%20succeeded%2C%20and%20a%20new%20resource%20was%20created%20as%20a%20result.%20This%20is%20typically%20the%20response%20sent%20after%20POST%20requests%2C%20or%20some%20PUT%20requests.
    return jsonify({
        "message": "New wines added"
    }), 201    