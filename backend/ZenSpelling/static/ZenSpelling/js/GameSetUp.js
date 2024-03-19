function logout() {
    window.location.href = '/';
}

function playGame(size) {
    localStorage.setItem('gameboardSize', size);

    window.location.href = '/game/'
}