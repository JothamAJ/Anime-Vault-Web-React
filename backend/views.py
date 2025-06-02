#Routes for core website pages
from flask import Blueprint, render_template
from flask_login import login_required, current_user
# from backend.anime_search import get_anime_ranking
from anime_search import get_anime_ranking
from flask import Blueprint, render_template, request, redirect, url_for, flash
from sqlalchemy import select
from flask import jsonify, url_for
# from models import User


views = Blueprint("views", __name__)


@views.route("/")
@views.route("/home")
@login_required #no access to home page unless logged in
def home():
    popular_animes = get_anime_ranking('bypopularity')
    airing_animes = get_anime_ranking('airing')
    upcoming_animes = get_anime_ranking('upcoming')
    movie_animes = get_anime_ranking('movie')
    favorite_animes = get_anime_ranking('favorite')

    return render_template("home.html", 
                           popular_animes=popular_animes,
                           airing_animes = airing_animes,
                           upcoming_animes = upcoming_animes,
                           movie_animes = movie_animes,
                           favorite_animes = favorite_animes,
                           user = current_user) #return render template for home




#View to handle user profile
@views.route("/profile")
@login_required #no access unless logged in
def profile():
    from __init__ import db
    # from models import User
    username = request.form.get("username") 
    email = request.form.get("email") #set image for user profile
    image_file = url_for('static', filename ='profile_pics/' + current_user.image_file) if current_user.image_file else url_for('static', filename ='profile_pics/default.jpg')                                                                                              
    return render_template('profile.html', user = current_user, image_file = image_file)



@views.route('/watchlist/<status>')
@login_required
def watchlist(status):
    from __init__ import db
    from models import Anime
    valid_statuses = ['Watching', 'Dropped', 'Completed', 'On-Hold', 'Plan-to-Watch']
    
    if status not in valid_statuses:
        return "Invalid status", 404

    # Query anime with the selected status
    watchlist = Anime.query.filter_by(user_id=current_user.id, status=status).all()

    return render_template('watchlist.html', user=current_user, watchlist=watchlist, selected_status=status)


# API endpoint to get user profile information 
@views.route("/api/profile", methods=['GET', 'OPTIONS'])
def api_profile():

    if request.method == "OPTIONS":
        response = jsonify({"message": "CORS preflight response"})
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response
    

    if current_user.is_authenticated:
        image_file = url_for(
            'static',
            filename='profile_pics/' + current_user.image_file
        ) if current_user.image_file else url_for(
            'static',
            filename='profile_pics/default.jpg'
        )

        return jsonify({
            "loggedIn": True,
            "user": {
                "id": current_user.id,
                "username": current_user.username,
                "email": current_user.email,
                "image": image_file
            }
        }), 200
    else:
        return jsonify({"loggedIn": False, "message": "User not authenticated"}), 401

   

