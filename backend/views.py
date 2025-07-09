#Routes for core website pages
from flask_login import login_required, current_user
# from backend.anime_search import get_anime_ranking
from anime_search import get_anime_ranking
from flask import Blueprint, request, redirect, url_for, flash
from sqlalchemy import select
from flask import jsonify, url_for
from flask_login import login_required, current_user
# from models import User


views = Blueprint("views", __name__)








# @views.route('/watchlist/<status>')
# @login_required
# def watchlist(status):
#     from __init__ import db
#     from models import Anime
#     valid_statuses = ['Watching', 'Dropped', 'Completed', 'On-Hold', 'Plan-to-Watch']
    
#     if status not in valid_statuses:
#         return "Invalid status", 404

#     # Query anime with the selected status
#     watchlist = Anime.query.filter_by(user_id=current_user.id, status=status).all()

#     return render_template('watchlist.html', user=current_user, watchlist=watchlist, selected_status=status)


# API endpoint to get user profile information 
@views.route("/api/profile", methods=['GET', 'OPTIONS'])
# @login_required
def api_profile():

    if request.method == "OPTIONS":
        response = jsonify({"message": "CORS preflight response"})
        # response.headers["Access-Control-Allow-Origin"] = "*"
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




# Watchlist API endpoint to get user's watchlist
@views.route('/watchlist/<status>', methods=['GET'])
@login_required
def api_watchlist(status):
    from models import Anime
    valid_statuses = ['Watching', 'Dropped', 'Completed', 'On-Hold', 'Plan-to-Watch']
    if status not in valid_statuses:
        return jsonify({"error": "Invalid status"}), 404
    
    watchlist = Anime.query.filter_by(user_id=current_user.id, status=status).all()

    # Serialize anime list to JSON-friendly dict
    watchlist_data = []
    for anime in watchlist:
        watchlist_data.append({
            "id": anime.id,
            "title": anime.title,
            "main_picture": anime.main_picture,
            "episodes": anime.episodes,
            "status": anime.status,
        })

    return jsonify({"watchlist": watchlist_data})
