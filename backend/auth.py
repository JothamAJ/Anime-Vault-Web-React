#File with authentication routes
from flask import Blueprint, render_template, redirect, url_for, request, flash
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
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
    
    return render_template("login.html", user = current_user) #return currently logged in or not user, to check if authenticated



@auth.route("/sign-up", methods = ['GET', 'POST'])
def sign_up():
    from __init__ import db
    from models import User

    #get sign up request data
    if request.method == 'POST':
        email = request.form.get("email")
        username = request.form.get("username")
        password1 = request.form.get("password1")
        password2 = request.form.get("password2")

        #check if user exists and validation
        email_exists = User.query.filter_by(email=email).first()
        username_exists = User.query.filter_by(username=username).first()

        if email_exists:
            flash('Email is already in use!', category = 'error') #flash error message
        elif username_exists:
            flash('Username is already in use!', category = 'error') #flash error message
        elif password1 != password2: 
            flash('Passwords do not match!', category = 'error')
        elif len(username) < 2:
            flash('Username is too short', category = 'error')
        elif len(password1) < 6:
            flash('Password is too short', category = 'error')
        elif len(email) < 4:
            flash('Email is invalid', category = 'error')
        else: #create user and add to database
            new_user = User(email = email, username = username, password = generate_password_hash(password1))
            db.session.add(new_user)
            db.session.commit()
            login_user(new_user, remember= True) #log in user after creating account
            flash('User created!')
            return redirect(url_for('views.home'))

    
    return render_template("signup.html", user = current_user)



@auth.route("/logout")
@login_required #only able to acces page/route if logged in
def logout():
    logout_user()
    return redirect(url_for('views.home'))
    

