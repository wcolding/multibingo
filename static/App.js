let selectCounter = 0;
let objectivesList = [];
let randoCount = 25;
let selectedChecks = [];

function init() {
    let lastSetting = document.getElementById("lastSetting").innerText;
    if (lastSetting != "") {
        loadSetting(lastSetting);
    }
}

function loadSetting(settingString) {
    let settings = JSON.parse(settingString);
    let string = "";

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

function setAllGameChecks(game) {
    let gameCheckBox = document.getElementById(game + "_allSelect");
    let checksSection = document.getElementById(game + "_checks");

    let checks = checksSection.getElementsByTagName("input");
    for (let i = 0; i < checks.length; i++) {
        checks[i].checked = gameCheckBox.checked;
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

function tallyChecks() {
    selectCounter = 0;
    objectivesList = [];
    selectedChecks = [];
    let checkElements = document.getElementsByClassName("checkElement");
    for (let i = 0; i < checkElements.length; i++) {
        let check = checkElements[i].getElementsByTagName("input")[0];
        if (check.checked) {
            let checkGame = check.parentElement.getElementsByClassName("checkGame")[0].innerHTML;
            let checkName = check.parentElement.getElementsByTagName("label")[0].innerHTML;
            let checkObjType = check.parentElement.getElementsByClassName("checkObjType")[0].innerHTML;

            // Check game's box
            let gameCheckBox = getGameSelectByName(checkGame).getElementsByTagName("input")[0];
            gameCheckBox.checked = true;

            const checksIterator = selectedChecks.values();
            let gameExists = false;

            for (const checkVal of checksIterator) {
                if (checkVal.game == checkGame){
                    gameExists = true;
                    checkVal.checks.push(checkName);
                    break;
                }
            }

            if (!gameExists) {
                selectedChecks.push({ game: checkGame, checks: [checkName] });
            }

            let newObjType = `${checkGame}:${checkObjType}`;
            if (!objectivesList.includes(newObjType)) {
                objectivesList.push(newObjType);
            }

            selectCounter++;
        }
    }

    let jsonDataHolder = document.getElementById("checksJSONData");
    jsonDataHolder.value = JSON.stringify({game_check_data: selectedChecks});
    updateCounterDisplay();
}

function updateCounterDisplay() {
    let checksCounter = document.getElementsByClassName("checksCounter")[0];
    let objsCounter = document.getElementsByClassName("objsCounter")[0];
    checksCounter.innerHTML = `Checks: ${selectCounter}`;
    objsCounter.innerHTML = `Objectives: ${objectivesList.length}`;
    setColor(checksCounter, selectCounter, randoCount);
    let enoughObjectives = setColor(objsCounter, objectivesList.length, randoCount);
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