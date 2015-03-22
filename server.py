import random
import os
from flask import Flask, request, render_template, jsonify


app = Flask(__name__)


@app.route('/')
def index():
    """Show map page."""
    return render_template("map.html")


if __name__ == "__main__":
    app.run( debug=True)