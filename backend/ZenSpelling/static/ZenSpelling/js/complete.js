let correctMedalEarned = false;
let timeMedalEarned = false;
let streakMedalEarned = false;


//This function returns the student's score as a string
function getScore() {
    let correct = localStorage.getItem('correctAnswers'); //use this if you need to get the score as a string
    let total = localStorage.getItem('gameboardSize');
    return correct + "/" + total;
}


function getPercentage() {
    let correct = parseInt(localStorage.getItem('correctAnswers'));
    let total = parseInt(localStorage.getItem('gameboardSize'));
    return Math.round((correct / total) * 100).toString();
}


function getTimeSpentDisplay() {
    let start = new Date(localStorage.getItem('startTime'));

    //if finishTime is 0
    if (0 === parseInt(localStorage.getItem('finishTime'))) {
        let currentTimestamp = new Date();
        localStorage.setItem('finishTime', currentTimestamp.toString());
    }
    let end = new Date(localStorage.getItem('finishTime'));

    start = start.getTime();
    end = end.getTime();

    let totalSeconds = Math.floor((end - start) / 1000);
    let parts = [];
    let minutes = Math.floor(totalSeconds / 60);
    let remainingSeconds = totalSeconds % 60;

    if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
    if (remainingSeconds > 0 || parts.length === 0) parts.push(`${remainingSeconds} second${remainingSeconds > 1 ? 's' : ''}`);

    return parts.join(' and '); //use this if you need to get the time as a string
}

function getTimeSpentSeconds() {
    let start = new Date(localStorage.getItem('startTime'));
    let end = new Date(localStorage.getItem('finishTime'));

    start = start.getTime();
    end = end.getTime();

    if (end < start) {
        let temp = end;
        end = start;
        start = temp;
    }

    return Math.floor(((end - start) % (1000 * 60 * 60)) / 1000);//int as seconds
}

function getStreakDisplay() {
    return localStorage.getItem('streak'); //This is as a string, you can use parseInt() to make it an int
}

async function sendDataBack() {
    fetch('/complete/datatoprofile/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            timeSpent: getTimeSpentSeconds(),
            questionCount: parseInt(localStorage.getItem('gameboardSize')),
            questionCorrect: parseInt(localStorage.getItem('correctAnswers')),
            streak: parseInt(localStorage.getItem('streak')),
            correctMedal: correctMedalEarned,
            timeMedal: timeMedalEarned,
            streakMedal: streakMedalEarned
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.exists) {
                console.log("Game saved");
            }
        })
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function displayCorrectMedal() {
    let correctAnswers = parseInt(localStorage.getItem('correctAnswers'));
    let totalQuestions = parseInt(localStorage.getItem('gameboardSize'));
    // Get the medal div class
    let correctMedal = document.getElementsByClassName('correctMedal');

    // Check if the user answered all questions correctly
    if (correctAnswers === totalQuestions) {
        // Show the medal
        for (let i = 0; i < correctMedal.length; i++) {
            correctMedal[i].style.display = 'flex';
        }
        console.log("correct medal earned");
        return true;
    } else {
        // default the medal is not displayed
        return false;
    }
}

function displayTimeMedal() {
    let start = new Date(localStorage.getItem('startTime'));
    let end = new Date(localStorage.getItem('finishTime'));
    let totalQuestions = parseInt(localStorage.getItem('gameboardSize'));
    let time;
    // Get the medal div class
    let timeMedal = document.getElementsByClassName('timeMedal');

    start = start.getTime();
    end = end.getTime();

    let second = Math.floor(((end - start) % (1000 * 60 * 60)) / 1000);

    if (totalQuestions === 9) {
        time = 60;
    } else if ( totalQuestions === 16) {
        time = 120;
    } else {
        time = 180;
    }

    localStorage.setItem("timeStamp", time.toString());

    // Check if the user answered all questions correctly
    if (second < time && second !== 0) {
        // Show the medal
        for (let i = 0; i < timeMedal.length; i++) {
            timeMedal[i].style.display = 'flex';
        }
        console.log("time medal earned");
        return true;
    } else {
        return false;
    }
}

function displayStreakMedal() {
    let streak = parseInt(localStorage.getItem('streak'));
    let total = localStorage.getItem('gameboardSize');
    // Get the medal div class
    let streakMedal = document.getElementsByClassName('streakMedal');
    localStorage.setItem('minStreak', (Math.round((total / 2)).toString()));
    //alert(localStorage.getItem('minStreak'));

    // Check if the user answered all questions correctly
    if (streak >= parseInt(localStorage.getItem('minStreak'))) {
        // Show the medal
        for (let i = 0; i < streakMedal.length; i++) {
            streakMedal[i].style.display = 'flex';
        }
        console.log("streak medal earned");
        return true;
    } else {
        return false;
    }
    return false;
}


function rotateMedal(element) {
    playSound('pop-sound').play();
    if (element.style.transform === 'rotateY(180deg)') {
        element.style.transform = 'rotateY(0deg)';
    } else {
        element.style.transform = 'rotateY(180deg)';
    }
}


document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('scoreDisplay').textContent = getScore();
    document.getElementById('percentDisplay').textContent = getPercentage();
    document.getElementById('timeSpentDisplay').textContent = getTimeSpentDisplay();
    document.getElementById('streakDisplay').textContent = getStreakDisplay();

    correctMedalEarned = displayCorrectMedal();
    console.log("medal 1 check");
    timeMedalEarned = displayTimeMedal();
    console.log("medal 2 check");
    streakMedalEarned = displayStreakMedal();
    console.log("medal 3 check");

    if (correctMedalEarned || timeMedalEarned || streakMedalEarned) {
        if (timeMedalEarned) {
            document.getElementById('time').textContent = localStorage.getItem("timeStamp");
        }
        if (streakMedalEarned) {
            document.getElementById('number').textContent = localStorage.getItem('minStreak');
        }

        let medals = document.querySelectorAll('.medal');
        medals.forEach(function (medal) {
            medal.addEventListener('click', function () {
                if (medal.style.transform === "rotateY(180deg)") {
                    medal.style.transform = "rotateY(0deg)";
                } else {
                    medal.style.transform = "rotateY(180deg)";
                }
            });
        });
    }

    sendDataBack();

    localStorage.clear(); //localstorage is cleared
});

document.getElementById('medal').addEventListener('click', function () {
    let overlay = document.getElementById('overlay');
    if (overlay.style.display === 'block') {
        overlay.style.display = 'none';
    } else {
        overlay.style.display = 'block';
    }
    let clickableImage = document.getElementById('medal');

    // Check if the click event target is not the overlay or the clickable image
    if (event.target !== overlay && event.target !== clickableImage) {
        overlay.style.display = 'none'; // Hide the overlay
    }
});
