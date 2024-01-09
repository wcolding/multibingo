import os
import io
import argparse
import json

def AutoType(game_name: str, starting_val, replacements = None):
    game_dirs = os.listdir('../games')
    counter = 0
    if starting_val:
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

def BuildGame(game_name: str, text_file: str):
    file = io.open(text_file, 'r')
    lines = file.readlines()
    file.close()

    out_dir = text_file[:-4]

    data = {}
    data['game'] = game_name
    checks = []
    obj_counter = 0

    for line in lines:
        entries = line.replace('\n','').split('|')
        for entry in entries:
            new_check = {}
            new_check['name'] = entry
            new_check['obj_type'] = obj_counter
            checks.append(new_check)
        obj_counter += 1

    data['checks'] = checks

    data_string = json.dumps(data, indent=4)
    os.chdir('../games')
    os.mkdir(out_dir)

    file = io.open(out_dir + '/data.json', 'w')
    file.write(data_string)
    file.close()

parser = argparse.ArgumentParser(description='Automatically assign obj_type ids for a game')
parser.add_argument('-m', '--modify', dest='modify', metavar='folder_name', help='Modify an existing game')
parser.add_argument('-c', '--create', dest='create', nargs=2, metavar=('file_name', 'display_name'), help='Create a new game from a txt file')
parser.add_argument('-r', '--replacements', dest='replacements', type=int, nargs='+', metavar=('ids'),help='List of obj_type ids to replace')
parser.add_argument('-s', '--start-value', dest='start_val', type=int, default=0, metavar=('value'), help='Starting value for new obj_type ids')
args = parser.parse_args()

if args.modify:
    AutoType(args.modify, args.start_val, args.replacements)
elif args.create:
    BuildGame(args.create[0], args.create[1])
else:
    parser.print_help()