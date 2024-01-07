import os
import io

from Game import *

games = []

game_dirs = os.listdir('../games')
for game in game_dirs:
    subdir = '../games/{folder}'.format(folder=game)
    game_files = os.listdir(subdir)
    if 'data.json' in game_files:
        file_path = '{_subdir}/data.json'.format(_subdir = subdir)
        file = io.open(file_path, 'r')
        new_game = BingoGame(file.read())
        file.close()
        games.append(new_game)

for game in games:
    print(f'{game.name} - {str(len(game.checks_list))} checks found:')
    for check in game.checks_list:
        print(f'{game.name}: {check.name}')