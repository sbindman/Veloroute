import random
import os
from flask import Flask, request, render_template, jsonify


app = Flask(__name__)


@app.route('/')
def index():
    """Show map page."""
    return render_template("map.html")


PORT=int(os.environ.get("PORT",5000))


if __name__ == "__main__":
    app.run( debug=False, host="0.0.0.0" ,port=PORT)