from ..Game import *

my_json = '''{ 
    "game": "Test Game", 
    "checks": [
        {
            "name": "First check",
            "obj_type": 1
        },
        {
            "name": "Second check",
            "obj_type": 2
        },
        {
            "name": "Alternate second check",
            "obj_type": 2
        },
        {
            "name": "Third check",
            "obj_type": 3,
            "img_path": "some_image.png"
        }
    ]
}'''

def test_load_game_name():
    game = BingoGame(my_json)
    assert game.name == 'Test Game'
    
def test_load_game_checks():
    game = BingoGame(my_json)
    assert len(game.checks_list) == 4

def test_check_with_img():
    game = BingoGame(my_json)
    assert game.checks_list[3].img_path == 'some_image.png'

def test_obj_types():
    game = BingoGame(my_json)
    count = 0
    for check in game.checks_list:
        if check.obj_type == 2:
            count += 1
    assert count == 2