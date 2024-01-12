import os
import random
import json

games = []

game_files = os.listdir('games')
for file in game_files:
    if '.json' in file:
        f = open(f'games/{file}')
        contents = json.load(f)
        f.close()

        game_name = contents['game']
        checks_count = len(contents['checks'])
        print(f'Data found for "{game_name}" - {checks_count} checks')
        games.append(contents)

def GetNextCheck(game_json: dict) -> dict | None:
    next_json = game_json['checks'].pop()
    selected_game = game_json['game']

    if selected_game in games:
        for check in games[selected_game]['checks']:
            if check['name'] == next_json:
                return check
            
def CheckObjectiveUsed(game_name: str, check: dict, collection: list) -> bool:
    obj_type_str = str(check['obj_type'])
    obj_string = f'{game_name}:{obj_type_str}'
    if obj_string in collection:
        return True
    else:
        collection.append(obj_string)
        return False

def CheckSharedObjectiveUsed(game_name: str, check: dict, collection: list) -> bool:
    if CheckObjectiveUsed(game_name, check, collection):
        return True
    
    if 'shared' in check:
        for shared_game in check['shared']:
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
                        game_name = game['game']
                        next_check = GetNextCheck(game)
                        if next_check != None:
                            if not CheckSharedObjectiveUsed(game_name, next_check, used_objectives):
                                new_check = {}
                                name = next_check['name']
                                
                                if include_game_name:
                                    name = f'[{game_name}] {name}'
                                    
                                new_check['name'] = name
                                board.append(new_check)
        else:
            pass # todo: make one new big list from which to generate

        if len(board) >= target:
            generating = False

    random.shuffle(board)
    return json.dumps(board)

    