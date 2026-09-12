import unittest
from unittest.mock import patch, MagicMock

from flask import Flask

from routes.wines import (
    get_tables,
    get_wines,
    get_all_wines
)


class TestWines(unittest.TestCase):

    def setUp(self):
        self.app = Flask(__name__)
        self.app.secret_key = "test_secret_key"


    # -------------------------------------------------
    # get_tables
    # -------------------------------------------------

    @patch("routes.wines.get_db_connection")
    def test_get_tables(self, mock_db):

        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_db.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        mock_cursor.fetchall.return_value = [
            ("wines",),
            ("users",),
            ("restaurants",)
        ]

        with self.app.app_context():

            response, status_code = get_tables()

            data = response.get_json()

            self.assertEqual(status_code, 200)
            self.assertEqual(
                data,
                {
                    "tables": [
                        "wines",
                        "users",
                        "restaurants"
                    ]
                }
            )

            mock_cursor.execute.assert_called_once_with(
                "SHOW TABLES;"
            )

            print("Get tables test passed")


    # -------------------------------------------------
    # get_wines
    # -------------------------------------------------

    @patch("routes.wines.get_db_connection")
    def test_get_wines_valid(self, mock_db):

        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_db.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        mock_cursor.fetchall.return_value = [
            {
                "wine_id": 1,
                "name": "Rioja Reserva",
                "restaurant_id": 1,
                "available": 1
            },
            {
                "wine_id": 2,
                "name": "Chablis",
                "restaurant_id": 1,
                "available": 1
            }
        ]

        with self.app.test_request_context(
            json={
                "restaurant_id": 1
            }
        ):

            response, status_code = get_wines()

            data = response.get_json()

            self.assertEqual(status_code, 200)
            self.assertEqual(len(data), 2)
            self.assertEqual(
                data[0]["name"],
                "Rioja Reserva"
            )

            mock_connection.cursor.assert_called_once_with(
                dictionary=True
            )

            print("Get wines valid test passed")


    def test_get_wines_invalid_restaurant_id(self):

        with self.app.test_request_context(
            json={
                "restaurant_id": 0
            }
        ):

            response, status_code = get_wines()

            data = response.get_json()

            self.assertEqual(status_code, 400)

            self.assertIn(
                "Restaurant_id must greater than 1",
                data["errors"]
            )

            print("Get wines invalid restaurant ID test passed")


    def test_get_wines_missing_restaurant_id(self):

        with self.app.test_request_context(
            json={}
        ):

            response, status_code = get_wines()

            data = response.get_json()

            self.assertEqual(status_code, 400)

            self.assertIn(
                "restaurant_id is required",
                data["errors"]
            )

            print("Get wines missing restaurant ID test passed")


    @patch("routes.wines.get_db_connection")
    def test_get_wines_empty(self, mock_db):

        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_db.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        mock_cursor.fetchall.return_value = []

        with self.app.test_request_context(
            json={
                "restaurant_id": 1
            }
        ):

            response, status_code = get_wines()

            data = response.get_json()

            self.assertEqual(status_code, 200)
            self.assertEqual(data, [])

            print("Get wines empty test passed")


    # -------------------------------------------------
    # get_all_wines
    # -------------------------------------------------

    @patch("routes.wines.get_db_connection")
    def test_get_all_wines_valid(self, mock_db):

        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_db.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        mock_cursor.fetchall.return_value = [
            {
                "wine_id": 1,
                "name": "Rioja Reserva",
                "restaurant_id": 1,
                "available": 1
            },
            {
                "wine_id": 2,
                "name": "Chablis",
                "restaurant_id": 1,
                "available": 0
            }
        ]

        with self.app.test_request_context():

            from flask import session

            session["restaurant_id"] = 1

            response, status_code = get_all_wines()

            data = response.get_json()

            self.assertEqual(status_code, 200)
            self.assertEqual(len(data), 2)

            self.assertEqual(
                data[0]["name"],
                "Rioja Reserva"
            )

            self.assertEqual(
                data[1]["name"],
                "Chablis"
            )

            print("Get all wines test passed")


    @patch("routes.wines.get_db_connection")
    def test_get_all_wines_empty(self, mock_db):

        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_db.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        mock_cursor.fetchall.return_value = []

        with self.app.test_request_context():

            from flask import session

            session["restaurant_id"] = 1

            response, status_code = get_all_wines()

            data = response.get_json()

            self.assertEqual(status_code, 200)
            self.assertEqual(data, [])

            print("Get all wines empty test passed")


suite = unittest.TestLoader().loadTestsFromTestCase(TestWines)
runner = unittest.TextTestRunner(verbosity=0)
result = runner.run(suite)
print(f"Tests run: {result.testsRun}")