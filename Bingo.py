from Game import BingoGame
import os
import io

games = []

game_dirs = os.listdir('Games')
for game in game_dirs:
    subdir = 'Games/{folder}'.format(folder=game)
    game_files = os.listdir(subdir)
    if 'data.json' in game_files:
        file_path = '{_subdir}/data.json'.format(_subdir = subdir)
        file = io.open(file_path, 'r')
        new_game = BingoGame(file.read())
        file.close()
        games.append(new_game)

for game in games:
    for check in game.checks_list:
        print(f'{game.name}: {check.name}')