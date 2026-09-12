import unittest

from routes.validations import (
    validate_wine,
    validate_wine_ai,
    validate_registration,
    validate_password_reset,
    validate_forgot_password,
    validate_login,
    validate_availability,
    validate_delete_wine,
    validate_delete_dish,
    validate_senddish,
    validate_update_wine,
    validate_restaurant_ID,
    validate_dishes,
    validate_dishes_ai,
    validate_sauce,
    validate_signup
)


class TestValidations(unittest.TestCase):

    # -------------------------------------------------
    # validate_wine
    # -------------------------------------------------

    def test_validate_wine_valid(self):
        data = {
            "name": "Rioja Reserva",
            "wine_type": "Red",
            "grape": "Tempranillo",
            "country": "Spain",
            "region": "Rioja",
            "year": 2020,
            "bottle_type": "Bottle",
            "price": 45,
            "available": 1,
            "description": "Full bodied red wine",
            "body_score": 15,
            "tannin_score": 14,
            "acidity_score": 12,
            "sweetness_score": 3
        }

        errors = validate_wine(data)

        self.assertEqual(errors, [])
        print("Valid wine test passed")


    def test_validate_wine_invalid(self):
        data = {
            "name": "Rioja Reserva",
            "wine_type": "Red",
            "grape": "Tempranillo",
            "country": "Spain",
            "region": "Rioja",
            "year": 1800,
            "bottle_type": "Box",
            "price": 0,
            "available": 2,
            "description": "Red wine",
            "body_score": 25,
            "tannin_score": 14,
            "acidity_score": 12,
            "sweetness_score": 3
        }

        errors = validate_wine(data)

        self.assertIn("Year is incorrect", errors)
        self.assertIn("Incorrect bottletype", errors)
        self.assertIn("Price must be at least 1", errors)
        self.assertIn("Available is only 0 or 1", errors)
        self.assertIn("body_score must be between 0 and 20", errors)

        print("Invalid wine test passed")


    # -------------------------------------------------
    # validate_wine_ai
    # -------------------------------------------------

    def test_validate_wine_ai_valid(self):
        data = {
            "name": "Chablis",
            "wine_type": "White",
            "grape": "Chardonnay",
            "country": "France",
            "region": "Burgundy",
            "year": 2021,
            "bottle_type": "Bottle",
            "price": 40,
            "available": 1
        }

        errors = validate_wine_ai(data)

        self.assertEqual(errors, [])
        print("Valid AI wine test passed")


    def test_validate_wine_ai_empty_name(self):
        data = {
            "name": "",
            "wine_type": "White",
            "grape": "Chardonnay",
            "country": "France",
            "region": "Burgundy",
            "year": 2021,
            "bottle_type": "Bottle",
            "price": 40,
            "available": 1
        }

        errors = validate_wine_ai(data)

        self.assertIn("name cannot be empty", errors)
        print("AI wine empty name test passed")


    # -------------------------------------------------
    # validate_registration
    # -------------------------------------------------

    def test_validate_registration_valid(self):
        data = {
            "username": "johnsmith",
            "email": "john@example.com",
            "role": "manager",
            "restaurant_id": 1
        }

        errors = validate_registration(data)

        self.assertEqual(errors, [])
        print("Valid registration test passed")


    def test_validate_registration_invalid_role(self):
        data = {
            "username": "johnsmith",
            "email": "john@example.com",
            "role": "admin"
        }

        errors = validate_registration(data)

        self.assertIn("Role is incorrect", errors)
        print("Invalid registration role test passed")


    def test_validate_registration_invalid_email(self):
        data = {
            "username": "johnsmith",
            "email": "invalid-email",
            "role": "manager"
        }

        errors = validate_registration(data)

        self.assertIn("Please enter a valid email address", errors)
        print("Invalid registration email test passed")


    # -------------------------------------------------
    # validate_password_reset
    # -------------------------------------------------

    def test_validate_password_reset_valid(self):
        data = {
            "token": "abc123",
            "password": "Password1!"
        }

        errors = validate_password_reset(data)

        self.assertEqual(errors, [])
        print("Valid password reset test passed")


    def test_validate_password_reset_invalid_password(self):
        data = {
            "token": "abc123",
            "password": "password"
        }

        errors = validate_password_reset(data)

        self.assertIn(
            "Please ensure password has one lowercase, one uppercase, "
            "one number, one special character and is between 8 and 15 characters long",
            errors
        )

        print("Invalid password reset test passed")


    # -------------------------------------------------
    # validate_forgot_password
    # -------------------------------------------------

    def test_validate_forgot_password_valid(self):
        data = {
            "email": "user@example.com"
        }

        errors = validate_forgot_password(data)

        self.assertEqual(errors, [])
        print("Valid forgot password test passed")


    def test_validate_forgot_password_invalid_email(self):
        data = {
            "email": "invalid-email"
        }

        errors = validate_forgot_password(data)

        self.assertIn("Please enter a valid email address", errors)
        print("Invalid forgot password email test passed")


    # -------------------------------------------------
    # validate_login
    # -------------------------------------------------

    def test_validate_login_valid(self):
        data = {
            "username": "johnsmith",
            "password": "Password1!"
        }

        errors = validate_login(data)

        self.assertEqual(errors, [])
        print("Valid login test passed")


    def test_validate_login_missing_password(self):
        data = {
            "username": "johnsmith"
        }

        errors = validate_login(data)

        self.assertIn("password is required", errors)
        print("Missing login password test passed")


    # -------------------------------------------------
    # validate_availability
    # -------------------------------------------------

    def test_validate_availability_valid(self):
        data = {
            "wine_id": 1,
            "available": 1
        }

        errors = validate_availability(data)

        self.assertEqual(errors, [])
        print("Valid availability test passed")


    def test_validate_availability_invalid(self):
        data = {
            "wine_id": 0,
            "available": 3
        }

        errors = validate_availability(data)

        self.assertIn("wine_id must greater than 1", errors)
        self.assertIn("Available is only 0 or 1", errors)

        print("Invalid availability test passed")


    # -------------------------------------------------
    # validate_delete_wine
    # -------------------------------------------------

    def test_validate_delete_wine_valid(self):
        data = {
            "wine_id": 1
        }

        errors = validate_delete_wine(data)

        self.assertEqual(errors, [])
        print("Valid delete wine test passed")


    def test_validate_delete_wine_invalid_id(self):
        data = {
            "wine_id": 0
        }

        errors = validate_delete_wine(data)

        self.assertIn("wine_id must greater than 0", errors)
        print("Invalid delete wine ID test passed")


    # -------------------------------------------------
    # validate_delete_dish
    # -------------------------------------------------

    def test_validate_delete_dish_valid(self):
        data = {
            "food_id": 1
        }

        errors = validate_delete_dish(data)

        self.assertEqual(errors, [])
        print("Valid delete dish test passed")


    def test_validate_delete_dish_invalid_id(self):
        data = {
            "food_id": 0
        }

        errors = validate_delete_dish(data)

        self.assertIn("food_id must greater than 0", errors)
        print("Invalid delete dish ID test passed")


    # -------------------------------------------------
    # validate_senddish
    # -------------------------------------------------

    def test_validate_senddish_valid(self):
        data = {
            "restaurant_id": 1,
            "dishes": [
                {
                    "food_id": 1
                },
                {
                    "food_id": 2
                }
            ]
        }

        errors = validate_senddish(data)

        self.assertEqual(errors, [])
        print("Valid send dish test passed")


    def test_validate_senddish_empty_dishes(self):
        data = {
            "restaurant_id": 1,
            "dishes": []
        }

        errors = validate_senddish(data)

        self.assertIn("At least one dish is required", errors)
        print("Empty dishes test passed")


    def test_validate_senddish_invalid_food_id(self):
        data = {
            "restaurant_id": 1,
            "dishes": [
                {
                    "food_id": 0
                }
            ]
        }

        errors = validate_senddish(data)

        self.assertIn("Food_id must be greater than 0", errors)
        print("Invalid food ID test passed")


    # -------------------------------------------------
    # validate_update_wine
    # -------------------------------------------------

    def test_validate_update_wine_valid(self):
        data = {
            "price": 45,
            "wine_id": 1
        }

        errors = validate_update_wine(data)

        self.assertEqual(errors, [])
        print("Valid update wine test passed")


    def test_validate_update_wine_invalid_price(self):
        data = {
            "price": 0,
            "wine_id": 1
        }

        errors = validate_update_wine(data)

        self.assertIn("Price must be at least 1", errors)
        print("Invalid update wine price test passed")


    # -------------------------------------------------
    # validate_restaurant_ID
    # -------------------------------------------------

    def test_validate_restaurant_id_valid(self):
        data = {
            "restaurant_id": 1
        }

        errors = validate_restaurant_ID(data)

        self.assertEqual(errors, [])
        print("Valid restaurant ID test passed")


    def test_validate_restaurant_id_missing(self):
        data = {}

        errors = validate_restaurant_ID(data)

        self.assertIn("restaurant_id is required", errors)
        print("Missing restaurant ID test passed")


    def test_validate_restaurant_id_invalid_type(self):
        data = {
            "restaurant_id": "one"
        }

        errors = validate_restaurant_ID(data)

        self.assertIn(
            "Restaurant_id must be a whole number",
            errors
        )

        print("Invalid restaurant ID datatype test passed")


    # -------------------------------------------------
    # validate_dishes
    # -------------------------------------------------

    def test_validate_dishes_valid(self):
        data = {
            "dish_name": "Beef Wellington",
            "category": "main",
            "description": "Beef with mushroom duxelles",
            "body_score": 15,
            "tannin_score": 12,
            "acidity_score": 10,
            "sweetness_score": 3,
            "available": 1,
            "colour_wine": "Red",
            "requires_sauce": 1
        }

        errors = validate_dishes(data)

        self.assertEqual(errors, [])
        print("Valid dish test passed")


    def test_validate_dishes_invalid_score(self):
        data = {
            "dish_name": "Beef Wellington",
            "category": "main",
            "description": "Beef with mushroom duxelles",
            "body_score": 25,
            "tannin_score": 12,
            "acidity_score": 10,
            "sweetness_score": 3,
            "available": 1,
            "colour_wine": "Red",
            "requires_sauce": 1
        }

        errors = validate_dishes(data)

        self.assertIn(
            "body_score must be between 0 and 20",
            errors
        )

        print("Invalid dish score test passed")


    def test_validate_dishes_invalid_availability(self):
        data = {
            "dish_name": "Beef Wellington",
            "category": "main",
            "description": "Beef with mushroom duxelles",
            "body_score": 15,
            "tannin_score": 12,
            "acidity_score": 10,
            "sweetness_score": 3,
            "available": 4,
            "colour_wine": "Red",
            "requires_sauce": 1
        }

        errors = validate_dishes(data)

        self.assertIn("Available is only 0 or 1", errors)
        print("Invalid dish availability test passed")


    # -------------------------------------------------
    # validate_dishes_ai
    # -------------------------------------------------

    def test_validate_dishes_ai_valid(self):
        data = {
            "dish_name": "Roast Chicken",
            "category": "main",
            "description": "Roasted chicken with herbs"
        }

        errors = validate_dishes_ai(data)

        self.assertEqual(errors, [])
        print("Valid AI dish test passed")


    def test_validate_dishes_ai_empty_description(self):
        data = {
            "dish_name": "Roast Chicken",
            "category": "main",
            "description": ""
        }

        errors = validate_dishes_ai(data)

        self.assertIn("description cannot be empty", errors)
        print("AI dish empty description test passed")


    # -------------------------------------------------
    # validate_sauce
    # -------------------------------------------------

    def test_validate_sauce_valid(self):
        data = {
            "name": "Peppercorn Sauce",
            "body_modifier": 2,
            "tannin_modifier": 1,
            "acidity_modifier": 0,
            "sweetness_modifier": 1,
            "available": 1
        }

        errors = validate_sauce(data)

        self.assertEqual(errors, [])
        print("Valid sauce test passed")


    def test_validate_sauce_invalid_modifier(self):
        data = {
            "name": "Peppercorn Sauce",
            "body_modifier": 5,
            "tannin_modifier": 1,
            "acidity_modifier": 0,
            "sweetness_modifier": 1,
            "available": 1
        }

        errors = validate_sauce(data)

        self.assertIn(
            "body_modifier must be between -3 and 3",
            errors
        )

        print("Invalid sauce modifier test passed")


    def test_validate_sauce_invalid_availability(self):
        data = {
            "name": "Peppercorn Sauce",
            "body_modifier": 2,
            "tannin_modifier": 1,
            "acidity_modifier": 0,
            "sweetness_modifier": 1,
            "available": 5
        }

        errors = validate_sauce(data)

        self.assertIn("Available is only 0 or 1", errors)
        print("Invalid sauce availability test passed")


    # -------------------------------------------------
    # validate_signup
    # -------------------------------------------------

    def test_validate_signup_valid(self):
        data = {
            "username": "restaurantowner",
            "password": "Password1!",
            "company_name": "SommelierIQ Ltd",
            "restaurant_name": "The Wine House",
            "outlet_name": "City Centre",
            "city": "Dublin",
            "address": "1 Main Street",
            "phone": "0123456789",
            "email": "owner@example.com",
            "plan": "professional"
        }

        errors = validate_signup(data)

        self.assertEqual(errors, [])
        print("Valid signup test passed")


    def test_validate_signup_invalid_plan(self):
        data = {
            "username": "restaurantowner",
            "password": "Password1!",
            "company_name": "SommelierIQ Ltd",
            "restaurant_name": "The Wine House",
            "outlet_name": "City Centre",
            "city": "Dublin",
            "address": "1 Main Street",
            "phone": "0123456789",
            "email": "owner@example.com",
            "plan": "free"
        }

        errors = validate_signup(data)

        self.assertIn("Plan is incorrect", errors)
        print("Invalid signup plan test passed")


    def test_validate_signup_invalid_password(self):
        data = {
            "username": "restaurantowner",
            "password": "password",
            "company_name": "SommelierIQ Ltd",
            "restaurant_name": "The Wine House",
            "outlet_name": "City Centre",
            "city": "Dublin",
            "address": "1 Main Street",
            "phone": "0123456789",
            "email": "owner@example.com",
            "plan": "professional"
        }

        errors = validate_signup(data)

        self.assertIn(
            "Please ensure password has one lowercase, one uppercase, "
            "one number, one special character and is between 8 and 15 characters long",
            errors
        )

        print("Invalid signup password test passed")


suite = unittest.TestLoader().loadTestsFromTestCase(TestValidations)
runner = unittest.TextTestRunner(verbosity=0)
result = runner.run(suite)
print(f"Tests run: {result.testsRun}")