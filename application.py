from flask import Flask, render_template, request, jsonify
from query import queryWeather

app = Flask(__name__)


@app.route("/")
def index():
    print("XD")
    return render_template("index.html")

@app.route("/weather")
def weather():
    print("LOL")
    if request.method == 'GET':
        lat = request.args.get("lat")
        lon = request.args.get("lon")
        data = queryWeather(lat, lon)
        return data

@app.route("/search")
def search():



if __name__ == "__main__":
    app.run()
