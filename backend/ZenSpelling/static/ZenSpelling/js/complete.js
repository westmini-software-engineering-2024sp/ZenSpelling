function getScore() {
    let correct = localStorage.getItem('correctAnswers');
    let total = localStorage.getItem('gameboardSize');
    return correct + "/" + total;
}

function getPercentage() {
    let correct = parseInt(localStorage.getItem('correctAnswers'));
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
    let minute = Math.floor(((end-start) % (1000*60*60))/(1000*60));
    let second = Math.floor(((end-start) % (1000*60*60))/1000);

    //return `${hour} hours, ${minute} minutes, ${second} seconds`;
    return `${minute} minutes, ${second} seconds`;
}

function getStreakDisplay() {
    return localStorage.getItem('streak');

}

//get highest answer streak

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('scoreDisplay').textContent = getScore();
    document.getElementById('percentDisplay').textContent = getPercentage();
    //document.getElementById('startTimeDisplay').textContent = getStartTimeDisplay();
    //document.getElementById('finishTimeDisplay').textContent = getFinishTimeDisplay();
    document.getElementById('timeSpentDisplay').textContent = getTimeSpentDisplay();
    document.getElementById('streakDisplay').textContent = getStreakDisplay();
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
