#File with authentication routes
from flask import Blueprint, render_template, redirect, url_for, request, flash
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from flask import jsonify
# from __init__ import db
# from models import User

CLIENT_ID = 'd7382139725675f1a561f7c2fd0009c2'


auth = Blueprint("auth", __name__)



@auth.route("/login", methods = ['GET', 'POST'])
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
    return jsonify({ "success": True, "message": "Successfully logged in yerrrr" })


# @auth.route("/sign-up", methods = ['GET','POST'])
# def sign_up():
#     from __init__ import db
#     from models import User

#     #get sign up request data
#     #use JSON - data used in APIs to send data between a server and a client
#     if request.method == "GET":
#         return jsonify({"message": "Signup endpoint is ready"}), 200
#     data = request.get_json()

#     if data is None:
#         return jsonify({"success": False, "message": "No JSON data provided"}), 415

#     print("Received Data:", data) #debug
#     print(request.data) 
#     if request.method == 'GET':
#         email = data.get("email")
#         username = data.get("username")
#         password1 = data.get("password1")
#         password2 = data.get("password2")

#         print(f"Email: {email}, Username: {username}, Password1: {password1}, Password2: {password2}")  #debug
#         #check if user exists and validation
#         email_exists = User.query.filter_by(email=email).first()
#         username_exists = User.query.filter_by(username=username).first()

#         if email_exists:
#             return jsonify({ "success": False, "message": "Email is already in use!" }), 400
#         elif username_exists:
#             return jsonify({ "success": False, "message": "Username is already in use!" }), 400
#         elif password1 != password2: 
#             return jsonify({ "success": False, "message": "Password do not match!" }), 400
#         elif len(username) < 2:
#             return jsonify({ "success": False, "message": "Username is too short!" }), 400
#         elif len(password1) < 6:
#             return jsonify({ "success": False, "message": "Password is too short!" }), 400
#         elif len(email) < 4:
#             return jsonify({ "success": False, "message": "Email is too short!" }), 400
#         else: #create user and add to database
#             new_user = User(email = email, username = username, password = generate_password_hash(password1))
#             db.session.add(new_user)
#             db.session.commit()
#             login_user(new_user, remember= True) #log in user after creating account
#             print("User created and logged in.") 
            
#     print("Request method:", request.method)
#     print(request.content_type) 
#     print(request.get_json()) 
#     return jsonify({ "success": True, "message": "User created!" }), 201
    

@auth.route("/sign-up", methods=['GET', 'POST'])
def sign_up():
    from __init__ import db
    from models import User

    if request.method == "GET":
        return jsonify({"Testing Testing": "Signup endpoint is ready"}), 200

    if request.method == "POST":

    # POST request
        data = request.get_json()

        if data is None:
            return jsonify({"success": False, "message": "No JSON data provided"}), 415

        print("Received Data:", data)  #debug
        print(request.data)

        #get form fields
        email = data.get("email")
        username = data.get("username")
        password1 = data.get("password1")
        password2 = data.get("password2")

        print(f"Email: {email}, Username: {username}, Password1: {password1}, Password2: {password2}")  #debug

        # Validation checks
        email_exists = User.query.filter_by(email=email).first()
        username_exists = User.query.filter_by(username=username).first()

        if email_exists:
            return jsonify({"success": False, "message": "Email is already in use!"}), 400
        elif username_exists:
            return jsonify({"success": False, "message": "Username is already in use!"}), 400
        elif password1 != password2:
            return jsonify({"success": False, "message": "Passwords do not match!"}), 400
        elif len(username) < 2:
            return jsonify({"success": False, "message": "Username is too short!"}), 400
        elif len(password1) < 6:
            return jsonify({"success": False, "message": "Password is too short!"}), 400
        elif len(email) < 4:
            return jsonify({"success": False, "message": "Email is too short!"}), 400

        #Create user
        new_user = User(
            email=email,
            username=username,
            password=generate_password_hash(password1)
        )
        db.session.add(new_user)
        db.session.commit()
        login_user(new_user, remember=True)

        print("User created and logged in.")
        return jsonify({"success": True, "message": "User created!"}), 201




@auth.route("/logout")
@login_required #only able to acces page/route if logged in
def logout():
    logout_user()
    return redirect(url_for('views.home'))
    

