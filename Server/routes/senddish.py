from flask import request, jsonify
from db import get_db_connection
from routes.recommendation import calculate_match
from routes.validations import validate_senddish
import mysql.connector

# Function handles POST request from frontend
def send_dish():

    # Reading the JSON sent
    data = request.get_json()
    # Print received data in Flask terminal
    errors = validate_senddish(data)

    if errors:
        return jsonify({
            "errors": errors
        }), 400

    # 503 error for connection
    try:
        con = get_db_connection()
        cursor = con.cursor(dictionary=True)

    except mysql.connector.Error as err:
        print("Error:", err.errno)

        return jsonify({
            "error": "Could not connect with database"
        }), 503

    try:
        # Get the value stored in the key both dishes and sauces
        selected_dishes = data["dishes"]
        restaurant_id = data["restaurant_id"]

        individual_recommendations = []
        combined_recommendations = []

        for selected in selected_dishes:

            selected_dish = selected["dish"]
            selected_sauce = selected["sauce"]

            # SQL query searches for matching food item : https://www.w3schools.com/python/python_mysql_where.asp
            sql = """ SELECT * FROM food_items WHERE dish_name = %s AND restaurant_id = %s AND available = 1"""
            dish = (selected_dish, restaurant_id)

            # Execute SQL query safely to prevent SQL Injection
            cursor.execute(sql, dish)

            # Get matching food rows from database
            foods = cursor.fetchone()

            if not foods:
                return jsonify({
                    "error": "Dish not found"
                }), 404
                

            sauces = None

            if selected_sauce != "":
                sauce_sql = "SELECT * FROM sauces WHERE name = %s"
                sauce = (selected_sauce,)
                cursor.execute(sauce_sql, sauce)
                sauces = cursor.fetchone()

    


            #sql query to get all wines 
            wine_sql = "SELECT * FROM wines WHERE restaurant_id = %s AND available = 1"
            check_value= (restaurant_id,)

            cursor.execute(wine_sql,check_value)
            wines = cursor.fetchall()

            #creating an empty list to store recommendations
            recommendations = []
            
            #looping through wines and calculate each wine based on food ordered 
            for wine in wines:
                score = calculate_match(foods,wine,sauces)
                
                # creating a copy to sent multiple back: https://www.w3schools.com/python/ref_list_copy.asp
                wine_result = wine.copy()
                wine_result["match_percentage"] = score
                recommendations.append(wine_result)

            # change the order of recommendations based on match percentage: https://www.w3schools.com/python/trypython.asp?filename=demo_lambda_sorted
            recommendations = sorted (recommendations, key=lambda x: x["match_percentage"],reverse=True)
    

            individual_recommendations.append({
                "dish": selected_dish,
                "sauce": selected_sauce,
                "recommendations": recommendations 
        })
    

        # calculate combined recommendations if more than 1 dish selected
        if len(selected_dishes) > 1:

            for wine in wines:

                total_score = 0

                for group in individual_recommendations:

                    for dish_wine in group["recommendations"]:

                        if dish_wine["wine_id"] == wine["wine_id"]:

                            total_score += dish_wine["match_percentage"]

                average_score = total_score / len(selected_dishes)

                wine_result = wine.copy()
                wine_result["match_percentage"] = round(average_score)

                combined_recommendations.append(wine_result)

        combined_recommendations = sorted(
            combined_recommendations,
            key=lambda x: x["match_percentage"],
            reverse=True
        )
    except mysql.connector.Error as err:
        print("Error:", err)

        return jsonify({
            "error": "Could not give recommendations from the database"
        }), 500
    
    finally:
        # Close cursor
        cursor.close()

        # Close database connection
        con.close()

    return jsonify({
        
    # recommendations returned from from calculations and added match percentage
    "recommendations": individual_recommendations,

    # recommendations for avarage matching score based on all food selected
    "combined_recommendations": combined_recommendations 
    }), 200 
