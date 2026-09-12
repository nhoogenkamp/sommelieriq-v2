import unittest
from unittest.mock import patch, MagicMock

from flask import Flask, session

from routes.admin import (
    add_admin,
    reset_password,
    login_admin,
    forgot_password,
    check_admin,
    logout_admin
)


class TestAdmin(unittest.TestCase):

    def setUp(self):
        self.app = Flask(__name__)
        self.app.secret_key = "test_secret_key"


    # -------------------------------------------------
    # add_admin
    # -------------------------------------------------

    @patch("routes.admin.send_reset_email")
    @patch("routes.admin.generate_password_hash")
    @patch("routes.admin.get_db_connection")
    def test_add_admin_valid(
        self,
        mock_db,
        mock_hash,
        mock_email
    ):

        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_db.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        mock_cursor.fetchone.return_value = None
        mock_hash.return_value = "hashed_password"

        data = {
            "username": "newadmin",
            "email": "admin@example.com",
            "role": "staff"
        }

        with self.app.test_request_context(
            json=data,
            method="POST"
        ):

            session["restaurant_id"] = 1
            session["role"] = "owner"

            response, status_code = add_admin()

            result = response.get_json()

            self.assertEqual(status_code, 201)
            self.assertEqual(
                result["message"],
                "Admin account created"
            )

            mock_connection.commit.assert_called_once()

            mock_email.assert_called_once_with(
                "admin@example.com"
            )

            print("Add admin test passed")


    def test_add_admin_invalid_data(self):

        data = {
            "username": "abc",
            "email": "wrong-email",
            "role": "wrong"
        }

        with self.app.test_request_context(
            json=data,
            method="POST"
        ):

            session["restaurant_id"] = 1
            session["role"] = "owner"

            response, status_code = add_admin()

            result = response.get_json()

            self.assertEqual(status_code, 400)
            self.assertIn("errors", result)

            print("Invalid add admin test passed")


    def test_manager_cannot_create_owner(self):

        data = {
            "username": "newowner",
            "email": "owner@example.com",
            "role": "owner"
        }

        with self.app.test_request_context(
            json=data,
            method="POST"
        ):

            session["restaurant_id"] = 1
            session["role"] = "manager"

            response, status_code = add_admin()

            result = response.get_json()

            self.assertEqual(status_code, 403)

            self.assertIn(
                "Managers cannot create an Owner",
                result["errors"]
            )

            print("Manager cannot create owner test passed")


    @patch("routes.admin.get_db_connection")
    def test_add_admin_user_exists(self, mock_db):

        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_db.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        mock_cursor.fetchone.return_value = {
            "admin_id": 1,
            "username": "existinguser"
        }

        data = {
            "username": "existinguser",
            "email": "existing@example.com",
            "role": "staff"
        }

        with self.app.test_request_context(
            json=data,
            method="POST"
        ):

            session["restaurant_id"] = 1
            session["role"] = "owner"

            response, status_code = add_admin()

            result = response.get_json()

            self.assertEqual(status_code, 400)

            self.assertEqual(
                result["error"],
                "User already exists"
            )

            print("Existing admin test passed")


    # -------------------------------------------------
    # reset_password
    # -------------------------------------------------

    @patch("routes.admin.generate_password_hash")
    @patch("routes.admin.confirm_token")
    @patch("routes.admin.get_db_connection")
    def test_reset_password_valid(
        self,
        mock_db,
        mock_token,
        mock_hash
    ):

        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_db.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        mock_token.return_value = "admin@example.com"
        mock_hash.return_value = "new_hashed_password"

        mock_cursor.fetchone.return_value = {
            "admin_id": 1,
            "email": "admin@example.com"
        }

        data = {
            "token": "valid-token",
            "password": "Password1!"
        }

        with self.app.test_request_context(
            json=data,
            method="POST"
        ):

            response, status_code = reset_password()

            result = response.get_json()

            self.assertEqual(status_code, 200)

            self.assertEqual(
                result["message"],
                "Password updated successfully"
            )

            self.assertEqual(
                result["redirect"],
                "/login"
            )

            mock_connection.commit.assert_called_once()

            print("Reset password test passed")


    @patch("routes.admin.confirm_token")
    def test_reset_password_invalid_token(
        self,
        mock_token
    ):

        mock_token.return_value = None

        data = {
            "token": "invalid-token",
            "password": "Password1!"
        }

        with self.app.test_request_context(
            json=data,
            method="POST"
        ):

            response, status_code = reset_password()

            result = response.get_json()

            self.assertEqual(status_code, 400)

            self.assertEqual(
                result["error"],
                "Password reset link is invalid or has expired"
            )

            print("Invalid reset token test passed")


    @patch("routes.admin.confirm_token")
    @patch("routes.admin.get_db_connection")
    def test_reset_password_user_not_found(
        self,
        mock_db,
        mock_token
    ):

        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_db.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        mock_token.return_value = "missing@example.com"
        mock_cursor.fetchone.return_value = None

        data = {
            "token": "valid-token",
            "password": "Password1!"
        }

        with self.app.test_request_context(
            json=data,
            method="POST"
        ):

            response, status_code = reset_password()

            result = response.get_json()

            self.assertEqual(status_code, 404)

            self.assertEqual(
                result["error"],
                "User account could not be found"
            )

            print("Reset password user not found test passed")


    # -------------------------------------------------
    # login_admin
    # -------------------------------------------------

    @patch("routes.admin.check_password_hash")
    @patch("routes.admin.get_db_connection")
    def test_login_admin_valid(
        self,
        mock_db,
        mock_check_password
    ):

        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_db.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        mock_check_password.return_value = True

        mock_cursor.fetchone.return_value = {
            "admin_id": 1,
            "restaurant_id": 10,
            "username": "restaurantadmin",
            "password_hash": "hashed_password",
            "role": "owner",
            "verified": True,
            "subscription_status": "active",
            "slug": "test-restaurant"
        }

        data = {
            "username": "restaurantadmin",
            "password": "Password1!"
        }

        with self.app.test_request_context(
            json=data,
            method="POST"
        ):

            response, status_code = login_admin()

            result = response.get_json()

            self.assertEqual(status_code, 200)

            self.assertEqual(
                result["message"],
                "Login successful"
            )

            self.assertEqual(
                result["restaurant_id"],
                10
            )

            self.assertEqual(
                result["role"],
                "owner"
            )

            self.assertTrue(session["loggedin"])
            self.assertEqual(
                session["admin_id"],
                1
            )
            self.assertEqual(
                session["restaurant_id"],
                10
            )

            print("Login admin test passed")


    @patch("routes.admin.check_password_hash")
    @patch("routes.admin.get_db_connection")
    def test_login_admin_wrong_password(
        self,
        mock_db,
        mock_check_password
    ):

        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_db.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        mock_cursor.fetchone.return_value = {
            "admin_id": 1,
            "username": "restaurantadmin",
            "password_hash": "hashed_password"
        }

        mock_check_password.return_value = False

        data = {
            "username": "restaurantadmin",
            "password": "WrongPassword1!"
        }

        with self.app.test_request_context(
            json=data,
            method="POST"
        ):

            response, status_code = login_admin()

            result = response.get_json()

            self.assertEqual(status_code, 401)

            self.assertEqual(
                result["error"],
                "Incorrect username or password"
            )

            print("Incorrect login test passed")


    @patch("routes.admin.check_password_hash")
    @patch("routes.admin.get_db_connection")
    def test_login_admin_not_verified(
        self,
        mock_db,
        mock_check_password
    ):

        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_db.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        mock_check_password.return_value = True

        mock_cursor.fetchone.return_value = {
            "admin_id": 1,
            "restaurant_id": 10,
            "username": "restaurantadmin",
            "password_hash": "hashed_password",
            "role": "staff",
            "verified": False,
            "subscription_status": "active",
            "slug": "test-restaurant"
        }

        data = {
            "username": "restaurantadmin",
            "password": "Password1!"
        }

        with self.app.test_request_context(
            json=data,
            method="POST"
        ):

            response, status_code = login_admin()

            result = response.get_json()

            self.assertEqual(status_code, 403)

            self.assertEqual(
                result["error"],
                "Please set your password using the link sent to your email"
            )

            print("Unverified admin login test passed")


    @patch("routes.admin.check_password_hash")
    @patch("routes.admin.get_db_connection")
    def test_login_admin_inactive_subscription(
        self,
        mock_db,
        mock_check_password
    ):

        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_db.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        mock_check_password.return_value = True

        mock_cursor.fetchone.return_value = {
            "admin_id": 1,
            "restaurant_id": 10,
            "username": "restaurantadmin",
            "password_hash": "hashed_password",
            "role": "owner",
            "verified": True,
            "subscription_status": "inactive",
            "slug": "test-restaurant"
        }

        data = {
            "username": "restaurantadmin",
            "password": "Password1!"
        }

        with self.app.test_request_context(
            json=data,
            method="POST"
        ):

            response, status_code = login_admin()

            result = response.get_json()

            self.assertEqual(status_code, 403)

            self.assertEqual(
                result["error"],
                "Your subscription is not active"
            )

            print("Inactive subscription login test passed")


    # -------------------------------------------------
    # forgot_password
    # -------------------------------------------------

    @patch("routes.admin.send_forgot_password")
    @patch("routes.admin.get_db_connection")
    def test_forgot_password_existing_user(
        self,
        mock_db,
        mock_email
    ):

        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_db.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        mock_cursor.fetchone.return_value = {
            "admin_id": 1,
            "email": "admin@example.com"
        }

        data = {
            "email": "admin@example.com"
        }

        with self.app.test_request_context(
            json=data,
            method="POST"
        ):

            response, status_code = forgot_password()

            result = response.get_json()

            self.assertEqual(status_code, 200)

            mock_email.assert_called_once_with(
                "admin@example.com"
            )

            self.assertEqual(
                result["message"],
                "If an account exists for this email, a password reset link has been sent."
            )

            print("Forgot password existing user test passed")


    @patch("routes.admin.send_forgot_password")
    @patch("routes.admin.get_db_connection")
    def test_forgot_password_unknown_user(
        self,
        mock_db,
        mock_email
    ):

        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_db.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        mock_cursor.fetchone.return_value = None

        data = {
            "email": "unknown@example.com"
        }

        with self.app.test_request_context(
            json=data,
            method="POST"
        ):

            response, status_code = forgot_password()

            result = response.get_json()

            self.assertEqual(status_code, 200)

            mock_email.assert_not_called()

            self.assertEqual(
                result["message"],
                "If an account exists for this email, a password reset link has been sent."
            )

            print("Forgot password unknown user test passed")


    def test_forgot_password_invalid_email(self):

        data = {
            "email": "wrong-email"
        }

        with self.app.test_request_context(
            json=data,
            method="POST"
        ):

            response, status_code = forgot_password()

            result = response.get_json()

            self.assertEqual(status_code, 400)
            self.assertIn("errors", result)

            print("Invalid forgot password email test passed")


    # -------------------------------------------------
    # check_admin
    # -------------------------------------------------

    def test_check_admin_logged_in(self):

        with self.app.test_request_context():

            session["loggedin"] = True
            session["username"] = "restaurantadmin"
            session["restaurant_id"] = 10
            session["restaurant_slug"] = "test-restaurant"
            session["role"] = "owner"

            response, status_code = check_admin()

            result = response.get_json()

            self.assertEqual(status_code, 200)

            self.assertTrue(
                result["logged_in"]
            )

            self.assertEqual(
                result["username"],
                "restaurantadmin"
            )

            self.assertEqual(
                result["restaurant_id"],
                10
            )

            self.assertEqual(
                result["restaurant_slug"],
                "test-restaurant"
            )

            self.assertEqual(
                result["role"],
                "owner"
            )

            print("Check logged in admin test passed")


    def test_check_admin_not_logged_in(self):

        with self.app.test_request_context():

            response, status_code = check_admin()

            result = response.get_json()

            self.assertEqual(status_code, 401)

            self.assertFalse(
                result["logged_in"]
            )

            self.assertEqual(
                result["error"],
                "Please login first"
            )

            print("Check logged out admin test passed")


    # -------------------------------------------------
    # logout_admin
    # -------------------------------------------------

    def test_logout_admin(self):

        with self.app.test_request_context():

            session["loggedin"] = True
            session["admin_id"] = 1
            session["restaurant_id"] = 10
            session["username"] = "restaurantadmin"
            session["role"] = "owner"
            session["restaurant_slug"] = "test-restaurant"

            response, status_code = logout_admin()

            result = response.get_json()

            self.assertEqual(status_code, 200)

            self.assertEqual(
                result["message"],
                "Logged out successfully"
            )

            self.assertNotIn(
                "loggedin",
                session
            )

            self.assertNotIn(
                "admin_id",
                session
            )

            self.assertNotIn(
                "restaurant_id",
                session
            )

            self.assertNotIn(
                "username",
                session
            )

            self.assertNotIn(
                "role",
                session
            )

            self.assertNotIn(
                "restaurant_slug",
                session
            )

            print("Logout admin test passed")


suite = unittest.TestLoader().loadTestsFromTestCase(TestAdmin)
runner = unittest.TextTestRunner(verbosity=0)
result = runner.run(suite)
print(f"Tests run: {result.testsRun}")