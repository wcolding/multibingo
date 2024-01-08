let selectCounter = 0;
let objectivesList = [];
let randoCount = 25;

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

function tallyChecks() {
    selectCounter = 0;
    objectivesList = [];
    let checkElements = document.getElementsByClassName("checkElement");
    for (let i = 0; i < checkElements.length; i++) {
        let check = checkElements[i].getElementsByTagName("input")[0];
        if (check.checked) {
            let checkGame = check.parentElement.getElementsByClassName("checkGame")[0].innerHTML;
            let checkObjType = check.parentElement.getElementsByClassName("checkObjType")[0].innerHTML;
            let newObjType = `${checkGame}:${checkObjType}`;
            if (!objectivesList.includes(newObjType)) {
                objectivesList.push(newObjType);
            }
            selectCounter++;
        }
    }

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