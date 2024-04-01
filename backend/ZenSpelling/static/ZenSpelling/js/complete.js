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

//get highest answer streak
//display time taken

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('scoreDisplay').textContent = getScore();
    document.getElementById('percentDisplay').textContent = getPercentage();
});