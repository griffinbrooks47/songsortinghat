from requests import post, get
import json
import os
import base64
from flask import Flask, request
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

def get_token(client_id, client_secret):

    auth_string = client_id + ":" + client_secret
    auth_bytes = auth_string.encode("utf-8")
    authbase64 = str(base64.b64encode(auth_bytes), "utf-8")

    url = "https://accounts.spotify.com/api/token"

    headers = {
        'Authorization': 'Basic ' + authbase64,
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    data = {
        'grant_type': 'client_credentials'
    }

    result = post(url, headers=headers, data=data)
    json_result = json.loads(result.content)
    token = json_result["access_token"]

    return token

def get_auth_headers(token):
    return {'Authorization': 'Bearer ' + token}

def search_for_artist(token, artist_name):

    url = "https://api.spotify.com/v1/search"
    headers = get_auth_headers(token)
    query = f'?q={artist_name}&type=artist&limit=1'
    query_url = url + query

    result = get(query_url, headers=headers)
    json_result = json.loads(result.content)['artists']['items']

    if len(json_result) == 0:
        return None
    return json_result
    return json_result[0]['id']

def get_albums_by_artist_name(token, artist_id):

    #url = f"https://api.spotify.com/v1/artists/{artist_id}/top-tracks?country=US"
    url_albums = f'https://api.spotify.com/v1/artists/{artist_id}/albums'

    headers = get_auth_headers(token)
    result = get(url_albums, headers=headers)
    json_result = json.loads(result.content)

    album_ids = [album['id'] for album in json_result['items']]
    id_string = ','.join(album_ids)

    url_tracks = f'https://api.spotify.com/v1/albums?ids={id_string}'
    track_data = get(url_tracks, headers=headers)
    tracks = json.loads(track_data.content)
    return tracks

def parse_json(data):

    albums = []
    singles = []
    for album in data['albums']:

        name = album['name']
        album_type = album['album_type']
        cover = album['images'][0]['url']
        
        if album_type == 'album':
            album_data = {
            'name':name,
            'cover':cover,
            'tracks':[]
            }   
            for track in album['tracks']['items']:
                
                track_data = {
                    'name': track['name'],
                    'artists': ''
                };

                artists_string = ''

                for artist in track['artists']:
                    artists_string += artist['name'] + ', '

                track_data['artists'] = artists_string[:-2]

                album_data['tracks'].append(track_data);
            
            albums.append(album_data)
        else:

            single_data = {
                'name':name,
                'cover': cover,
                'artists': ''
            }

            artists_string = ''

            for artist in album["artists"]:
                artists_string += artist['name'] + ', '

            single_data['artists'] = artists_string[:-2]
            singles.append(single_data)

    return {
        'albums': albums,
        'singles': singles
    }



app = Flask(__name__)

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "10 per hour"],
    storage_uri="memory://",
)

CORS(app)

@app.route('/')
def index():
    return 'DiscogRankerBackend'

@app.route('/search', methods = ['GET', 'POST'])
@limiter.limit("10000 per day")
def generate_json():
    client_id = 'ac76abd6e9a24fe4b125eefafff0561f'
    client_secret = '51a002435a0a4356b7b0014a02feee0f'
    artist = request.args.get('artist')
    token = get_token(client_id, client_secret)
    artist_info = search_for_artist(token, artist)
    artist_id = artist_info[0]['id']
    albums = get_albums_by_artist_name(token, artist_id)
    artist_data = parse_json(albums)
    artist_data['artist'] = artist_info
    return artist_data

if __name__ == '__main__':
    app.run(debug=True)