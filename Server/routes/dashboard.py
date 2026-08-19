from flask import session, jsonify
from db import get_db_connection
import mysql.connector


def get_dashboard():

    restaurant_id = session["restaurant_id"]
    # 503 error for connection
    try:
        con = get_db_connection()
        cursor = con.cursor(dictionary=True)

    except mysql.connector.Error as err:
        print("Error:", err.errno)

        return jsonify({
            "error": "Could not connect with database"
        }), 503

    # Get total number of wines
    total_wines_sql = """ SELECT COUNT(*) AS total_wines FROM wines WHERE restaurant_id = %s """
    total_wines_value = (restaurant_id,)


    # Get total number of available wines
    available_wines_sql = """ SELECT COUNT(*) AS available_wines FROM wines WHERE restaurant_id = %s AND available = 1 """
    available_wines_value = (restaurant_id,)


    # Get total number of unavailable wines
    unavailable_wines_sql = """ SELECT COUNT(*) AS unavailable_wines FROM wines WHERE restaurant_id = %s AND available = 0 """
    unavailable_wines_value = (restaurant_id,)

    # Get total wines for each wine type
    wine_types_sql = """SELECT wine_type, COUNT(*) AS total FROM wines WHERE restaurant_id = %s GROUP BY wine_type"""
    wine_types_value = (restaurant_id,)

    try:
        cursor.execute(total_wines_sql,total_wines_value)
        total_wines = cursor.fetchone()


        cursor.execute( available_wines_sql, available_wines_value )
        available_wines = cursor.fetchone()


        cursor.execute(unavailable_wines_sql, unavailable_wines_value )
        unavailable_wines = cursor.fetchone()

        cursor.execute(wine_types_sql, wine_types_value )
        wine_types = cursor.fetchall()

    except mysql.connector.Error as err:
        print("Error:", err)

        return jsonify({
            "error": "Could not get dashboard information from database"
        }), 500

    finally:
        cursor.close()
        con.close()

    return jsonify({
        "total_wines": total_wines["total_wines"],
        "available_wines": available_wines["available_wines"],
        "unavailable_wines": unavailable_wines["unavailable_wines"],
        "wine_types": wine_types
    }), 200