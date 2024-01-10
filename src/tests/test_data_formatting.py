import unittest
import os
import io
import json

class TestDataFormatting(unittest.TestCase):
    game_dirs = []

    @classmethod
    def setUpClass(cls):
        cls.game_dirs = os.listdir('Games')

    def test_a_json_named_correctly(self):
        for game in self.game_dirs:
            subdir = 'Games/{folder}'.format(folder=game)
            game_files = os.listdir(subdir)
            self.assertIn('data.json', game_files)
    
    def test_b_json_format(self):
        for game in self.game_dirs:
            subdir = 'Games/{folder}'.format(folder=game)
            file_path = '{_subdir}/data.json'.format(_subdir = subdir)

            file = io.open(file_path, 'r')
            json_string = file.read()
            file.close()

            game_dict = json.loads(json_string)
            self.assertIn('game', game_dict)
            self.assertIn('checks', game_dict)

    def test_c_checks_format(self):
        for game in self.game_dirs:
            subdir = 'Games/{folder}'.format(folder=game)
            file_path = '{_subdir}/data.json'.format(_subdir = subdir)

            file = io.open(file_path, 'r')
            json_string = file.read()
            file.close()

            game_dict = json.loads(json_string)
            checks = game_dict['checks']
            self.assertGreater(len(checks), 0)

            for check in checks:
                self.assertIn('name', check)
                self.assertIn('obj_type', check)

                self.assertEqual(check['name'], str(check['name']))
                self.assertEqual(check['obj_type'], int(check['obj_type']))

    def test_d_enforce_unique_check_names(self):
        for game in self.game_dirs:
            subdir = 'Games/{folder}'.format(folder=game)
            file_path = '{_subdir}/data.json'.format(_subdir = subdir)

            file = io.open(file_path, 'r')
            json_string = file.read()
            file.close()

            game_dict = json.loads(json_string)
            checks = game_dict['checks']
            game_check_names = []

            for check in checks:
                self.assertNotIn(check['name'], game_check_names)
                game_check_names.append(check['name'])