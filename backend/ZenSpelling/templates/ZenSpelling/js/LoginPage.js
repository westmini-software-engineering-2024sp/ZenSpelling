function startPageLoad() {
    window.location.href = '../html/StartPage.html';
}

function login() {
    var usernameValue = document.getElementById("username").value;
    var passwordValue = document.getElementById("password").value;

    console.log("Username: " + usernameValue);
    console.log("Password: " + passwordValue);

    alert("Username: " + usernameValue + "\nPassword: " + passwordValue);

    if (usernameValue.trim() === '' || passwordValue.trim() === '') {
        alert("Username and password cannot be empty.");
        return;
    } else if (dumbfunction()) {
        /* add code to check if the login is valid, return boolean */
        startPageLoad();
    } else {
        alert("Incorrect username and/or password");
    }
}

function dumbfunction() {
    return true;
}