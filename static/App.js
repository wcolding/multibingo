let selectCounter = 0;
let objectivesCounter = 0;
let objectivesList = [];
let randoCount = 25;
let selectedChecks = {};

function init() {
    // Load settings
    if (lastSettingObj.length > 0) {
        
    } else {
        // Default all off
        gamesObj.forEach((entry) => {
            entry.checks.forEach((check) => {
                check.enabled = false;
            });
        });
    }
}

function loadSettings() {
    let settings = JSON.parse(settingString);

    settings.game_check_data.forEach((entry) => {

        entry.checks.forEach((check) => {
            let checkElement = getCheckElement(check, entry.game);
            let box = checkElement.getElementsByTagName("input")[0];
            box.checked = true;
        });
    });

    tallyChecks();
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

function tallyChecks() {
    selectCounter = 0;
    objectivesCounter = 0
    objectivesList = [];
    selectedChecks = {};
    selectedChecks.game_check_data = []

    gamesObj.forEach((entry) => {
        entry.checks.forEach((check) => {
            if (check.enabled) {
                selectCounter++;

                // Add check to selectedChecks
                // if (selectedChecks.game_check_data[entry.game] == null) {
                //     selectedChecks.game_check_data.a
                // }

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
                    console.log(`Check "${check.name}" has a shared obj_type`);
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
    });


    // let checkElements = document.getElementsByClassName("checkElement");
    // for (let i = 0; i < checkElements.length; i++) {
    //     let check = checkElements[i].getElementsByTagName("input")[0];
    //     if (check.checked) {
    //         let checkGame = check.parentElement.getElementsByClassName("checkGame")[0].innerHTML;
    //         let checkName = check.parentElement.getElementsByTagName("label")[0].innerHTML;
    //         let checkObjType = check.parentElement.getElementsByClassName("checkObjType")[0].innerHTML;

    //         // // Check game's box
    //         // let gameCheckBox = getGameSelectByName(checkGame).getElementsByTagName("input")[0];
    //         // gameCheckBox.checked = true;

    //         const checksIterator = selectedChecks.values();
    //         let gameExists = false;

    //         for (const checkVal of checksIterator) {
    //             if (checkVal.game == checkGame){
    //                 gameExists = true;
    //                 checkVal.checks.push(checkName);
    //                 break;
    //             }
    //         }

    //         if (!gameExists) {
    //             selectedChecks.push({ game: checkGame, checks: [checkName] });
    //         }

    //         let newObjType = `${checkGame}:${checkObjType}`;
    //         if (!objectivesList.includes(newObjType)) {
    //             objectivesList.push(newObjType);
    //         }

    //         //selectCounter++;
    //     }
    // }

    // let jsonDataHolder = document.getElementById("checksJSONData");
    // jsonDataHolder.value = JSON.stringify({game_check_data: selectedChecks});
    updateCounterDisplay();
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
    objsCounter.innerHTML = `Objectives: ${objectivesCounter}`;
    setColor(checksCounter, selectCounter, randoCount);
    let enoughObjectives = setColor(objsCounter, objectivesCounter, randoCount);
    let generateButton = document.getElementById("generateButton");
    generateButton.disabled = !enoughObjectives;
}

function setColor(object, counter, required) {
    if (counter < required) {
        object.style.color = "red";
        return false;
    } else {
        object.style.color = "green";
        return true;
    }
}

function copyBoard() {
    generatedDiv = document.getElementById("generatedBoard");
    navigator.clipboard.writeText(generatedDiv.innerText);
}