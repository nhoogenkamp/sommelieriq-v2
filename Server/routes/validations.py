from datetime import datetime
import re

def validate_wine(data):
    #validations: https://www.w3schools.com/Python/trypython.asp?filename=demo_for_break
    #https://ashishsah1111.medium.com/input-validation-and-error-handling-in-flask-apis-332f4e9bc05d
    # append https://www.w3schools.com/Python/trypython.asp?filename=demo_ref_list_append2
    # f string https://www.geeksforgeeks.org/python/formatted-string-literals-f-strings-python/
    # https://www.w3schools.com/Python/trypython.asp?filename=demo_for_break

    # Validations for add wine
    fields = ["name", "wine_type", "grape", "country", "region", "year", "bottle_type", "price", "available", "description"
              , "body_score", "tannin_score", "acidity_score", "sweetness_score"]

    errors = []

    # checking if fields are not missing
    for f in fields:
        if f not in data:
            errors.append(f"{f} is required")

    # checking if is string        
    inputstring = ["wine_type", "grape", "country", "bottle_type", "description"]
    for s in inputstring:
        if not isinstance(data.get(s), str):
            errors.append(f"{s} must be text")

    # checking if its int
    inputint = ["year", "available", "body_score", "tannin_score", "acidity_score", "sweetness_score"]
    for i in inputint:
        if not isinstance(data.get(i), int):
            errors.append(f"{i} must be a whole number")

    if "year" in data: 
        # checking if year is an int and greater than 0
        if not isinstance(data.get("year"), int):
            errors.append("year must be a whole number")
        elif data["year"] < 1900 or data["year"]> datetime.now().year:
                errors.append("Year is incorrect")

    if "bottle_type" in data: 
        Bottletypes = ["Glass", "Half Bottle", "Bottle", "Magnum", "Jeroboam","Melchior", "Salmanazar", "Double Magnum", "Imperial"]
        if data["bottle_type"] not in Bottletypes:
            errors.append("Incorrect bottletype")

    if "price" in data: 
        if not isinstance(data.get("price"),(int, float)):
            errors.append("Price must be a number")
        else:    
            if data["price"] < 1:
                errors.append("Price must be at least 1")

    if "available" in data: 
        availablenum = [1 , 0]
        if data["available"] not in availablenum:
            errors.append("Available is only 0 or 1")

    inputscore = ["body_score","tannin_score","acidity_score","sweetness_score"]
    for i in inputscore:
        if not isinstance(data.get(i), int):
            errors.append(f"{i} must be a whole number")
        else:
            if data[i] < 0 or data[i] > 20:
                errors.append(f"{i} must be between 0 and 20")

    return errors


# validating add user
def validate_registration(data):

    # Validations for add wine
    fields = ["restaurant_id", "username", "password"]

    errors = []

    # checking if fields are not missing
    for f in fields:
        if f not in data:
            errors.append(f"{f} is required")

    if "restaurant_id" in data: 

        # checking if restaurant_id is an int and greater than 0
        if not isinstance(data.get("restaurant_id"), int):
            errors.append("Restaurant_id must be a whole number")
        else:    
            if data["restaurant_id"] < 1:
                errors.append("Restaurant_id must greater than 1")

    # checking if username has more then 6 characters and no spaces
    if "username" in data: 
       if (len(data["username"])) < 6 or " " in data ["username"]:
            errors.append("Username needs at least 6 Characters and no spaces!")

    PASSWORD_REGEX = re.compile(
    r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$'
)
    if "password" in data:
        if " " in data ["password"]:
            errors.append("password can't contain spaces!")
        elif not PASSWORD_REGEX.match (data["password"]):
                errors.append("Please ensure password has one lowercase, one uppercase, one special character and minimum 8 characters long ")


    return errors

# validating login
def validate_login(data):

    # Validations for add wine
    fields = ["username", "password"]

    errors = []

    # checking if fields are not missing
    for f in fields:
        if f not in data or " " in data [f]:
            errors.append(f"{f} is required")

    return errors

#validating update availability
def validate_availability(data):

    # Validations for add wine
    fields = ["wine_id", "available"]

    errors = []

    # checking if fields are not missing
    for f in fields:
        if f not in data:
            errors.append(f"{f} is required")

    if "wine_id" in data: 

        # checking if wine_id is an int and greater than 0
        if not isinstance(data.get("wine_id"), int):
            errors.append("wine_id must be a whole number")
        else:    
            if data["wine_id"] < 1:
                errors.append("wine_id must greater than 1")

    if "available" in data: 
        availablenum = [1 , 0]
        if data["available"] not in availablenum:
            errors.append("Available is only 0 or 1")

    return errors

#validating update availability
def validate_delete_wine(data):

    # Validations for add wine
    fields = ["wine_id"]

    errors = []

    # checking if fields are not missing
    for f in fields:
        if f not in data:
            errors.append(f"{f} is required")

    if "wine_id" in data: 

        # checking if wine_id is an int and greater than 0
        if not isinstance(data.get("wine_id"), int):
            errors.append("wine_id must be a whole number")
        else:    
            if data["wine_id"] < 1:
                errors.append("wine_id must greater than 0")

    return errors

#validating Deletion of Dish 
def validate_delete_dish(data):

    # Validations for add wine
    fields = ["food_id"]

    errors = []

    # checking if fields are not missing
    for f in fields:
        if f not in data:
            errors.append(f"{f} is required")

    if "food_id" in data: 

        # checking if food_id is an int and greater than 0
        if not isinstance(data.get("food_id"), int):
            errors.append("food_id must be a whole number")
        else:    
            if data["food_id"] < 1:
                errors.append("food_id must greater than 0")

    return errors

#validating send dish
def validate_senddish(data):

    # Validations for add wine
    fields = ["restaurant_id", "dishes"]

    errors = []

    # checking if fields are not missing
    for f in fields:
        if f not in data:
            errors.append(f"{f} is required")
        elif len(data["dishes"]) == 0:
            errors.append("At least one dish is required")

    if "restaurant_id" in data: 

    # checking if restaurant_id is an int and greater than 0
        if not isinstance(data.get("restaurant_id"), int):
            errors.append("Restaurant_id must be a whole number")
        else:    
            if data["restaurant_id"] < 1:
                errors.append("Restaurant_id must greater than 1") 
    return errors

#validating update wine price
def validate_update_wine(data):

    # Validations for add wine
    fields = ["price", "wine_id"]

    errors = []

    for f in fields:
        if f not in data:
            errors.append(f"{f} is required")

    if "wine_id" in data: 

        # checking if wine_id is an int and greater than 0
        if not isinstance(data.get("wine_id"), int):
            errors.append("wine_id must be a whole number")
        else:    
            if data["wine_id"] < 1:
                errors.append("wine_id must greater than 0")
    
    if "price" in data: 
        if not isinstance(data.get("price"),(int, float)):
            errors.append("Price must be a number")
        else:    
            if data["price"] < 1:
                errors.append("Price must be at least 1")            
    
    return errors

#validating getting restuarant ID for client home page
def validate_restaurant_ID(data):

    # Validations for add wine
    fields = ["restaurant_id"]

    errors = []

    for f in fields:
        if f not in data:
            errors.append(f"{f} is required")

    if "restaurant_id" in data: 

        # checking if restaurant_id is an int and greater than 0
        if not isinstance(data.get("restaurant_id"), int):
            errors.append("Restaurant_id must be a whole number")
        else:    
            if data["restaurant_id"] < 1:
                errors.append("Restaurant_id must greater than 1")     
    
    return errors


# validating uploaded food dishes
def validate_dishes(data):

    fields = ["dish_name","category", "description","body_score", "tannin_score", "acidity_score", "sweetness_score","available","colour_wine", "requires_sauce" ]

    errors = []

    # Checks that all required fields are present.
    for f in fields:
        if f not in data:
            errors.append(f"{f} is required")

    # Checks text fields.
    inputstring = ["dish_name", "category", "description", "colour_wine" ]

    for s in inputstring:
        if not isinstance(data.get(s), str):
            errors.append(f"{s} must be text")

    # Checks whole number fields.
    inputint = ["body_score", "tannin_score", "acidity_score", "sweetness_score", "available", "requires_sauce"]

    for i in inputint:
        if not isinstance(data.get(i), int):
            errors.append(f"{i} must be a whole number")

    # Checks availability is either 0 or 1.
    if "available" in data:
        available_numbers = [0, 1]

        if data["available"] not in available_numbers:
            errors.append("Available is only 0 or 1")

    # Checks requires_sauce is either 0 or 1.
    if "requires_sauce" in data:
        sauce_numbers = [0, 1]

        if data["requires_sauce"] not in sauce_numbers:
            errors.append("requires_sauce is only 0 or 1")

    # Checks all food scores are between 0 and 20.
    inputscore = [ "body_score", "tannin_score", "acidity_score", "sweetness_score"]

    for i in inputscore:
        if isinstance(data.get(i), int):
            if data[i] < 0 or data[i] > 20:
                errors.append(f"{i} must be between 0 and 20")

    return errors

# Validating uploaded sauces.
def validate_sauce(data):

    # Fields required for uploading a sauce.
    fields = ["name", "body_modifier", "tannin_modifier", "acidity_modifier", "sweetness_modifier", "available"]

    errors = []

    # Checks if fields are missing.
    for f in fields:
        if f not in data:
            errors.append(f"{f} is required")

    # Checks if name is text.
    if "name" in data:
        if not isinstance(data.get("name"), str):
            errors.append("name must be text")

    # Checks if modifiers are whole numbers.
    inputint = ["body_modifier", "tannin_modifier", "acidity_modifier", "sweetness_modifier", "available"]

    for i in inputint:
        if not isinstance(data.get(i), int):
            errors.append(f"{i} must be a whole number")

    # Checks modifier values are between -3 and +3.
    modifiers = ["body_modifier","tannin_modifier","acidity_modifier","sweetness_modifier"]

    for i in modifiers:
        if isinstance(data.get(i), int):
            if data[i] < -3 or data[i] > 3:
                errors.append(f"{i} must be between -3 and 3")

    # Checks availability is either 0 or 1.
    if "available" in data:
        availablenum = [0, 1]

        if data["available"] not in availablenum:
            errors.append("Available is only 0 or 1")

    return errors

