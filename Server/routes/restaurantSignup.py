from flask import request, jsonify
import re
import os
from db import get_db_connection
# flask library that helps create and read passwords
from werkzeug.security import generate_password_hash
from routes.validations import validate_signup
import stripe
import mysql.connector

#https://docs.stripe.com/billing/quickstart?accounts-namespace=v1&client=react&lang=python
client = stripe.StripeClient(os.getenv("STRIPE_SECRET_KEY"))
FRONTEND_URL = os.getenv("FRONTEND_URL")

def restaurantSignup():

    data = request.get_json()
    # checking erros in validations.py
    errors = validate_signup(data)

    if errors:
        return jsonify({
            "errors": errors
        }), 400

    username = data["username"]
    password = data["password"]
    company_name= data["company_name"]
    restaurant_name= data["restaurant_name"]
    outlet_name= data["outlet_name"]
    city= data["city"]
    email= data["email"]
    plan= data["plan"]
    address= data["address"]
    phone= data["phone"]


    # Select the correct Stripe price based on the plan
    # selected on the SommelierIQ pricing page.
    if plan == "essential":
        price_id = os.getenv("STRIPE_ESSENTIAL_PRICE_ID")

    elif plan == "professional":
        price_id = os.getenv("STRIPE_PROFESSIONAL_PRICE_ID")

    else:
        return jsonify({
            "error": "Invalid subscription plan"
        }), 400    


    # turn normal password into hashed password
    password_hash = generate_password_hash(password)

    # Create restaurant slug from restaurant name.
    slug = restaurant_name.lower()
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    slug = slug.strip("-")

        
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
        # checking if user exists
        check_sql = """
        SELECT *
        FROM admins
        WHERE email = %s OR username = %s
        """
        check_values = (email, username)

        cursor.execute(
            check_sql,
            check_values
        )

        admin_exists = cursor.fetchone()

        if admin_exists:
            return jsonify({
                "error": "User already exists"
            }), 400  

        # checking if restaurant slug already exists
        check_slug_sql = """
        SELECT restaurant_id
        FROM restaurants
        WHERE slug = %s
        """
        check_slug_values = (slug,)

        cursor.execute(
            check_slug_sql,
            check_slug_values
        )

        restaurant_exists = cursor.fetchone()

        if restaurant_exists:
            return jsonify({
                "error": "A restaurant with this name already exists"
            }), 400

        # Create company first.
        # Subscription remains pending until Stripe confirms payment.
        company_sql = """ INSERT INTO companies( company_name, email, plan, subscription_status) VALUES (%s, %s, %s, %s)"""
        company_values = (company_name, email, plan,"pending")
        cursor.execute(company_sql, company_values)

        # Get the company ID that was automatically created.
        #https://zetcode.com/python/sqlite3-cursor-lastrowid/
        company_id = cursor.lastrowid

        # Create restaurant and connect it to the company.
        restaurant_sql = """INSERT INTO restaurants( company_id, restaurant_name, outlet_name, city, address, email, phone, slug)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s) """
        restaurant_values = (company_id, restaurant_name, outlet_name, city,address, email, phone, slug)
        cursor.execute( restaurant_sql, restaurant_values )

        # Get the restaurant ID that was automatically created.
        #https://zetcode.com/python/sqlite3-cursor-lastrowid/
        restaurant_id = cursor.lastrowid

        # Create the first owner account.
        # The owner chooses their own password during signup,
        # therefore a temporary password is not required.
        admin_sql = """ INSERT INTO admins( restaurant_id,username, email, password_hash, role, verified) VALUES (%s, %s, %s, %s, %s, %s) """
        admin_values = ( restaurant_id, username, email, password_hash, "owner", True)
        cursor.execute( admin_sql, admin_values)

        # Stripe Checkout
        # https://docs.stripe.com/billing/quickstart?accounts-namespace=v1&client=react&lang=python
        try:
            checkout_session = client.v1.checkout.sessions.create(params={
                    "line_items": [
                        {
                            'price': price_id,
                            'quantity': 1,
                        },
                    ],
                    'mode': 'subscription',
                    'success_url': FRONTEND_URL +
                        '/signup/success?success=true&session_id={CHECKOUT_SESSION_ID}',

                    'cancel_url': FRONTEND_URL +
                        '/pricing',
                }
            )
            # Save company, restaurant and owner.
            con.commit()

        except Exception as e:
            print(e)

            con.rollback()

            return jsonify({
                "error": "Could not create payment session"
            }), 500
        
    except mysql.connector.Error as err:
        print("Error:", err)

        con.rollback()

        return jsonify({
            "error": "Could not create restaurant account"
        }), 500
    
    finally:
        cursor.close()
        con.close()

    return jsonify({
        "message": "Restaurant account created",
        "checkout_url": checkout_session.url
    }), 201