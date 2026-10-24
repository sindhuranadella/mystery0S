"""
MysteryOS Application Factory (Flask)
"""
import os
from flask import Flask, jsonify
from flask_cors import CORS
from .models import db

def create_app(test_config=None):
    app = Flask(__name__)
    CORS(app)

    db_url = os.getenv('DATABASE_URL', 'sqlite:///mysteryos.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'mysteryos_secret_key_change_in_prod')

    if test_config:
        app.config.update(test_config)

    db.init_app(app)

    with app.app_context():
        db.create_all()

    @app.route('/health')
    def health():
        return jsonify({"status": "healthy", "service": "MysteryOS Flask Engine"})

    return app
