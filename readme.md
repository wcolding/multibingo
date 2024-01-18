# Multibingo
### A multi-game bingo generator/check randomizer

This app generates [speedrun bingo boards](https://speedruntools.com/bingo/) that are compatible with [Bingosync](https://bingosync.com/).

Features include:
* Cross-game generation
* Individual check selection per game
* Exclusive checks system to avoid similar/related checks appearing in the same board (e.g. Bulbasaur and Ivysaur)
* Optional game balancing
* Presets
* Local board for solo play

## How do I use it?
Go to [this website](https://multibingo.onrender.com/), select your checks/games and click the `Generate` button. To play locally, check the `Show Output` option and an interactive board will appear on the page. To play on Bingosync, press the `Copy to Clipboard` button, navigate to Bingosync, and in the `New Room` dialog set the game to `Custom (Advanced)` and paste into the `Board` field.

## Contributing
This app runs on Flask, which requires Python 3.8+. It's recommended you set up a virtual environment before running `pip install -r requirements.txt`. To host the app locally you can then run `flask --app app.py run --debug` and navigate your browser to `localhost:5000` to test your changes.

### Adding games
Games are in JSON format and consist of the following fields: \
`game` - a string name to display in the app \
`checks` - a list of check objects

The check objects in turn consist of the following fields: \
`name` - a string \
`obj_type` - a numerical id \
*(optional)* `shared` - a list of game names with which this check is shared

Checks containing the same `obj_type` are considered exclusive from one another at generation; only one of any `obj_type` within a game can appear in a generated board.

Normally, games keep independent ids for their `obj_type`, but the optional `shared` field allows the generator to link an `obj_type` across games. As an example, take this snippet from the Pokemon (Gen I) file:
```json
    {
        "name": "Lapras",
        "obj_type": 1065
    },
    {
        "name": "Ditto",
        "obj_type": 1066
    },
    {
        "name": "Eevee",
        "obj_type": 1067
    },
    {
        "name": "Vaporeon",
        "obj_type": 1067
    },
    {
        "name": "Jolteon",
        "obj_type": 1067
    },
``` 
...and this snippet from the Gen II file:
```json
    {
        "name": "Quagsire",
        "obj_type": 2018
    },
    {
        "name": "Espeon",
        "obj_type": 1067,
        "shared": [
            "Pokemon (Gen I)"
        ]
    },
    {
        "name": "Umbreon",
        "obj_type": 1067,
        "shared": [
            "Pokemon (Gen I)"
        ]
    },
```
With these two separate files the generator can pick Eevee or one of its evolutions but not the others. Only one of the files needs to reference the connection; in the case of Pokemon the convention is for later generations to be responsible for any shared fields.

#### AutoType.py
As a time-saver, `AutoType.py` can be used to create these JSON files from `.txt` files without needing to manually enumerate the ids. Every line in the txt file is treated as a new `obj_type`. Multiple checks can be written per line, separated by a `|` symbol. Placing a `#` anywhere in the line will create an empty `shared` field for the checks on that line. Please note you'll have to manually edit the result.

Example file:
```
Bulbasaur|Ivysaur|Venusaur
Charmander|Charmeleon|Charizard
Squirtle|Wartortle|Blastoise
```
The result would group these three evolutionary lines correctly. For more information, run `AutoType.py` with the `-h` argument.

### Adding Presets
Presets are JSON files with a name, description, and a list of games and check names within. They can be generated on the app itself by clicking the `Copy selected as Preset` button. Then you can paste the result into a file, edit the name/description and place them in the `games/presets` directory. Like the games, these are processed alphabetically by file name.