#Routes for interacting with my anime list api 
from flask import Blueprint, request, flash, redirect, url_for
from flask_login import login_required, current_user
from flask import session
from flask import jsonify
import requests
import sys


anime = Blueprint('anime', __name__)
CLIENT_ID = 'd7382139725675f1a561f7c2fd0009c2'


@anime.route('/search', methods = ['GET'])
def anime_search():
        search_url = 'https://api.myanimelist.net/v2/anime'
        animes = []
        # authentication headers
        headers = {
                'X-MAL-CLIENT-ID': CLIENT_ID,
                }
        
        # Get user query
        query = request.args.get('query')

        if not query:
              return jsonify({'error':'No query provided'}), 400
              

        # if request.method == 'GET': #user request
        else:
            params = {
                'q' :  query, #get user query
                'limit': '9'    
                }

                #Get the list of anime based on search query
            r = requests.get(search_url, headers=headers, params= params) 
            results = r.json().get('data', []) #return empty list if no options found
                    

            anime_ids = [result['node']['id'] for result in results]
            #Get anime details
            anime_details = []
            for anime_id in anime_ids:
                    anime_url = f'https://api.myanimelist.net/v2/anime/{anime_id}'
                    anime_params = {
                    'fields': 'title,alternative_titles,genres,synopsis,num_episodes,rating,status',
                    'limit': '9'
                    }
                    r = requests.get(anime_url, headers=headers, params= anime_params)
                    anime_details.append(r.json())
                            
                    

            #specific anime details
            for anime in anime_details:
                    anime_data = {
                            'id' : anime['id'],
                            'title' : anime['title'],
                            'genres' : anime['genres'],
                            'image' : anime['main_picture']['large'],
                            'synopsis' : anime['synopsis'],
                            'episodes' : anime['num_episodes'],
                            'status' : anime['status']
                    }
                    
                    animes.append(anime_data)      
                    
            
            return jsonify(animes)
        




@anime.route('/ranking/<ranking_type>', methods=['GET'])
def get_anime_ranking(ranking_type):

    if not ranking_type:
         return jsonify ({'error':'Invalid ranking type'}), 400
    
    else:
         
        animes = []
        url = 'https://api.myanimelist.net/v2/anime/ranking'
        headers = {
            'X-MAL-CLIENT-ID': CLIENT_ID,
        }
        params = {
            'ranking_type': ranking_type,
            'limit': '9'
        }
    
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()  # Raise an exception
        results = response.json().get('data', [])
        anime_ids = [result['node']['id'] for result in results]

        anime_details = []
        for id in anime_ids:
            anime_url = f'https://api.myanimelist.net/v2/anime/{id}'
            anime_params = {
                    'fields': 'title,synopsis,main_picture',
                    'limit': '3'
                    }
            r = requests.get(anime_url, headers=headers, params= anime_params)
            anime_details.append(r.json())

        #specific anime details
        for anime in anime_details:
            anime_data = {
                'id' : anime['id'],
                'title' : anime['title'],
                'image' : anime['main_picture']['large'] if 'main_picture' in anime and 'large' in anime['main_picture'] else None,                 
                'synopsis' : anime['synopsis']            
            }
            animes.append(anime_data)
        
    return jsonify(animes[:8])
    


# Route to add anime to user's watchlist
@anime.route('/add_to_list', methods=['POST'])
@login_required
def add_to_list_api():
    from models import Anime, db
    data = request.json

    anime_id = data.get('anime_id')
    anime_title = data.get('anime_title')
    anime_picture = data.get('anime_main_picture')
    anime_synopsis = data.get('anime_synopsis')
    anime_episodes = data.get('anime_episodes')
    anime_genres = data.get('anime_genres')

    if not anime_id or not anime_title:
        return jsonify({"error": "Invalid anime data"}), 400

    existing_anime = Anime.query.filter_by(id=anime_id, user_id=current_user.id).first()

    if existing_anime and existing_anime.status == "Watching":
        return jsonify({"error": "Anime is already in your list"}), 400

    elif existing_anime:
        existing_anime.status = "Watching"
        db.session.commit()
        return jsonify({"message": f"{anime_title} status updated to Watching"}), 200

    new_anime = Anime(
        id=anime_id,
        title=anime_title,
        status='Watching',
        main_picture=anime_picture,
        synopsis=anime_synopsis,
        episodes=anime_episodes,
        genres=anime_genres,
        user_id=current_user.id
    )

    db.session.add(new_anime)
    db.session.commit()

    return jsonify({"message": f"{anime_title} added to your list"}), 201

   