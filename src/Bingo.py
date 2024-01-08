import os
import io
import random

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

def GenerateBoard(data: list, target: int, balancing = True) -> str:
    generating = True
    board = []
    used_objectives = []
    
    for game in data:
        random.shuffle(game['checks'])

    while (generating):
        if balancing:
            for game in data:
                if len(board) < target:
                    if game['checks']:
                        next_check = game['checks'].pop()
                        obj_string = '{game_name}:{obj_id}'.format(game_name = game['game'], obj_id = str(next_check['obj_type']))
                        if obj_string not in used_objectives:
                            used_objectives.append(obj_string)
                            new_check = {}
                            new_check["name"] = next_check["name"]
                            board.append(new_check)
        else:
            pass # todo: make one new big list from which to generate

        if len(board) >= target:
            generating = False

    random.shuffle(board)
    return json.dumps(board)

    