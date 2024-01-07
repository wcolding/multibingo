function showGameChecks(game) {
    let checks = document.getElementById(game + "_checks");
    let button = document.getElementById(game + "_expandButton");

    if (button.textContent == "+"){
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
    for (let i = 0; i< checks.length; i++) {
        checks[i].checked = gameCheckBox.checked;
    }
}