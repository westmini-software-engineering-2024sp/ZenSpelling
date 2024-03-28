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

// function createTwinklingPixel() {
//     let pixel = document.createElement('div');
//     pixel.className = 'twinkling-pixel';
//     pixel.style.left = Math.random() * window.innerWidth + 'px';
//     pixel.style.top = Math.random() * window.innerHeight + 'px';
//     document.getElementById('twinkling-container').appendChild(pixel);
//   }
//
//   for(let i = 0; i < 50; i++) {
//       createTwinklingPixel();
//   }

