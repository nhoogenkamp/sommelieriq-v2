import os
from flask import request, jsonify, json
import stripe
from db import get_db_connection
import mysql.connector

# https://docs.stripe.com/billing/quickstart?accounts-namespace=v1&client=react&lang=python

client = stripe.StripeClient(
    os.getenv("STRIPE_SECRET_KEY")
)

def webhook_received():

    # To run this example, set an environment variable STRIPE_WEBHOOK_SECRET to
    # your endpoint's unique secret.
    # If you are testing with the CLI, find the secret by running 'stripe listen'.
    # If you are using an endpoint defined with the API or dashboard, look in
    # your webhook settings at https://dashboard.stripe.com/webhooks.
    #
    webhook_secret = os.environ.get('STRIPE_WEBHOOK_SECRET')

    request_data = json.loads(request.data)

    if webhook_secret:

        # Retrieve the event by verifying the signature using the raw body and
        # secret if webhook signing is configured.
        signature = request.headers.get('stripe-signature')

        try:
            event = client.construct_event(
                payload=request.data, sig_header=signature, secret=webhook_secret)
            data = event['data']

        except Exception as e:
            return str(e), 400

        # Get the type of webhook event sent.
        event_type = event['type']

    else:
        data = request_data['data']
        event_type = request_data['type']
    data_object = data['object']

    print('event ' + event_type)

    if event_type == 'checkout.session.completed':
        print('🔔 Payment succeeded!')

        # stripeobject no longer inherits from dictionary
        # https://github.com/stripe/stripe-python/wiki/Migration-guide-for-v15
        data_object = data_object.to_dict()
        company_id = data_object['metadata']['company_id']
        stripe_customer_id = data_object['customer']
        stripe_subscription_id = data_object['subscription']

        try:
            con = get_db_connection()
            cursor = con.cursor(dictionary=True)

        except mysql.connector.Error as err:
            print("Error:", err.errno)

            return jsonify({
                "error": "Could not connect with database"
            }), 503

        try:
            update_company_sql = """ UPDATE companies SET stripe_customer_id = %s,  stripe_subscription_id = %s, subscription_status = %s WHERE company_id = %s"""

            update_company_values = ( stripe_customer_id,  stripe_subscription_id,  "active",  company_id)
            cursor.execute( update_company_sql, update_company_values)

            admin_sql = """UPDATE admins SET verified = %s WHERE restaurant_id IN (SELECT restaurant_id  FROM restaurants WHERE company_id = %s)"""
            admin_values = (True, company_id)
            cursor.execute( admin_sql, admin_values)


            con.commit()

            print( "Subscription activated for company:", company_id)

        except mysql.connector.Error as err:
            print("Error:", err)

            con.rollback()

            return jsonify({
                "error": "Could not update subscription"
            }), 500

        finally:
            cursor.close()
            con.close()

    elif event_type == 'customer.subscription.trial_will_end':
        print('Subscription trial will end')
    elif event_type == 'customer.subscription.created':
        print('Subscription created %s', event.id)
    elif event_type == 'customer.subscription.updated':
        print('Subscription updated %s', event.id)
    elif event_type == 'customer.subscription.deleted':
        # handle subscription canceled automatically based
        # upon your subscription settings. Or if the user cancels it.
        print('Subscription canceled: %s', event.id)
    elif event_type == 'entitlements.active_entitlement_summary.updated':
        # handle active entitlement summary updated
        print('Active entitlement summary updated: %s', event.id)

    return jsonify({
        'status': 'success'
    })