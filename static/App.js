let selectCounter = 0;
let objectivesCounter = 0;
let objectivesList = [];
let randoCount = 25;

let selected = {};
selected.games = [];
selected.settings = {};

function init() {
    updatePresetDesc(0);

    // Load settings
    if (lastSettingString !== "") {
        loadSettings(JSON.parse(lastSettingString));
    } else {
        // Default all off
        gamesObj.forEach((entry) => {
            entry.checks.forEach((check) => {
                check.enabled = false;
            });
        });
    }

    // Load generated
    if (generatedChecks) {
        let checkCells = document.getElementsByClassName("checkCell");
        for (let i = 0; i < 25; i++) {
            checkCells[i].innerText = generatedChecks[i].name;
            scaleTextInElement(checkCells[i]);
        }
    }

    updateCounterDisplay();
}

function clearAllChecks() {
    gamesObj.forEach((entry) => {
        let allSelect = document.getElementById(`${entry.game}_allSelect`);
        allSelect.checked = false;
        
        entry.checks.forEach((check) => {
            check.enabled = false;
            setCheckFromSettings(entry.game, check.name, false);
        });
    });
}

function updatePresetDesc(index) {
    let nameElement = document.getElementById("presetName");
    let descElement = document.getElementById("presetDesc");
    nameElement.innerText = presets[index].name;
    descElement.innerText = presets[index].desc;
}

function loadSelectedPreset() {
    let dropdown = document.getElementById("presetsDropdown");
    let selected = dropdown.options[dropdown.options.selectedIndex].innerText;
    console.log(`Loading preset: ${selected}`);

    presets.forEach((preset) => {
        if (preset.name === selected) {
            clearAllChecks();
            loadSettings(preset);
        }
    });
}

function loadSettings(settings) {
    settings.games.forEach((entry) => {
        entry.checks.forEach((check) => {
            setCheckFromSettings(entry.game, check, true);
        });
    });

    if (settings.settings) {
        let balanceGames = document.getElementById("balanceGamesBox");
        let includeGameName = document.getElementById("includeGameNameBox");
        let showOutput = document.getElementById("showOutput");

        balanceGames.checked = settings.settings.balanceGames;
        includeGameName.checked = settings.settings.includeGameName;
        showOutput.checked = settings.settings.showOutput;
        setShowTable(showOutput.checked);
    }
    tallyChecks();
}

function copySelectedAsPreset() {
    let jsonDataHolder = document.getElementById("checksJSONData");
    let presetData = JSON.parse(jsonDataHolder.value);

    let newPreset = {
        name: "",
        desc: "",
        games: presetData.games
    };

    let newPresetString = JSON.stringify(newPreset, null, 4);
    navigator.clipboard.writeText(newPresetString);
}

function showGameChecks(game) {
    let checks = document.getElementById(game + "_checks");
    let button = document.getElementById(game + "_expandButton");

    if (button.textContent == "+") {
        checks.style.display = "block";
        button.textContent = "-";
    } else {
        checks.style.display = "none";
        button.textContent = "+";
    }
}

function setAllGameChecks(gameObj, checked) {
    gamesObj.forEach((entry) => {
        if (entry.game === gameObj.game) {
            entry.checks.forEach((check) => {
                check.enabled = checked;
            })
        }
    });
    
    // Display checks
    let checksSection = document.getElementById(gameObj.game + "_checks");
    let checks = checksSection.getElementsByTagName("input");
    for (let i = 0; i < checks.length; i++) {
        checks[i].checked = checked;
    }

    tallyChecks();
}

function getGameSelectByName(name) {
    let gameSelects = document.getElementsByClassName("gameSelect");
    for (let game of gameSelects) {
        let curGameName = game.getElementsByClassName("gameName")[0].innerHTML;
        if (name == curGameName){
            return game;
        }
    };
}

function getCheckElement(checkName, gameName) {
    let checkElements = document.getElementsByClassName("checkElement");
    for (let check of checkElements) {
        let curCheckName = check.getElementsByTagName("label")[0].innerHTML;
        let curCheckGame = check.getElementsByClassName("checkGame")[0].innerHTML;

        if ((checkName == curCheckName) && (gameName == curCheckGame)) {
            return check;
        }
    }
}

function setCheck(gameObj, checkObj, checked) {
    gamesObj.forEach((entry) => {
        if (entry.game === gameObj.game) {
            entry.checks.forEach((check) => {
                if (check.name === checkObj.name) {
                    check.enabled = checked;
                    //console.log(gamesObj);
                }
            })
        }
    });

    // Check game's box
    let gameCheckBox = getGameSelectByName(gameObj.game).getElementsByTagName("input")[0];
    gameCheckBox.checked = true;

    tallyChecks();
}

function setCheckFromSettings(gameName, checkName, checked) {
    let checkElement;
    gamesObj.forEach((entry) => {
        if (entry.game === gameName) {
            entry.checks.forEach((check) => {
                if (check.name === checkName) {
                    check.enabled = checked;
                    checkElement = document.getElementById(`${gameName}_${checkName}`);
                    if (checkElement != null) {
                        checkElement.getElementsByTagName("input")[0].checked = checked;
                    }
                }
            });
        }
    });

    if (checked) {
        // Check game's box
        let gameCheckBox = getGameSelectByName(gameName).getElementsByTagName("input")[0];
        gameCheckBox.checked = true;
    }
}

function tallyChecks() {
    selectCounter = 0;
    objectivesCounter = 0;
    objectivesList = [];
    selected = {};
    selected.games = [];

    gamesObj.forEach((entry) => {
        let curGame = {
            game: entry.game,
            checks: []
        };

        entry.checks.forEach((check) => {
            if (check.enabled) {
                selectCounter++;

                // Add check to selectedChecks
                curGame.checks.push(check.name);

                // Tally objectives
                let newObjType;
                if (check.shared == null) {
                    newObjType = `${entry.game}:${check.obj_type}`;
                        if (!objectivesList.includes(newObjType)) {
                            objectivesList.push(newObjType);
                            objectivesCounter++;
                        }
                }
                else {
                    let instances = 0;
                    newObjType = `${entry.game}:${check.obj_type}`;
                        if (objectivesList.includes(newObjType)) {
                            instances++;
                        } else {
                            objectivesList.push(newObjType);
                        }

                        check.shared.forEach((shared) => {
                            newObjType = `${shared}:${check.obj_type}`;
                            if (objectivesList.includes(newObjType)) {
                                instances++;
                            } else {
                                objectivesList.push(newObjType);
                            }
                        });

                        if (instances == 0) {
                            objectivesCounter++;
                        }
                }
            }
        });

        if (curGame.checks.length > 0) {
            selected.games.push(curGame)
        }
    });

    writeSettings();
    updateCounterDisplay();
}

function writeSettings(){
    selected.settings = {};
    selected.settings.balanceGames = document.getElementById("balanceGamesBox").checked;
    selected.settings.includeGameName = document.getElementById("includeGameNameBox").checked;
    selected.settings.showOutput = document.getElementById("showOutput").checked;
    
    let jsonDataHolder = document.getElementById("checksJSONData");
    jsonDataHolder.value = JSON.stringify(selected);
}

function checkEnabled(checkElement) {
    let input = checkElement.getElementsByTagName("input")[0];
    return input.checked;
}

function updateCounterDisplay() {
    // Update individual game counts
    let gameContainers = document.getElementsByClassName("gameContainer");
    for (let i = 0; i < gameContainers.length; i++) {
        let checkCount = 0;
        let checks = gameContainers[i].getElementsByClassName("checkElement");

        for (let c = 0; c < checks.length; c++) {
            if (checkEnabled(checks[c])) {
                checkCount++;
            }
        }
        
        let checksCountDisplay = gameContainers[i].getElementsByClassName("checksCount")[0];
        checksCountDisplay.innerHTML = `(${checkCount} of ${checks.length} selected)`;
    }

    // Update totals / enable button
    let checksCounter = document.getElementsByClassName("checksCounter")[0];
    let objsCounter = document.getElementsByClassName("objsCounter")[0];
    checksCounter.innerHTML = `Checks: ${selectCounter}`;
    objsCounter.innerHTML = `Exclusive Checks: ${objectivesCounter}`;
    setColor(checksCounter, selectCounter, randoCount);
    let enoughObjectives = setColor(objsCounter, objectivesCounter, randoCount);
    let generateButton = document.getElementById("generateButton");
    generateButton.disabled = !enoughObjectives;
}

function setColor(object, counter, required) {
    if (counter < required) {
        object.style.color = "#EE5622";
        return false;
    } else {
        object.style.color = "#ECA72C";
        return true;
    }
}

function copyBoard() {
    generatedDiv = document.getElementById("generatedBoard");
    navigator.clipboard.writeText(generatedDiv.innerText);
}

function toggleBoardCheckState(cell) {
    let checked = cell.getAttribute("checked") === "true";
    checked = !checked;
    cell.setAttribute("checked", checked.toString());

    if (checked) {
        cell.style.backgroundColor = "#44355B";
    } else {
        cell.style.backgroundColor = "#221E22";
    }
}

function setShowTable(checked) {
    let table = document.getElementById("generatedTable");
    if (checked) {
        table.style.display = "block";
    } else {
        table.style.display = "none";
    }

    writeSettings();
}

function scaleTextInElement(element) {
    let textLength = element.innerText.length;
    let scaleSetting = "";
    if (textLength <= 10) {
        scaleSetting = "inherit";
    } else {
        scaleSetting = "small";
    }

    element.style.fontSize = scaleSetting;
}