function startGame() {
    playSound('start-select').play();
    setTimeout(function() {
        window.location.href = '/setup/';
    }, 1000);

}

function profile() {
    playSound('click-sound').play();
    setTimeout(function() {
        window.location.href = '/profile/3';
    }, 1000);

}
