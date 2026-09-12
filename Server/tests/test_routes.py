import os
import unittest
from unittest.mock import patch
from flask import Flask, session

# Must be set before app is imported.
os.environ["REDIS_URL"] = "memory://"
os.environ["SECRET_KEY"] = "test_secret_key"

from app import (
    app,
    limiter,
    get_rate_limit_key,
    handle_large_file,
    handle_rate_limit
)

from werkzeug.exceptions import RequestEntityTooLarge


class TestApp(unittest.TestCase):

    def setUp(self):

        app.config["TESTING"] = True
        app.config["SECRET_KEY"] = "test_secret_key"

        self.client = app.test_client()

        # Reset rate limits between tests.
        try:
            limiter.reset()
        except Exception:
            pass


    # =================================================
    # APPLICATION
    # =================================================

    def test_app_exists(self):

        self.assertIsNotNone(app)

        print("App exists test passed")


    def test_testing_mode(self):

        self.assertTrue(
            app.config["TESTING"]
        )

        print("Testing mode test passed")


    # =================================================
    # CONFIGURATION
    # =================================================

    def test_maximum_file_size(self):

        self.assertEqual(
            app.config["MAX_CONTENT_LENGTH"],
            5 * 1024 * 1024
        )

        print("Maximum file size test passed")


    def test_session_cookie_httponly(self):

        self.assertTrue(
            app.config["SESSION_COOKIE_HTTPONLY"]
        )

        print("HTTP only cookie test passed")


    def test_session_cookie_samesite(self):

        self.assertEqual(
            app.config["SESSION_COOKIE_SAMESITE"],
            "Lax"
        )

        print("SameSite cookie test passed")


    def test_session_cookie_secure(self):

        self.assertFalse(
            app.config["SESSION_COOKIE_SECURE"]
        )

        print("Secure cookie development setting test passed")


    def test_secret_key_exists(self):

        self.assertIsNotNone(
            app.config["SECRET_KEY"]
        )

        print("Secret key test passed")


    # =================================================
    # ROUTES REGISTERED
    # =================================================

    def test_all_expected_routes_exist(self):

        expected_routes = [
            "/getTable",
            "/restaurants",
            "/getWines",
            "/getallWines",
            "/getFood",
            "/getDishes",
            "/getSauces",
            "/getAllSauces",
            "/senddish",
            "/restaurantSignup",
            "/addAdmin",
            "/adminLogin",
            "/addWine",
            "/uploadWines",
            "/uploadWinesAI",
            "/deleteWine",
            "/deleteDish",
            "/uploadDishes",
            "/uploadDishesAI",
            "/uploadSauces",
            "/updateDish",
            "/updateWine",
            "/updateSauce",
            "/availableWine",
            "/dashboard",
            "/checkAdmin",
            "/logout",
            "/authorize",
            "/oauth2callback",
            "/reset-password",
            "/forgot-password",
            "/stripe-webhook",
            "/customer-portal"
        ]

        actual_routes = [
            rule.rule
            for rule in app.url_map.iter_rules()
        ]

        for route in expected_routes:

            self.assertIn(
                route,
                actual_routes
            )

        print("All expected routes exist test passed")


    # =================================================
    # CORRECT HTTP METHODS
    # =================================================

    def test_get_wines_accepts_post(self):

        rule = next(
            rule
            for rule in app.url_map.iter_rules()
            if rule.rule == "/getWines"
        )

        self.assertIn(
            "POST",
            rule.methods
        )

        self.assertNotIn(
            "PUT",
            rule.methods
        )

        print("Get wines method test passed")


    def test_delete_wine_accepts_delete(self):

        rule = next(
            rule
            for rule in app.url_map.iter_rules()
            if rule.rule == "/deleteWine"
        )

        self.assertIn(
            "DELETE",
            rule.methods
        )

        print("Delete wine method test passed")


    def test_update_wine_accepts_put(self):

        rule = next(
            rule
            for rule in app.url_map.iter_rules()
            if rule.rule == "/updateWine"
        )

        self.assertIn(
            "PUT",
            rule.methods
        )

        print("Update wine method test passed")


    def test_dashboard_accepts_get(self):

        rule = next(
            rule
            for rule in app.url_map.iter_rules()
            if rule.rule == "/dashboard"
        )

        self.assertIn(
            "GET",
            rule.methods
        )

        print("Dashboard method test passed")


    # =================================================
    # WRONG HTTP METHODS
    # =================================================

    def test_get_wines_rejects_get(self):

        response = self.client.get(
            "/getWines"
        )

        self.assertEqual(
            response.status_code,
            405
        )

        print("Get wines rejects GET test passed")


    def test_delete_wine_rejects_get(self):

        response = self.client.get(
            "/deleteWine"
        )

        self.assertEqual(
            response.status_code,
            405
        )

        print("Delete wine rejects GET test passed")


    def test_update_wine_rejects_get(self):

        response = self.client.get(
            "/updateWine"
        )

        self.assertEqual(
            response.status_code,
            405
        )

        print("Update wine rejects GET test passed")


    def test_admin_login_rejects_get(self):

        response = self.client.get(
            "/adminLogin"
        )

        self.assertEqual(
            response.status_code,
            405
        )

        print("Admin login rejects GET test passed")


    def test_logout_rejects_get(self):

        response = self.client.get(
            "/logout"
        )

        self.assertEqual(
            response.status_code,
            405
        )

        print("Logout rejects GET test passed")


    # =================================================
    # 404
    # =================================================

    def test_unknown_route_returns_404(self):

        response = self.client.get(
            "/route-that-does-not-exist"
        )

        self.assertEqual(
            response.status_code,
            404
        )

        print("Unknown route test passed")


    # =================================================
    # PUBLIC ROUTES
    # =================================================

    @patch("app.get_tables")
    def test_get_tables_route(
        self,
        mock_get_tables
    ):

        mock_get_tables.return_value = (
            {
                "tables": [
                    "wines",
                    "restaurants"
                ]
            },
            200
        )

        response = self.client.get(
            "/getTable"
        )

        self.assertEqual(
            response.status_code,
            200
        )

        mock_get_tables.assert_called_once()

        print("Get tables endpoint test passed")


    @patch("app.get_public_restaurants")
    def test_restaurants_route(
        self,
        mock_restaurants
    ):

        mock_restaurants.return_value = (
            [],
            200
        )

        response = self.client.get(
            "/restaurants"
        )

        self.assertEqual(
            response.status_code,
            200
        )

        mock_restaurants.assert_called_once()

        print("Restaurants endpoint test passed")


    @patch("app.get_wines")
    def test_get_wines_calls_correct_function(
        self,
        mock_get_wines
    ):

        mock_get_wines.return_value = (
            [],
            200
        )

        response = self.client.post(
            "/getWines",
            json={
                "restaurant_id": 1
            }
        )

        self.assertEqual(
            response.status_code,
            200
        )

        mock_get_wines.assert_called_once()

        print("Get wines endpoint function test passed")


    @patch("app.send_dish")
    def test_senddish_calls_correct_function(
        self,
        mock_send_dish
    ):

        mock_send_dish.return_value = (
            {
                "recommendations": [],
                "combined_recommendations": []
            },
            200
        )

        response = self.client.post(
            "/senddish",
            json={
                "restaurant_id": 1,
                "dishes": [
                    {
                        "food_id": 1,
                        "sauce_id": ""
                    }
                ]
            }
        )

        self.assertEqual(
            response.status_code,
            200
        )

        mock_send_dish.assert_called_once()

        print("Send dish endpoint function test passed")


    # =================================================
    # ADMIN LOGIN ROUTE
    # =================================================

    @patch("app.login_admin")
    def test_admin_login_calls_login_admin(
        self,
        mock_login
    ):

        mock_login.return_value = (
            {
                "message": "Login successful"
            },
            200
        )

        response = self.client.post(
            "/adminLogin",
            json={
                "username": "restaurantadmin",
                "password": "Password1!"
            }
        )

        self.assertEqual(
            response.status_code,
            200
        )

        mock_login.assert_called_once()

        print("Admin login endpoint test passed")


    # =================================================
    # CHECK ADMIN
    # =================================================

    @patch("app.check_admin")
    def test_check_admin_route(
        self,
        mock_check_admin
    ):

        mock_check_admin.return_value = (
            {
                "logged_in": False
            },
            401
        )

        response = self.client.get(
            "/checkAdmin"
        )

        self.assertEqual(
            response.status_code,
            401
        )

        mock_check_admin.assert_called_once()

        print("Check admin endpoint test passed")


    # =================================================
    # AUTHENTICATION PROTECTION
    # =================================================

    def test_dashboard_requires_login(self):

        response = self.client.get(
            "/dashboard"
        )

        self.assertIn(
            response.status_code,
            [401, 403]
        )

        print("Dashboard authentication test passed")


    def test_add_wine_requires_login(self):

        response = self.client.post(
            "/addWine",
            json={}
        )

        self.assertIn(
            response.status_code,
            [401, 403]
        )

        print("Add wine authentication test passed")


    def test_delete_wine_requires_login(self):

        response = self.client.delete(
            "/deleteWine",
            json={
                "wine_id": 1
            }
        )

        self.assertIn(
            response.status_code,
            [401, 403]
        )

        print("Delete wine authentication test passed")


    def test_upload_wines_requires_login(self):

        response = self.client.post(
            "/uploadWines"
        )

        self.assertIn(
            response.status_code,
            [401, 403]
        )

        print("Upload wines authentication test passed")


    # =================================================
    # OWNER / ROLE SECURITY
    # =================================================

    @patch("app.create_customer_portal")
    def test_owner_can_access_customer_portal(
        self,
        mock_portal
    ):

        mock_portal.return_value = (
            {
                "url": "https://example.com"
            },
            200
        )

        with self.client.session_transaction() as sess:

            sess["loggedin"] = True
            sess["admin_id"] = 1
            sess["restaurant_id"] = 1
            sess["username"] = "owneruser"
            sess["role"] = "owner"

        response = self.client.post(
            "/customer-portal"
        )

        self.assertEqual(
            response.status_code,
            200
        )

        mock_portal.assert_called_once()

        print("Owner customer portal test passed")


    @patch("app.create_customer_portal")
    def test_manager_cannot_access_customer_portal(
        self,
        mock_portal
    ):

        mock_portal.return_value = (
            {
                "url": "https://example.com"
            },
            200
        )

        with self.client.session_transaction() as sess:

            sess["loggedin"] = True
            sess["admin_id"] = 2
            sess["restaurant_id"] = 1
            sess["username"] = "manageruser"
            sess["role"] = "manager"

        response = self.client.post(
            "/customer-portal"
        )

        self.assertIn(
            response.status_code,
            [401, 403]
        )

        mock_portal.assert_not_called()

        print("Manager customer portal restriction test passed")


    # =================================================
    # DELIBERATE SECURITY EDGE CASE
    #
    # This test MAY FAIL with:
    #
    # @roles_required("owner")
    #
    # if roles_required uses:
    #
    # session["role"] in allowed_roles
    #
    # because:
    #
    # "own" in "owner" == True
    #
    # =================================================

    @patch("app.create_customer_portal")
    def test_partial_role_cannot_access_owner_route(
        self,
        mock_portal
    ):

        mock_portal.return_value = (
            {
                "url": "https://example.com"
            },
            200
        )

        with self.client.session_transaction() as sess:

            sess["loggedin"] = True
            sess["admin_id"] = 99
            sess["restaurant_id"] = 1
            sess["username"] = "fakeuser"

            # This is deliberately invalid.
            sess["role"] = "own"

        response = self.client.post(
            "/customer-portal"
        )

        self.assertIn(
            response.status_code,
            [401, 403]
        )

        mock_portal.assert_not_called()

        print("Partial role security test passed")


    # =================================================
    # RATE LIMIT KEY
    # =================================================

    def test_rate_limit_uses_ip_for_anonymous_user(self):

        with app.test_request_context(
            "/",
            environ_base={
                "REMOTE_ADDR": "127.0.0.1"
            }
        ):

            key = get_rate_limit_key()

            self.assertEqual(
                key,
                "127.0.0.1"
            )

        print("Anonymous rate limit key test passed")


    # =================================================
    # DELIBERATE FAILURE TEST
    #
    # Login_admin stores:
    #
    # session["admin_id"]
    #
    # but get_rate_limit_key checks:
    #
    # session.get("user_id")
    #
    # If the intention is per-admin limiting,
    # this test should currently FAIL.
    # =================================================

def test_logged_in_admin_rate_limit_uses_ip(self):

    with app.test_request_context(
        "/",
        environ_base={
            "REMOTE_ADDR": "127.0.0.1"
        }
    ):

        session["admin_id"] = 25
        session["loggedin"] = True

        key = get_rate_limit_key()

        self.assertEqual(
            key,
            "127.0.0.1"
        )

    print("Logged in admin rate limit IP test passed")


    # =================================================
    # ADMIN LOGIN RATE LIMIT
    # =================================================

    @patch("app.login_admin")
    def test_admin_login_rate_limit(
        self,
        mock_login
    ):

        mock_login.return_value = (
            {
                "message": "Login successful"
            },
            200
        )

        try:
            limiter.reset()
        except Exception:
            pass

        responses = []

        for i in range(6):

            response = self.client.post(
                "/adminLogin",
                json={
                    "username": "testuser",
                    "password": "Password1!"
                }
            )

            responses.append(
                response.status_code
            )

        # First five should be accepted.
        self.assertEqual(
            responses[0:5],
            [200, 200, 200, 200, 200]
        )

        # Sixth should hit:
        # 5 per minute.
        self.assertEqual(
            responses[5],
            429
        )

        print("Admin login rate limit test passed")


    # =================================================
    # PASSWORD RESET RATE LIMIT
    # =================================================

    @patch("app.reset_password")
    def test_reset_password_rate_limit(
        self,
        mock_reset
    ):

        mock_reset.return_value = (
            {
                "message": "Password updated"
            },
            200
        )

        try:
            limiter.reset()
        except Exception:
            pass

        response1 = self.client.post(
            "/reset-password",
            json={
                "token": "test",
                "password": "Password1!"
            }
        )

        response2 = self.client.post(
            "/reset-password",
            json={
                "token": "test",
                "password": "Password1!"
            }
        )

        response3 = self.client.post(
            "/reset-password",
            json={
                "token": "test",
                "password": "Password1!"
            }
        )

        self.assertEqual(
            response1.status_code,
            200
        )

        self.assertEqual(
            response2.status_code,
            200
        )

        self.assertEqual(
            response3.status_code,
            429
        )

        print("Password reset rate limit test passed")


    # =================================================
    # FORGOT PASSWORD RATE LIMIT
    # =================================================

    @patch("app.forgot_password")
    def test_forgot_password_rate_limit(
        self,
        mock_forgot
    ):

        mock_forgot.return_value = (
            {
                "message": "Request received"
            },
            200
        )

        try:
            limiter.reset()
        except Exception:
            pass

        response1 = self.client.post(
            "/forgot-password",
            json={
                "email": "test@example.com"
            }
        )

        response2 = self.client.post(
            "/forgot-password",
            json={
                "email": "test@example.com"
            }
        )

        response3 = self.client.post(
            "/forgot-password",
            json={
                "email": "test@example.com"
            }
        )

        self.assertEqual(
            response1.status_code,
            200
        )

        self.assertEqual(
            response2.status_code,
            200
        )

        self.assertEqual(
            response3.status_code,
            429
        )

        print("Forgot password rate limit test passed")


    # =================================================
    # RATE LIMIT ERROR FORMAT
    # =================================================

    def test_rate_limit_error_handler(self):

        with app.app_context():

            response, status_code = handle_rate_limit(
                Exception()
            )

            data = response.get_json()

            self.assertEqual(
                status_code,
                429
            )

            self.assertEqual(
                data["error"],
                "Too many requests. Please try again later."
            )

        print("Rate limit error handler test passed")


    # =================================================
    # FILE TOO LARGE ERROR HANDLER
    # =================================================

    def test_large_file_error_handler(self):

        with app.app_context():

            response, status_code = handle_large_file(
                RequestEntityTooLarge()
            )

            data = response.get_json()

            self.assertEqual(
                status_code,
                413
            )

            self.assertEqual(
                data["error"],
                "File is too large. Maximum upload size is 5 MB."
            )

        print("Large file handler test passed")


    # =================================================
    # ACTUAL 5 MB REQUEST
    # =================================================

    def test_request_over_5mb_is_rejected(self):

        large_data = (
            '{"restaurant_id": 1, "test": "'
            + ("A" * (5 * 1024 * 1024))
            + '"}'
        )

        response = self.client.post(
            "/getWines",
            data=large_data,
            content_type="application/json"
        )

        self.assertEqual(
            response.status_code,
            413
        )

        data = response.get_json()

        self.assertEqual(
            data["error"],
            "File is too large. Maximum upload size is 5 MB."
        )

        print("Actual oversized request test passed")


    # =================================================
    # CORS
    # =================================================

    def test_allowed_localhost_cors(self):

        response = self.client.options(
            "/getWines",
            headers={
                "Origin": "http://localhost:5173",
                "Access-Control-Request-Method": "POST"
            }
        )

        self.assertEqual(
            response.headers.get(
                "Access-Control-Allow-Origin"
            ),
            "http://localhost:5173"
        )

        print("Allowed localhost CORS test passed")


    def test_allowed_netlify_cors(self):

        response = self.client.options(
            "/getWines",
            headers={
                "Origin":
                    "https://merry-dragon-158655.netlify.app",

                "Access-Control-Request-Method":
                    "POST"
            }
        )

        self.assertEqual(
            response.headers.get(
                "Access-Control-Allow-Origin"
            ),
            "https://merry-dragon-158655.netlify.app"
        )

        print("Allowed Netlify CORS test passed")


    def test_unknown_origin_not_given_cors_access(self):

        response = self.client.options(
            "/getWines",
            headers={
                "Origin": "https://malicious-example.com",
                "Access-Control-Request-Method": "POST"
            }
        )

        self.assertNotEqual(
            response.headers.get(
                "Access-Control-Allow-Origin"
            ),
            "https://malicious-example.com"
        )

        print("Blocked CORS origin test passed")


    # =================================================
    # CREDENTIALS CORS
    # =================================================

    def test_cors_supports_credentials(self):

        response = self.client.options(
            "/getWines",
            headers={
                "Origin": "http://localhost:5173",
                "Access-Control-Request-Method": "POST"
            }
        )

        self.assertEqual(
            response.headers.get(
                "Access-Control-Allow-Credentials"
            ),
            "true"
        )

        print("CORS credentials test passed")


suite = unittest.TestLoader().loadTestsFromTestCase(
    TestApp
)

runner = unittest.TextTestRunner(
    verbosity=2
)

result = runner.run(suite)

print()
print("------------------------------")
print("TEST SUMMARY")
print("------------------------------")
print(f"Tests run: {result.testsRun}")
print(f"Failures: {len(result.failures)}")
print(f"Errors: {len(result.errors)}")
print(f"Successful: {result.wasSuccessful()}")