import random
import model
import os
from flask import Flask, request, render_template, jsonify, session, flash
from selenium import webdriver


app = Flask(__name__)




@app.route('/map')
def index():
    """Show our index page."""
    return render_template("map.html")



@app.route('/login')
def process_login():
	"""Show users ability to sign up or login"""

	email = request.form.get('email');
	password = request.form.get('password');

	return render_template("login.html")

@app.route('/')
def callback():
	"""test for working on callbacks"""
	return render_template('callbackPractice.html')



if __name__ == "__main__":
    app.run(debug=True)