import requests
import json

def queryWeather(lat, lon):
    params = {'lat': lat, 'lon' : lon, 'units' : "metric", 'appid' : "999be0e937d3d974671a8ee06b53af63"}
    response = requests.get("http://api.openweathermap.org/data/2.5/forecast", params = params)
    print(response.json())
    return json.dumps(response.json())
