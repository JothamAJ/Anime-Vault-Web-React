from flask import Flask
from views import views
from auth import auth 
from anime_search import anime
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from os import path
from flask_session import Session
import os
from flask_cors import CORS #enable CORS to allow flask and react to run

# from flask_wtf.csrf import CSRFProtect



# from models import User


#Create flask application

#database 
db = SQLAlchemy()
DB_NAME = "databse.db"


def create_app():
    template_folder=os.path.abspath("/Users/jotham/Documents/Anime_Vault/Anime Vault Web React/frontend/templates")  #Tell Flask where templates are
    static_folder = os.path.abspath("/Users/jotham/Documents/Anime_Vault/Anime Vault Web React/static")
    app = Flask(__name__, template_folder=template_folder, static_folder= static_folder)
    CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:3000"}}) #global CORS
    
    # Server side sessions because flash messages were not working
    app.config['SESSION_TYPE'] = 'filesystem'  # Stores session files on the server
    app.config['SESSION_PERMANENT'] = False    # Sessions expire when the browser is closed
    app.config['SESSaION_FILE_DIR'] = 'flask_sessions'  # Directory to store session files
    Session(app)



    app.config['SECRET_KEY'] = "helloworld" #configure secret key to hash data
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}' #configure database
    # csrf = CSRFProtect(app)
    # csrf.init_app(app)
    db.init_app(app)


    app.register_blueprint(views, url_prefix = "/") #register blueprint and prefix
    app.register_blueprint(auth, url_prefix = "/") #register blueprint and prefix
    app.register_blueprint(anime, url_prefix = "/")


    #create database
    # from models import User
    # from backend.models import User
    from models import User
    create_database(app)

    #Login Manager setup
    login_manager = LoginManager()
    login_manager.login_view = "auth.login" #redirect to login view if not logged in
    login_manager.init_app(app)


    #find user model by user unique id
    @login_manager.user_loader
    def load_user(id):
        # from models import User
        return User.query.get(int(id))
    



    return app



#check if db already exists if not create db
def create_database(app):
    if not path.exists('website/' + DB_NAME):
        with app.app_context():
            db.create_all()
        print('Created Database!')