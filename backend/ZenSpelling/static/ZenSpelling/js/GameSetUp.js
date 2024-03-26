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
    //var questionNumber = gameboardSize*gameboardSize; //uncomment this if wanting to generate the entire board
    var questionNumber = gameboardSize; //uncomment this if wanting to run just the bare minimum of questions for testing

    for (let i = 0; i < questionNumber; i++) {
        let uniqueNumber;
        do {
          uniqueNumber = Math.floor(Math.random() * questionNumber) + 1;
        } while (questionArray.includes(uniqueNumber));
        questionArray[i] = uniqueNumber;
    }

    //set start time
    localStorage.setItem('boardsize', questionNumber); //edge length
    localStorage.setItem('gameboardSize', gameboardSize);
    localStorage.setItem('questionBank', JSON.stringify(questionArray));
    localStorage.setItem('questionNumber', JSON.stringify(0));
}