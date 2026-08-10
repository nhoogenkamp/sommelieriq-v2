from flask import Flask
from routes.wines import get_tables, get_wines , get_all_wines
from routes.menu import get_food, get_sauces
from routes.senddish import send_dish
from routes.admin import add_admin, login_admin, check_admin, logout_admin
from routes.addwine import add_wine
from routes.deleteWine import delete_wine
from routes.updateWine import update_wine
from routes.availableWine import available_wine
from routes.uploadwines import upload_wines
from routes.uploadfood import upload_dishes
from routes.deleteDish import delete_dish
import os


from flask_cors import CORS
# Ran into CORS error:
#https://www.google.com/search?q=from+flask_cors+import+cors&oq=from+flask_cors+import+CORS&gs_lcrp=EgZjaHJvbWUqDQgAEAAYkQIYgAQYigUyDQgAEAAYkQIYgAQYigUyCAgBEAAYFhgeMggIAhAAGBYYHjIICAMQABgWGB4yCAgEEAAYFhgeMggIBRAAGBYYHjIICAYQABgWGB4yDQgHEAAYhgMYgAQYigUyBwgIEAAY7wUyBwgJEAAY7wXSAQcyNzBqMGo5qAIGsAIB8QX1TVs-UXY3Vg&sourceid=chrome&ie=UTF-8
# adding flask secret key for sessions and added CORS due to different address for front end: https://gist.github.com/frostming/3c2694c5e18f64ac7c17fd11178c98f5
app = Flask(__name__)
#with AI
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "temporary-dev-secret")
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
app.config["SESSION_COOKIE_SECURE"] = False
app.config["SESSION_COOKIE_HTTPONLY"] = True

# below is setting for different domains e.g. netifly and railway
# app.config["SESSION_COOKIE_SAMESITE"] = "None"
# app.config["SESSION_COOKIE_SECURE"] = True
# app.config["SESSION_COOKIE_HTTPONLY"] = True

CORS(app, supports_credentials=True, origins=[
    "https://merry-dragon-158655.netlify.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173"
])

# https://www.newline.co/@goatandsheep/python-dotenv-managing-your-environment-variables-with-ease--ce4fb62d
# Using .env file to store secret password etc.

@app.route('/getTable', methods=['GET'])
def tables():
    return get_tables()

#get wines from db
@app.route('/getWines', methods=['POST'])
def wines():
    return get_wines()

@app.route('/getallWines', methods=['GET'])
def all_wines():
    return get_all_wines()

#get all food from db
@app.route('/getFood', methods=['POST'])
def food_items():
    return get_food()

@app.route("/getSauces", methods=["POST"])
def sauce_items():
    return get_sauces()

# getting dish from frontend
@app.route('/senddish', methods=['POST'])
def receive_dish():
    return send_dish()

@app.route('/addAdmin', methods=['POST'])
def create_admin():
    return add_admin()

@app.route('/adminLogin', methods=['POST'])
def admin_login():
    return login_admin()

@app.route('/addWine', methods=['POST'])
def new_wine():
    return add_wine()

@app.route("/uploadWines", methods=["POST"])
def uploading_wines():
    return upload_wines()

@app.route('/deleteWine', methods=['DELETE'])
def deleting_wine():
    return delete_wine()

@app.route('/deleteDish', methods=['DELETE'])
def deleting_dish():
    return delete_dish()

@app.route('/uploadDishes', methods=['POST'])
def uploading_dishes():
    return upload_dishes()

@app.route('/availableWine', methods=['PUT'])
def updating_available_wine():
    return available_wine()

@app.route('/checkAdmin', methods=['GET'])
def checking_admin():
    return check_admin()

@app.route('/logout', methods=['POST'])
def logout():
    return logout_admin()

if __name__ == "__main__":
    print("connecting to DB....")
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 8080))
    )