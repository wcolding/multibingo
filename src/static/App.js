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