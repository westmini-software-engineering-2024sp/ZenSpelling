function startPageLoad() {
    window.location.href = '/start/';
}

function teacherPortal() {
    window.location.href = '/admin/';
}

function dumbFunction() {
    return true;
}

function login() {
    console.log('clicked')
    var usernameValue = document.getElementById("username").value;
    var passwordValue = document.getElementById("password").value;

    console.log("Username: " + usernameValue);
    console.log("Password: " + passwordValue);

    if (usernameValue.trim() === '' || passwordValue.trim() === '') {
        alert("Username and password cannot be empty.");
        return;
    } else if (dumbFunction()) {
        startPageLoad();
    } else {
        alert("Incorrect username and/or password");
    }
}

let play = document.getElementById("play");
function playMusic() {
    let audio = new Audio("bgMusic.mp3");
        audio.play();
}
play.addEventListener("click", playMusic);

