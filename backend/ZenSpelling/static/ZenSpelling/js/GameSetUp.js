function logout() {
    window.location.href = '/';
}

function playGame(size) {
    generateQuestion(size);
    generateTileStack();
    var tilestack = JSON.parse(localStorage.getItem('tileBank'));
    tilestack = shuffleTileStack(tilestack);
    localStorage.setItem('tileBank', JSON.stringify(tilestack));
    generateGameboard(size);

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

// Fetch tilepath endpoints and load them in a stack.
//How many tiles are loaded into the stack, how is that determined?
function generateTileStack(gameboardSize) {
    let tileStack = [];

    fetch('/tilepaths/')
        .then(response => response.json())
        .then(data => {
            tileStack.push(...data.tile_paths);
            localStorage.setItem('tileBank', JSON.stringify(tileStack));
        })
        .catch(error => console.error('Error fetching filepaths:', error));
}

function shuffleTileStack(tileStack) {
    for (let i = tileStack.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tileStack[i], tileStack[j]] = [tileStack[j], tileStack[i]];
    }
    return tileStack;
}

function generateGameboard(size) {
    var gameboardSize = size * size;
}
