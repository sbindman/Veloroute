import random

from flask import Flask, request, render_template, jsonify

app = Flask(__name__)



@app.route('/map')
def index():
    """Show our index page."""
    return render_template("map.html")

@app.route('/')
def callback():
	"""test for working on callbacks"""
	return render_template('callbackPractice.html')



if __name__ == "__main__":
    app.run(debug=True)