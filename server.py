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



@app.route('/login', methods=["GET", "POST"])
def process_login():
	"""Show users ability to sign up or login"""

	email = request.form.get('email');
	password = request.form.get('password');

	if email:
		print email, password

	return render_template("login.html")

@app.route('/')
def callback():
	"""test for working on callbacks"""
	return render_template('callbackPractice.html')

@app.route('/testing')
def tests():
	"""This route is used for testing"""

	return render_template("testing.html")



if __name__ == "__main__":
    app.run(debug=True)