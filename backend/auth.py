#File with authentication routes
from flask import Blueprint, render_template, redirect, url_for, request, flash, make_response
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from flask import jsonify
from flask_cors import cross_origin
from flask_cors import CORS
import sys 
from flask_wtf.csrf import CSRFProtect
# for debugging 
# from __init__ import db
# from models import User

CLIENT_ID = 'd7382139725675f1a561f7c2fd0009c2'
auth = Blueprint("auth", __name__)


@auth.route("/login", methods = ['GET', 'POST'])
@cross_origin()
def login():
    from models import User
    if request.method == 'POST':
        #username = request.form.get('username')
        email = request.form.get("email")
        password = request.form.get("password")

        #If user exists and password matches then log in user
        user= User.query.filter_by(email=email).first() 
        if user:
            if check_password_hash(user.password, password):
                flash("Logged In!", category='success')
                login_user(user, remember= True)
                return redirect(url_for('views.home'))
            else:
                flash('Password is incorrect', category= 'error')
        else:
            flash('Email does not exist', category = 'error')
    
    # return render_template("login.html", user = current_user) #return currently logged in or not user, to check if authenticated
    return jsonify({ "success": True, "message": "Successfully logged in " })


import sys  # Add this at the top

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




@auth.route("/logout")
@cross_origin()
@login_required #only able to acces page/route if logged in
def logout():
    logout_user()
    return redirect(url_for('views.home'))
    

