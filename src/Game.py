import json

class BingoCheck():
    name = ''
    obj_type = 0
    img_path = ''
    shared = []
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
            if "shared" in check:
                new_check.shared = check["shared"]
            
            self.checks_list.append(new_check)

    def get_obj_type_count(self) -> int:
        ids = []

        for check in self.checks_list:
            if check.obj_type not in ids:
                ids.append(check.obj_type)
        
        return len(ids)
