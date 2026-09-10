import os
from flask import jsonify, session, redirect
import stripe
from db import get_db_connection
import mysql.connector

# Stripe Customer Portal:
# https://docs.stripe.com/customer-management
# Official Stripe subscription sample:
# https://github.com/stripe-samples/checkout-single-subscription/blob/main/server/python/server.py

client = stripe.StripeClient(os.getenv("STRIPE_SECRET_KEY"))
FRONTEND_URL = os.getenv("FRONTEND_URL")

def create_customer_portal():

    restaurant_id = session.get("restaurant_id")

    if not restaurant_id:
        return jsonify({
            "error": "Please login first"
        }), 401

    try:
        con = get_db_connection()
        cursor = con.cursor(dictionary=True)

    except mysql.connector.Error as err:
        print("Error:", err.errno)

        return jsonify({
            "error": "Could not connect with database"
        }), 503

    try:
        customer_sql = """ SELECT companies.stripe_customer_id FROM companies JOIN restaurants ON companies.company_id = restaurants.company_id WHERE restaurants.restaurant_id = %s """
        customer_values = (restaurant_id, )
        cursor.execute(customer_sql, customer_values)

        company = cursor.fetchone()

        if not company:
            return jsonify({
                "error": "Company could not be found"
            }), 404

        stripe_customer_id = company["stripe_customer_id"]

        if not stripe_customer_id:
            return jsonify({
                "error": "Stripe customer could not be found"
            }), 400

        portal_session = client.v1.billing_portal.sessions.create(params={
                "customer": stripe_customer_id,
                "return_url": FRONTEND_URL + '/login'
            }
        )
        return redirect(portal_session.url, code=303)

    except Exception as e:
        print(e)

        return jsonify({
            "error": "Could not create customer portal"
        }), 500

    finally:
        cursor.close()
        con.close()