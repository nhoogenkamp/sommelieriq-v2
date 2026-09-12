import unittest
from unittest.mock import patch, MagicMock

from flask import Flask

from routes.senddish import send_dish


class TestSendDish(unittest.TestCase):

    def setUp(self):
        self.app = Flask(__name__)
        self.app.secret_key = "test_secret_key"


    # -------------------------------------------------
    # Validation
    # -------------------------------------------------

    def test_send_dish_invalid_restaurant_id(self):

        data = {
            "restaurant_id": 0,
            "dishes": [
                {
                    "food_id": 1,
                    "sauce_id": ""
                }
            ]
        }

        with self.app.test_request_context(
            json=data,
            method="POST"
        ):

            response, status_code = send_dish()

            result = response.get_json()

            self.assertEqual(status_code, 400)

            self.assertIn(
                "Restaurant_id must greater than 1",
                result["errors"]
            )

            print("Invalid restaurant ID test passed")


    def test_send_dish_empty_dishes(self):

        data = {
            "restaurant_id": 1,
            "dishes": []
        }

        with self.app.test_request_context(
            json=data,
            method="POST"
        ):

            response, status_code = send_dish()

            result = response.get_json()

            self.assertEqual(status_code, 400)

            self.assertIn(
                "At least one dish is required",
                result["errors"]
            )

            print("Empty dishes test passed")


    # -------------------------------------------------
    # Single dish
    # -------------------------------------------------

    @patch("routes.senddish.calculate_match")
    @patch("routes.senddish.get_db_connection")
    def test_send_single_dish(
        self,
        mock_db,
        mock_calculate_match
    ):

        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_db.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        food = {
            "food_id": 1,
            "dish_name": "Beef Wellington"
        }

        wines = [
            {
                "wine_id": 1,
                "name": "Rioja Reserva"
            },
            {
                "wine_id": 2,
                "name": "Pinot Noir"
            }
        ]

        # First fetchone() call returns food.
        mock_cursor.fetchone.return_value = food

        mock_cursor.fetchall.return_value = wines

        mock_calculate_match.side_effect = [
            85,
            72
        ]

        data = {
            "restaurant_id": 1,
            "dishes": [
                {
                    "food_id": 1,
                    "sauce_id": ""
                }
            ]
        }

        with self.app.test_request_context(
            json=data,
            method="POST"
        ):

            response, status_code = send_dish()

            result = response.get_json()

            self.assertEqual(status_code, 200)

            self.assertEqual(
                len(result["recommendations"]),
                1
            )

            self.assertEqual(
                result["recommendations"][0]["dish"],
                "Beef Wellington"
            )

            self.assertEqual(
                result["recommendations"][0]["sauce"],
                ""
            )

            self.assertEqual(
                result["recommendations"][0]["recommendations"][0]["match_percentage"],
                85
            )

            self.assertEqual(
                result["combined_recommendations"],
                []
            )

            print("Single dish recommendation test passed")


    # -------------------------------------------------
    # Dish with sauce
    # -------------------------------------------------

    @patch("routes.senddish.calculate_match")
    @patch("routes.senddish.get_db_connection")
    def test_send_dish_with_sauce(
        self,
        mock_db,
        mock_calculate_match
    ):

        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_db.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        food = {
            "food_id": 1,
            "dish_name": "Steak"
        }

        sauce = {
            "sauce_id": 1,
            "name": "Peppercorn Sauce"
        }

        wines = [
            {
                "wine_id": 1,
                "name": "Cabernet Sauvignon"
            }
        ]

        # First fetchone = food.
        # Second fetchone = sauce.
        mock_cursor.fetchone.side_effect = [
            food,
            sauce
        ]

        mock_cursor.fetchall.return_value = wines

        mock_calculate_match.return_value = 91

        data = {
            "restaurant_id": 1,
            "dishes": [
                {
                    "food_id": 1,
                    "sauce_id": 1
                }
            ]
        }

        with self.app.test_request_context(
            json=data,
            method="POST"
        ):

            response, status_code = send_dish()

            result = response.get_json()

            self.assertEqual(status_code, 200)

            self.assertEqual(
                result["recommendations"][0]["dish"],
                "Steak"
            )

            self.assertEqual(
                result["recommendations"][0]["sauce"],
                "Peppercorn Sauce"
            )

            self.assertEqual(
                result["recommendations"][0]["recommendations"][0]["match_percentage"],
                91
            )

            print("Dish with sauce test passed")


    # -------------------------------------------------
    # Recommendations sorted by match percentage
    # -------------------------------------------------

    @patch("routes.senddish.calculate_match")
    @patch("routes.senddish.get_db_connection")
    def test_recommendations_sorted(
        self,
        mock_db,
        mock_calculate_match
    ):

        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_db.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        food = {
            "food_id": 1,
            "dish_name": "Chicken"
        }

        wines = [
            {
                "wine_id": 1,
                "name": "Wine A"
            },
            {
                "wine_id": 2,
                "name": "Wine B"
            },
            {
                "wine_id": 3,
                "name": "Wine C"
            }
        ]

        mock_cursor.fetchone.return_value = food
        mock_cursor.fetchall.return_value = wines

        mock_calculate_match.side_effect = [
            60,
            95,
            75
        ]

        data = {
            "restaurant_id": 1,
            "dishes": [
                {
                    "food_id": 1,
                    "sauce_id": ""
                }
            ]
        }

        with self.app.test_request_context(
            json=data,
            method="POST"
        ):

            response, status_code = send_dish()

            result = response.get_json()

            recommendations = result[
                "recommendations"
            ][0]["recommendations"]

            self.assertEqual(status_code, 200)

            self.assertEqual(
                recommendations[0]["match_percentage"],
                95
            )

            self.assertEqual(
                recommendations[1]["match_percentage"],
                75
            )

            self.assertEqual(
                recommendations[2]["match_percentage"],
                60
            )

            print("Recommendation sorting test passed")


    # -------------------------------------------------
    # Dish not found
    # -------------------------------------------------

    @patch("routes.senddish.get_db_connection")
    def test_dish_not_found(self, mock_db):

        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_db.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        mock_cursor.fetchone.return_value = None

        data = {
            "restaurant_id": 1,
            "dishes": [
                {
                    "food_id": 999,
                    "sauce_id": ""
                }
            ]
        }

        with self.app.test_request_context(
            json=data,
            method="POST"
        ):

            response, status_code = send_dish()

            result = response.get_json()

            self.assertEqual(status_code, 404)

            self.assertEqual(
                result["error"],
                "Dish not found"
            )

            print("Dish not found test passed")


    # -------------------------------------------------
    # Multiple dishes
    # -------------------------------------------------

    @patch("routes.senddish.calculate_match")
    @patch("routes.senddish.get_db_connection")
    def test_combined_recommendations(
        self,
        mock_db,
        mock_calculate_match
    ):

        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_db.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        dish_one = {
            "food_id": 1,
            "dish_name": "Steak"
        }

        dish_two = {
            "food_id": 2,
            "dish_name": "Lamb"
        }

        # fetchone is called once for each dish.
        mock_cursor.fetchone.side_effect = [
            dish_one,
            dish_two
        ]

        wines = [
            {
                "wine_id": 1,
                "name": "Rioja"
            },
            {
                "wine_id": 2,
                "name": "Merlot"
            }
        ]

        # Wines are fetched for each dish.
        mock_cursor.fetchall.side_effect = [
            wines,
            wines
        ]

        # Dish 1:
        # Rioja = 90
        # Merlot = 70
        #
        # Dish 2:
        # Rioja = 80
        # Merlot = 60
        mock_calculate_match.side_effect = [
            90,
            70,
            80,
            60
        ]

        data = {
            "restaurant_id": 1,
            "dishes": [
                {
                    "food_id": 1,
                    "sauce_id": ""
                },
                {
                    "food_id": 2,
                    "sauce_id": ""
                }
            ]
        }

        with self.app.test_request_context(
            json=data,
            method="POST"
        ):

            response, status_code = send_dish()

            result = response.get_json()

            combined = result[
                "combined_recommendations"
            ]

            self.assertEqual(status_code, 200)

            self.assertEqual(
                len(result["recommendations"]),
                2
            )

            self.assertEqual(
                len(combined),
                2
            )

            # Rioja average:
            # (90 + 80) / 2 = 85
            self.assertEqual(
                combined[0]["wine_id"],
                1
            )

            self.assertEqual(
                combined[0]["match_percentage"],
                85
            )

            # Merlot average:
            # (70 + 60) / 2 = 65
            self.assertEqual(
                combined[1]["wine_id"],
                2
            )

            self.assertEqual(
                combined[1]["match_percentage"],
                65
            )

            print("Combined recommendations test passed")


    # -------------------------------------------------
    # Database objects closed
    # -------------------------------------------------

    @patch("routes.senddish.calculate_match")
    @patch("routes.senddish.get_db_connection")
    def test_database_connection_closed(
        self,
        mock_db,
        mock_calculate_match
    ):

        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_db.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        mock_cursor.fetchone.return_value = {
            "food_id": 1,
            "dish_name": "Chicken"
        }

        mock_cursor.fetchall.return_value = [
            {
                "wine_id": 1,
                "name": "Chardonnay"
            }
        ]

        mock_calculate_match.return_value = 80

        data = {
            "restaurant_id": 1,
            "dishes": [
                {
                    "food_id": 1,
                    "sauce_id": ""
                }
            ]
        }

        with self.app.test_request_context(
            json=data,
            method="POST"
        ):

            send_dish()

            mock_cursor.close.assert_called_once()
            mock_connection.close.assert_called_once()

            print("Database close test passed")


suite = unittest.TestLoader().loadTestsFromTestCase(TestSendDish)
runner = unittest.TextTestRunner(verbosity=0)
result = runner.run(suite)
print(f"Tests run: {result.testsRun}")