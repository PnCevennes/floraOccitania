# coding: utf8
from flask import Flask, request, current_app
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from pypnusershub.auth import auth_manager

import datetime

from app.database import db

db = db

app_globals = {}

# import logging
# logging.basicConfig()
# logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)
providers_config = [
    # Default identity provider (comes with UH-AM)
    {
        "module": "pypnusershub.auth.providers.default.LocalProvider",
        "id_provider": "local_provider",
    },
    # you can add other identity providers that works with OpenID protocol (and many others !)
]

def init_app():
    if app_globals.get('app', False):
        app = app_globals['app']
    else:
        app = Flask(__name__)

    auth_manager.init_app(app, providers_declaration=providers_config)

    with app.app_context():
        app.config.from_pyfile('config.py')
        db.init_app(app)
        db.app = app
        app.config['DB'] = db

        from pypnnomenclature.routes import routes
        app.register_blueprint(routes, url_prefix="/nomenclatures")

        from app.routes import adresses
        app.register_blueprint(adresses, url_prefix='')

    return app


app = init_app()
CORS(app, supports_credentials=True)
if __name__ == '__main__':
    app.run(port=1234)
