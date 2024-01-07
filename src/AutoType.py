import os
import io
import argparse
import json

def AutoType(game_name: str, starting_val, replacements = None):
    game_dirs = os.listdir('../games')
    counter = starting_val
    if game_name in game_dirs:
        file_path = '../games/{game}/data.json'.format(game = game_name)
        try:
            file = io.open(file_path, 'r')
            data = json.loads(file.read())
            file.close()

            if 'checks' in data:
                for check in data['checks']:
                    if 'obj_type' not in check:
                        check['obj_type'] = counter
                        counter += 1
                    else:
                        if check['obj_type'] in replacements:
                            check['obj_type'] = counter
                            counter += 1
                
                file = io.open(file_path, 'w')
                file.write(json.dumps(data, indent=4))
                file.close()
                print(f'Wrote {str(counter - starting_val)} ids to {file_path}')
            else:
                print('data.json has no checks!')
            
        except:
            print('Unable to open "data.json"')
    else:
        print('Specified game not found!')

parser = argparse.ArgumentParser(description='Automatically assign obj_type ids for a game')
parser.add_argument('-f', dest='folder', help='Name of the folder for the game you want to modify', required=True)
parser.add_argument('-r', dest='replacements', type=int, nargs='+', help='List of obj_type ids to replace')
parser.add_argument('-s', dest='start_val', type=int, default=0, help='Starting value for new obj_type ids')
args = parser.parse_args()

AutoType(args.folder, args.start_val, args.replacements)