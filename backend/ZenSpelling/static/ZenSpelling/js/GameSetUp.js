function logout() {
    window.location.href = '/';
}

function playGame(size) {
    generateQuestion(size);
    generateTileStack();
    shuffleTileStack();
    generateGameboard(size);

    let currentTimestamp = new Date();
    localStorage.setItem('startTime', currentTimestamp.toString());

    window.location.href = '/game/'
}

/*
 * This function will generate which question should pop up
 * In the end, I want this to generate the question array with length gameboardSize
 */
function generateQuestion(sidelength) {
    var questionArray = [];
    var answerArray = [];
    //var gameboardSize = sidelength*sidelength; //uncomment this if wanting to generate the entire board
    var gameboardSize = sidelength; //uncomment this if wanting to run just the bare minimum of questions for testing

    for (let i = 0; i < gameboardSize; i++) {
        let uniqueNumber;
        do {
            uniqueNumber = Math.floor(Math.random() * gameboardSize) + 1;
        } while (questionArray.includes(uniqueNumber));
        questionArray[i] = uniqueNumber;
    }

    localStorage.setItem('boardsize', sidelength); //edge length
    localStorage.setItem('gameboardSize', gameboardSize); //how many tiles
    localStorage.setItem('questionBank', JSON.stringify(questionArray));
    localStorage.setItem('answerBank', JSON.stringify(answerArray));
    localStorage.setItem('questionNumber', JSON.stringify(0));
    localStorage.setItem('correctAnswers', JSON.stringify(0));
}

// Fetch tilepath endpoints and load them in a stack.
//How many tiles are loaded into the stack, how is that determined?
function generateTileStack() {
    let tileStack = [];

    fetch('/tilepaths/')
        .then(response => response.json())
        .then(data => {
            tileStack.push(...data.tile_paths);
            localStorage.setItem('tileBank', JSON.stringify(tileStack));
        })
        .catch(error => console.error('Error fetching filepaths:', error));
}

//this is not working and I do not know why
function shuffleTileStack() {
    var tileStack = JSON.parse(localStorage.getItem('tileBank'));

    for (let i = tileStack.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tileStack[i], tileStack[j]] = [tileStack[j], tileStack[i]];
    }

    localStorage.setItem('tileBank', JSON.stringify(tileStack));
}

function generateGameboard(size) {
    var gameboardSize = size * size;
}
