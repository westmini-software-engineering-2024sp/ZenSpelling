function logout() {
    window.location.href = '/';
}

function playGame(size) {
    generateQuestion(size);

    window.location.href = '/game/'
}

/*
 * This function will generate which question should pop up
 * In the end, I want this to generate the question array with length gameboardSize
 */
function generateQuestion(gameboardSize) {
    var questionArray = [];

    /*for (let i = 0; i < gameboardSize+1; i++) {
        let uniqueNumber;
        do {
          uniqueNumber = Math.floor(Math.random() * gameboardSize) + 1;
        } while (questionArray.includes(uniqueNumber));
        questionArray[i] = uniqueNumber;
    }*/
    localStorage.setItem('boardsize', gameboardSize);
    localStorage.setItem('questionBank', questionArray);
    localStorage.setItem('questionNumber', 0);
}