from flask import Flask, request, render_template
import json

from Bingo import games, GenerateBoard

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('App.html', games = games, generated = '')

@app.route('/generate_bingosync', methods=['POST'])
def generate_bingosync():
    data = json.loads(request.form.get('checksJSON'))
    game_data = data['game_check_data']

    board = GenerateBoard(game_data, 25)
    return render_template('App.html', games = games, generated = board)

if __name__ == '__main__':
    app.run()