from flask import Flask, request, render_template

from Bingo import games

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('App.html', games = games)

if __name__ == '__main__':
    app.run()