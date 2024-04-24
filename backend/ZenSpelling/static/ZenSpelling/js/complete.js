//This function returns the student's score as a string
function getScore() {
    let correct = localStorage.getItem('correctAnswers'); //use this if you need to get the score as a string
    let total = localStorage.getItem('gameboardSize');
    return correct + "/" + total;
}

function getPercentage() {
    let correct = parseInt(localStorage.getItem('correctAnswers')); //use this if you need to get the score as a number
    let total = parseInt(localStorage.getItem('gameboardSize'));
    return Math.round((correct/total)*100).toString();
}

function getStartTimeDisplay() {
    return localStorage.getItem('startTime');
}

function getFinishTimeDisplay() {
    return localStorage.getItem('finishTime');
}

function getTimeSpentDisplay() {
    let start = new Date(localStorage.getItem('startTime'));
    let end = new Date(localStorage.getItem('finishTime'));

    start = start.getTime();
    end = end.getTime();

    //let hour = Math.floor((end-start)/(1000*60*60));
    let minute = Math.floor(((end-start) % (1000*60*60))/(1000*60)); //these are the numbers as INT
    let second = Math.floor(((end-start) % (1000*60*60))/1000);
    second =  second % 60; //these are the numbers as INT

    //return `${hour} hours, ${minute} minutes, ${second} seconds`;
    return `${minute} minutes, ${second} seconds`;  //use this if you need to get the time as a string
}

function getTimeSpentSeconds() {
    let start = new Date(localStorage.getItem('startTime'));
    let end = new Date(localStorage.getItem('finishTime'));

    start = start.getTime();
    end = end.getTime();

    return Math.floor(((end-start) % (1000*60*60))/1000);//int as seconds
}

function getStreakDisplay() {
    return localStorage.getItem('streak'); //This is as a string, you can use parseInt() to make it an int
}

function sendDataBack() {
    fetch ('/complete/datatoprofile/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
                timeSpent: getTimeSpentSeconds(),
                questionCount: parseInt(localStorage.getItem('gameboardSize')),
                questionCorrect: parseInt(localStorage.getItem('correctAnswers')),
                streak: parseInt(localStorage.getItem('streak'))
                // add code to also send the medals
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
                alert("Game Saved Successfully");
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

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('scoreDisplay').textContent = getScore();
    document.getElementById('percentDisplay').textContent = getPercentage();
    //document.getElementById('startTimeDisplay').textContent = getStartTimeDisplay();
    //document.getElementById('finishTimeDisplay').textContent = getFinishTimeDisplay();
    document.getElementById('timeSpentDisplay').textContent = getTimeSpentDisplay();
    document.getElementById('streakDisplay').textContent = getStreakDisplay();
    sendDataBack();
    displaySavedGarden();
    setTimeout(function() {
        localStorage.clear(); //localstorage is cleared
    }, 500)
});

document.getElementById('clickable-image').addEventListener('click', function() {
  let overlay = document.getElementById('overlay');
  if (overlay.style.display === 'block') {
    overlay.style.display = 'none';
  } else {
    overlay.style.display = 'block';
  }
  let clickableImage = document.getElementById('clickable-image');

  // Check if the click event target is not the overlay or the clickable image
  if (event.target !== overlay && event.target !== clickableImage) {
    overlay.style.display = 'none'; // Hide the overlay
  }
});

function rotateMedal(element){
    playSound('pop-sound').play();
    if (element.style.transform === 'rotateY(180deg)') {
        element.style.transform = 'rotateY(0deg)';
    } else {
        element.style.transform = 'rotateY(180deg)';
    }
}

function displaySavedGarden() {
    let savedGarden = localStorage.getItem("savedGarden");

    if (savedGarden) {
        let img = document.createElement("img");
        let parent = document.getElementById("saved-garden");

        img.src = savedGarden;
        parent.appendChild(img);
    } else {
        alert("No saved garden found!");
    }
}