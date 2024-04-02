function logout() {
    window.location.href = '/';
}

function playGame() {
    window.location.href = '/game/'
}

function changeColor() {
    let button = document.getElementById("sets");
    button.classList.add("limegreen");
    button.disabled = 'true';
}

