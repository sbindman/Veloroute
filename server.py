import random

from flask import Flask, request, render_template, jsonify
from selenium import webdriver

app = Flask(__name__)


browser = webdriver.Firefox()
browser.get('http://localhost:500/map')



@app.route('/map')
def index():
    """Show our index page."""
    # if request.args.get("routeName"):
    # 	route_name = request.args.get("routeName")
    # else:
    # 	route_name = "route"
    return render_template("map.html") #, routename=route_name)

@app.route('/')
def callback():
	"""test for working on callbacks"""
	return render_template('callbackPractice.html')



if __name__ == "__main__":
    app.run(debug=True)