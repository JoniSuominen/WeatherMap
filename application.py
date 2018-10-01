from flask import Flask, render_template, request, jsonify
from flask_cors import CORS, cross_origin
from query import queryWeather
import os

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  return response

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/weather")
def weather():
    if request.method == 'GET':
        print(request.args.get("lat"))
        lat = request.args.get("lat")
        lon = request.args.get("lon")
        data = queryWeather(lat, lon)
        return data



if __name__ == "__main__":
    app.run()
