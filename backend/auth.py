#File with authentication routes
from flask import Blueprint, render_template, redirect, url_for, request, flash, make_response
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from flask import jsonify
from flask_cors import cross_origin
from flask_cors import CORS
import sys 
from flask_wtf.csrf import CSRFProtect
from flask_login import current_user, login_required
from flask import jsonify
# for debugging 
# from __init__ import db
# from models import User

CLIENT_ID = 'd7382139725675f1a561f7c2fd0009c2'
auth = Blueprint("auth", __name__)


@auth.route("/login", methods=["POST", "OPTIONS, GET"])
def login():
    from models import User

    #Handle CORS and method not allowed error
    if request.method == "GET":
        if current_user.is_authenticated:
            return jsonify({
                "message": "Already logged in",
                "id": current_user.id,
                "email": current_user.email,
                "username": current_user.username
            }), 200
        else:
            return jsonify({"message": "Please log in via POST"}), 401

    if request.method == "OPTIONS":
        response = make_response(jsonify({}), 200)
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response

    if not request.is_json:
        return jsonify({"success": False, "message": "Expected JSON body"}), 415

    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"success": False, "message": "Email and password required"}), 400

    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password, password):
        login_user(user, remember=True)
        return jsonify({
            "success": True,
            "message": "Login successful",
            "id": user.id,
            "email": user.email,
            "username": user.username
        }), 200

    # Failed login (wrong email or password)
    return jsonify({"success": False, "message": "Invalid email or password"}), 401



@auth.route("/sign-up", methods=['GET', 'POST', 'OPTIONS'])
def sign_up():
    from __init__ import db
    from models import User

    if request.method == "OPTIONS":
        response = make_response()
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response.headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response

    if request.method == "GET":
        return jsonify({"Testing Testing": "Signup endpoint is ready"}), 200

    if request.method == "POST":
        try:
            data = request.get_json(force=True)
            sys.stdout.write(f"Received Data: {data}\n")
            sys.stdout.flush()

            if data is None:
                sys.stdout.write("Did not receive data\n")
                sys.stdout.flush()
                return jsonify({"success": False, "message": "No JSON data provided"}), 415

            # get form fields
            email = data.get("email")
            username = data.get("username")
            password1 = data.get("password1")
            password2 = data.get("password2")

            sys.stdout.write(f"Email: {email}, Username: {username}, Password1: {password1}, Password2: {password2}\n")
            sys.stdout.flush()

            # Validation checks
            if User.query.filter_by(email=email).first():
                return jsonify({"success": False, "message": "Email is already in use!"}), 400
            if User.query.filter_by(username=username).first():
                return jsonify({"success": False, "message": "Username is already in use!"}), 400
            if password1 != password2:
                return jsonify({"success": False, "message": "Passwords do not match!"}), 400
            if len(username) < 2:
                return jsonify({"success": False, "message": "Username is too short!"}), 400
            if len(password1) < 6:
                return jsonify({"success": False, "message": "Password is too short!"}), 400
            if len(email) < 4:
                return jsonify({"success": False, "message": "Email is too short!"}), 400

            # Create user
            new_user = User(
                email=email,
                username=username,
                password=generate_password_hash(password1)
            )
            db.session.add(new_user)
            db.session.commit()
            login_user(new_user, remember=True)

            sys.stdout.write("User created and logged in.\n")
            sys.stdout.flush()

            return jsonify({"success": True, "message": "User created!"}), 201

        except Exception as e:
            sys.stdout.write(f"JSON parse error: {e}\n")
            sys.stdout.flush()
            return jsonify({"message": "Invalid JSON"}), 400



# Route to log out the user
@auth.route("/logout", methods = ['POST'])
@login_required #only able to acces page/route if logged in
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 200
    



# returns the current user's information if they are logged in
@auth.route("/current-user", methods=['GET', 'OPTIONS'])
def get_current_user():

    if request.method == "OPTIONS":
        response = jsonify({"message": "CORS preflight response"})
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response
    

    if current_user.is_authenticated:
        return jsonify({
            "loggedIn": True,
            "user": {
                "id": current_user.id,
                "username": current_user.username,
                "email": current_user.email
            }
        }), 200
    else:
        return jsonify({"loggedIn": False}), 200
