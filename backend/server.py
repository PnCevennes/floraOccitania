# coding: utf8
from flask import Flask, request, current_app
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

import datetime

from app.database import db

db = db

app_globals = {}

# import logging
# logging.basicConfig()
# logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

def init_app():
    if app_globals.get('app', False):
        app = app_globals['app']
    else:
        app = Flask(__name__)


    with app.app_context():
        app.config.from_pyfile('config.py')
        db.init_app(app)
        db.app = app
        app.config['DB'] = db

        from pypnnomenclature.routes import routes
        app.register_blueprint(routes, url_prefix="/api/nomenclatures")

        from app.routes import adresses
        app.register_blueprint(adresses, url_prefix='/api')

    return app


app = init_app()
CORS(app, supports_credentials=True)
if __name__ == '__main__':
    app.run()