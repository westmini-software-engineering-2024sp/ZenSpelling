let correctMedalEarned = false;
let timeMedalEarned = false;
let streakMedalEarned = false;
let imageData = localStorage.getItem('savedGarden');


//This function returns the student's score as a string
function getScore() {
    let correct = localStorage.getItem('correctAnswers');
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

    return parts.join(' and ');
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

    return Math.floor(((end - start) % (1000 * 60 * 60)) / 1000);
}

function getStreakDisplay() {
    return localStorage.getItem('streak');
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
    let correctMedal = document.getElementsByClassName('correctMedal');

    if (correctAnswers === totalQuestions) {
        for (let i = 0; i < correctMedal.length; i++) {
            correctMedal[i].style.display = 'flex';
        }
        console.log("correct medal earned");
        return true;
    } else {
        return false;
    }
}

function displayTimeMedal() {
    let start = new Date(localStorage.getItem('startTime'));
    let end = new Date(localStorage.getItem('finishTime'));
    let totalQuestions = parseInt(localStorage.getItem('gameboardSize'));
    let time;
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

    if (second < time && second !== 0) {
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
    let streakMedal = document.getElementsByClassName('streakMedal');
    localStorage.setItem('minStreak', (Math.round((total / 2)).toString()));
    //alert(localStorage.getItem('minStreak'));

    if (streak >= parseInt(localStorage.getItem('minStreak'))) {
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
    displaySavedGarden();

    localStorage.clear();
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

function displaySavedGarden() {
    if (imageData) {
        let img = document.createElement("img");
        let parent = document.getElementById("saved-garden");

        img.src = imageData;
        parent.appendChild(img);
    } else {
        alert("No saved garden found!");
    }
}

function saveGardenToDB(button){
    // TODO : Unable to figure this out in time for R3.
    // if (imageData) {
    //     $.ajax({
    //         type: "POST",
    //         url: "/save-garden/",
    //         data: {
    //             image_data: imageData,
    //             csrfmiddlewaretoken: getCookie('csrftoken')
    //         },
    //         success: function(response) {
    //             alert("Image saved successfully!");
    //         },
    //         error: function(xhr, status, error) {
    //             alert("Error saving image: " + error);
    //         }
    //     });
    // } else {
    //     alert("No image data found in localStorage.");
    // }

    button.classList.add('pop');
    setTimeout(() => {
        button.innerHTML = "Garden Saved!";
        button.setAttribute('disabled', 'true');

        button.style.backgroundColor = '#e7c116';
        button.style.color = 'black';
        button.style.outline = '0.1em solid black';

        setTimeout(() => {
            playSound('happy-sound').play();}, 50);
    }, 200);
}
