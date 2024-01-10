import os
import io
import random

from .Game import *

games = []

game_dirs = os.listdir('games')
for game in game_dirs:
    subdir = 'games/{folder}'.format(folder=game)
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

def GetNextCheck(game_json: dict) -> BingoCheck | None:
    next_json = game_json['checks'].pop()
    selected_game = None

    for game in games:
        if game.name == game_json['game']:
            selected_game = game

    if selected_game != None:
        for check in selected_game.checks_list:
            if check.name == next_json['name']:
                return check
            
def CheckObjectiveUsed(game_name: str, check: BingoCheck, collection: list) -> bool:
    obj_string = '{name}:{id}'.format(name = game_name, id = str(check.obj_type))
    if obj_string in collection:
        return True
    else:
        collection.append(obj_string)
        return False

def CheckSharedObjectiveUsed(game_name: str, check: BingoCheck, collection: list) -> bool:
    if CheckObjectiveUsed(game_name, check, collection):
        return True
    
    for shared_game in check.shared:
        if (CheckObjectiveUsed(shared_game, check, collection)):
            return True

        
    return False


def GenerateBoard(data: list, target: int, include_game_name = False, balancing = True) -> str:
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
                        next_check = GetNextCheck(game)
                        if next_check != None:
                            if not CheckSharedObjectiveUsed(game['game'], next_check, used_objectives):
                                new_check = {}
                                new_check['name'] = next_check.name
                                if include_game_name:
                                    new_check['name'] = '[{game_name}] {check_name}'.format(game_name = game['game'], check_name = new_check['name']) 
                                board.append(new_check)
        else:
            pass # todo: make one new big list from which to generate

        if len(board) >= target:
            generating = False

    random.shuffle(board)
    return json.dumps(board)

    