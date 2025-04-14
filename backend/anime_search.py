#Routes for interacting with my anime list api 
from flask import Blueprint, render_template, request, flash, redirect, url_for
from flask_login import login_required, current_user
from flask import session
import requests


anime = Blueprint('anime', __name__)
CLIENT_ID = 'd7382139725675f1a561f7c2fd0009c2'


@anime.route('/search', methods = ['GET', 'POST'])
def anime_search():
        search_url = 'https://api.myanimelist.net/v2/anime'
        animes = []

        headers = {
                'X-MAL-CLIENT-ID': CLIENT_ID,
                }

        if request.method == 'POST': #user request

                params = {
                'q' :  request.form.get('query'), #get user query
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
                                'main_picture' : anime['main_picture']['large'],
                                'synopsis' : anime['synopsis'],
                                'episodes' : anime['num_episodes'],
                                'status' : anime['status']
                        }
                
                        animes.append(anime_data)      
                
        
        #store data in session to add to list
                session["anime_search_results"] = animes
                
        return render_template('search.html', user = current_user, animes = animes)
        



def get_anime_ranking(ranking_type):
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
    response.raise_for_status()  # Raise an exception for non-2xx status codes
    results = response.json().get('data', [])
    anime_ids = [result['node']['id'] for result in results]

    anime_details = []
    for id in anime_ids:
         anime_url = f'https://api.myanimelist.net/v2/anime/{id}'
         anime_params = {
                 'fields': 'title,synopsis',
                'limit': '3'
                }
         r = requests.get(anime_url, headers=headers, params= anime_params)
         anime_details.append(r.json())


      #specific anime details
    for anime in anime_details:
                anime_data = {
                                'id' : anime['id'],
                                'title' : anime['title'],
                                'main_picture' : anime['main_picture']['large'],                 
                                'synopsis' : anime['synopsis']            
                               
                        }
                                                
                animes.append(anime_data)
        
    return animes[:6]
    

# Add anime to list
@anime.route('/add_to_list', methods=['POST'])
@login_required
def add_to_list():
    from models import User, Anime, db

    # Get the anime details from the session
    anime_id = request.form.get('anime_id')
    anime_title = request.form.get('anime_title')
    anime_picture = request.form.get('anime_main_picture')
    anime_synopsis = request.form.get('anime_synopsis')
    anime_episodes = request.form.get('anime_episodes')
    anime_genres = request.form.get('anime_genres')

    print("Your request", request.form)

    # Validate inputs
    if not anime_id or not anime_title:
        flash("Invalid anime data", category='error')
        return redirect(url_for('views.watchlist'))

    # Check if the anime is already in the list
    existing_anime = Anime.query.filter_by(id=anime_id, user_id=current_user.id).first()
    if existing_anime and existing_anime.status == "Watching":
        flash("Anime is already in your list", category='error')
        return redirect(url_for('views.watchlist', status='Watching'))
    
    # If the anime is in the list but dropped, update the status
    elif existing_anime:
        # Update the status if the anime exists
        existing_anime.status = "Watching"
        db.session.commit()
        flash(f"{anime_title} has been added back to your watching list!", category='success')
        return redirect(url_for('views.watchlist', status='Watching'))

    # Create new anime entry for user and add to list
    new_anime = Anime(
        id=anime_id,
        title=anime_title,
        status='Watching',
        main_picture = anime_picture,
        synopsis = anime_synopsis,
        episodes = anime_episodes,
        genres = anime_genres,
        user_id=current_user.id
    )

    # Save the new anime to the database
    db.session.add(new_anime)
    db.session.commit()
    flash(f"{anime_title} added to your list", category='success')
    return redirect(url_for('views.watchlist', status='Watching'))



# Change status of anime
@anime.route('/change_status', methods=['POST'])
@login_required
def change_status():
    from models import User, Anime, db

    # Basic anime details and status
    anime_id = request.form.get('anime_id')
    anime_title = request.form.get('anime_title')
    anime_picture = request.form.get('anime_main_picture')
    anime_synopsis = request.form.get('anime_synopsis')
    anime_episodes = request.form.get('anime_episodes')
    anime_genres = request.form.get('anime_genres')
    new_status = request.form.get('new_status')

    # Debugging: Print form data to see if they are correctly populated
    print(f"anime_id: {anime_id}")
    print(f"anime_title: {anime_title}")


    # Check if the status is valid
    if new_status not in ['Watching', 'Dropped', 'Completed', 'On-Hold', 'Plan-to-Watch']:
        flash('Invalid status', category = 'error')
        return redirect(url_for('views.watchlist', status = new_status))

    # Check if the anime is in the list
    if not anime_id or not anime_title or not new_status:
          flash('Invalid anime data', category = 'error')
          return redirect(url_for('views.watchlist', status = new_status))
    
    # Query the anime to update in SQL database
    anime_to_update = Anime.query.filter_by(id = anime_id,
                                        user_id=current_user.id).first()
                                        
      # Create new anime entry for user and add to list
    new_anime = Anime(
        id=anime_id,
        title=anime_title,
        status=new_status,
        main_picture = anime_picture,
        synopsis = anime_synopsis,
        episodes = anime_episodes,
        genres = anime_genres,
        user_id=current_user.id
    )
    
    # Update status

    if anime_to_update:
        if anime_to_update.status != new_status:
            anime_to_update.status = new_status
            db.session.add(anime_to_update)
            db.session.commit()
            print(f"anime_to_update: {anime_to_update}")

            flash(f"{anime_title} has been updated", category = 'success')
            print(f"new_status is: {new_status}")
            print({anime_to_update.status})
            return redirect(url_for('views.watchlist', status = new_status))
        
    elif not anime_to_update:
        print(f" new anime_to_update: {anime_to_update}")
        db.session.add(new_anime)
        db.session.commit()
          
    else:
          flash('No update', category = 'error')



    return redirect(url_for('views.watchlist', status = new_status))
    

