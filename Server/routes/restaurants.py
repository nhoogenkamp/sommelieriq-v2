from flask import jsonify
from db import get_db_connection
import mysql.connector

def get_public_restaurants():

    try:
        con = get_db_connection()
        cursor = con.cursor(dictionary=True)

    except mysql.connector.Error as err:
        print("Error:", err.errno)

        return jsonify({
            "error": "Could not connect with database"
        }), 503

    try:
        sql = """ SELECT restaurant_id, restaurant_name, outlet_name, city,  slug FROM restaurants ORDER BY restaurant_name, outlet_name"""
        cursor.execute(sql)
        restaurants = cursor.fetchall()
        
    except mysql.connector.Error as err:
        print("Error:", err)

        return jsonify({
            "error": "Could not load restaurants"
        }), 500

    finally:
        cursor.close()
        con.close()
    return jsonify(restaurants), 200