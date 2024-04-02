function getScore() {
    var correct = localStorage.getItem('correctAnswers');
    var total = localStorage.getItem('gameboardSize');
    return correct + "/" + total;
}

function getPercentage() {
    var correct = parseInt(localStorage.getItem('correctAnswers'));
    var total = parseInt(localStorage.getItem('gameboardSize'));
    return ((correct/total)*100).toString();
}

function getStartTimeDisplay() {
    return localStorage.getItem('startTime');
}

function getFinishTimeDisplay() {
    return localStorage.getItem('finishTime');
}

function getStreakDisplay() {
    return localStorage.getItem('streak');

}

//get highest answer streak

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('scoreDisplay').textContent = getScore();
    document.getElementById('percentDisplay').textContent = getPercentage();
    document.getElementById('startTimeDisplay').textContent = getStartTimeDisplay();
    document.getElementById('finishTimeDisplay').textContent = getFinishTimeDisplay();
    document.getElementById('streakDisplay').textContent = getStreakDisplay();
});