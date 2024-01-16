import os
import io
import argparse
import json

def AutoType(file_name: str, starting_val, replacements = None):
    game_defs = os.listdir('../games')
    counter = 0
    if starting_val:
        counter = starting_val
    if file_name in game_defs:
        try:
            f = open(f'../games/{file_name}')
            data = json.load(f)
            f.close()

            if 'checks' in data:
                for check in data['checks']:
                    if 'obj_type' not in check:
                        check['obj_type'] = counter
                        counter += 1
                    else:
                        if check['obj_type'] in replacements:
                            check['obj_type'] = counter
                            counter += 1
                
                f = io.open(f'../games/{file_name}', 'w')
                f.write(json.dumps(data, indent=4))
                f.close()
                print(f'Wrote {str(counter - starting_val)} ids to {file_name}')
            else:
                print(f'Could not get data from "{file_name}"!')
            
        except:
            print(f'Unable to open "{file_name}"')
    else:
        print('Specified game file not found!')

def BuildGame(text_file: str, game_name: str, starting_val):
    f = io.open(text_file, 'r')
    lines = f.readlines()
    f.close()

    out_name = os.path.splitext(text_file)[0]
    out_path = f'../games/{out_name}.json'

    data = {}
    data['game'] = game_name
    checks = []
    obj_counter = 0
    if starting_val:
        obj_counter = starting_val

    for line in lines:
        skip_counter = False
        if '#' in line:
            line = line.replace('#','')
            skip_counter = True
        entries = line.replace('\n','').split('|')
        for entry in entries:
            new_check = {}
            new_check['name'] = entry
            if skip_counter:
                new_check['obj_type'] = -1
                new_check['shared'] = []
            else:
                new_check['obj_type'] = obj_counter
            checks.append(new_check)
        if not skip_counter:
            obj_counter += 1

    data['checks'] = checks

    data_string = json.dumps(data, indent=4)

    file = io.open(out_path, 'w')
    file.write(data_string)
    file.close()

parser = argparse.ArgumentParser(description='Automatically assign obj_type ids for a game')
parser.add_argument('-m', '--modify', dest='modify', metavar='file_name', help='Modify an existing game')
parser.add_argument('-c', '--create', dest='create', nargs=2, metavar=('file_name', 'display_name'), help='Create a new game from a txt file')
parser.add_argument('-r', '--replacements', dest='replacements', type=int, nargs='+', metavar=('ids'),help='List of obj_type ids to replace')
parser.add_argument('-s', '--start-value', dest='start_val', type=int, default=0, metavar=('value'), help='Starting value for new obj_type ids')
args = parser.parse_args()

if args.modify:
    AutoType(args.modify, args.start_val, args.replacements)
elif args.create:
    BuildGame(args.create[0], args.create[1], args.start_val)
else:
    parser.print_help()