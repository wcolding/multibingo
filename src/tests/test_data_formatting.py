import unittest
import os
import json

class TestDataFormatting(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        game_defs = os.listdir('games')
        self.game_data = []
        for file in game_defs:
            if os.path.splitext(file)[1] == '.json':
                f = open(f'games/{file}')
                game_dict = json.load(f)
                f.close()
                self.game_data.append(game_dict)
    
    def test_a_json_format(self):
        for game in self.game_data:
            self.assertIn('game', game)
            self.assertIn('checks', game)

    def test_b_checks_format(self):
        for game in self.game_data:
            checks = game['checks']
            self.assertGreater(len(checks), 0)

            for check in checks:
                self.assertIn('name', check)
                self.assertIn('obj_type', check)

                self.assertEqual(check['name'], str(check['name']))
                self.assertEqual(check['obj_type'], int(check['obj_type']))

    def test_c_enforce_unique_check_names(self):
        for game in self.game_data:
            checks = game['checks']
            game_check_names = []

            for check in checks:
                self.assertNotIn(check['name'], game_check_names)
                game_check_names.append(check['name'])