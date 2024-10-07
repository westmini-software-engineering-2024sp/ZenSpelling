function startGame(id) {
    id.classList.add("pop");
    playSound('start-select').play();
    setTimeout(function() {
        id.classList.remove("pop");
        window.location.href = '/setup/';
    }, 1000);
}

function profile(id) {
    id.classList.add("pop");
    playSound('click-sound').play();
    setTimeout(function() {
        id.classList.remove("pop");
        window.location.href = '/profile/5';
    }, 1000);

}
