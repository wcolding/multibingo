from Check import BingoCheck
import json

class BingoGame():
    name = ''
    checks_list = []

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