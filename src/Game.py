import json

class BingoCheck():
    name = ''
    obj_type = 0
    img_path = ''
    enabled = False

    def __init__(self, name: str, obj_type: int):
        self.name = name
        self.obj_type = obj_type
        
class BingoGame():
    name = ''
    checks_list = []
    show_checks = False

    def __init__(self, json_data: str):
        self.checks_list = []

        data = json.loads(json_data)
        self.name = data["game"]
        checks = data["checks"]
        for check in checks:
            new_check = BingoCheck(check["name"], check["obj_type"])
            if "img_path" in check:
                new_check.img_path = check["img_path"]
            
            self.checks_list.append(new_check)