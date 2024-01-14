from flask import Flask, request, render_template
import json

from src.Bingo import games, GenerateBoard

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('App.html', games = games, generated = '', last_setting = '')

@app.route('/generate_bingosync', methods=['POST'])
def generate_bingosync():
    data_string = request.form.get('checksJSON')
    data = json.loads(data_string)
    include_game_names = request.form.get('includeGameName')
    game_data = data['games']
    print(game_data)

    board = GenerateBoard(game_data, 25, include_game_names)
    return render_template('App.html', games = games, generated = board, last_setting = data_string)

if __name__ == '__main__':
    app.run()