function logout() {
    window.location.href = '/';
}

function playGame(size) {
    generateQuestion(size);
    generateTileStack(size);
    generateGameboard(size);

    let currentTimestamp = new Date();
    localStorage.setItem('startTime', currentTimestamp.toString());
    localStorage.setItem('finishTime', JSON.stringify(0));

    window.location.href = '/game/'
}

function changeColor() {
    let button = document.getElementById("sets");
    button.classList.add("limegreen");
    button.disabled = 'true';
}


/*
 * This function will generate which question should pop up
 * In the end, I want this to generate the question array with length gameboardSize
 */
function generateQuestion(sidelength) {
    var questionArray = [];
    var answerArray = [];
    var gameboardSize = sidelength * sidelength; //uncomment this if wanting to generate the entire board
    //var gameboardSize = sidelength; //uncomment this if wanting to run just the bare minimum of questions for testing

    for (let i = 0; i < gameboardSize; i++) {
        let uniqueNumber;
        do {
            uniqueNumber = Math.floor(Math.random() * gameboardSize) + 1;
        } while (questionArray.includes(uniqueNumber));
        questionArray[i] = uniqueNumber;
    }

    localStorage.setItem('boardsize', sidelength); //edge length
    localStorage.setItem('gameboardSize', JSON.stringify(gameboardSize)); //how many tiles
    localStorage.setItem('questionBank', JSON.stringify(questionArray));
    localStorage.setItem('answerBank', JSON.stringify(answerArray));
    localStorage.setItem('questionNumber', JSON.stringify(0));
    localStorage.setItem('correctAnswers', JSON.stringify(0));
}

/* Fetch tilepath endpoints and load them in a stack.
** Contains algorithm to always fulfill the desired tileStack size.
** This may not be needed if we make 25+ tiles.
*/
function generateTileStack() {
    let tileStack = [];

    fetch('/tilepaths/')
        .then(response => response.json())
        .then(data => {
            let desiredCount = parseInt(localStorage.getItem('gameboardSize'));
            const fetchedTilePaths = data.tile_paths;
            const repetitions = Math.ceil(desiredCount / fetchedTilePaths.length);
            const extendedTilePaths = Array.from({ length: repetitions },
                () => fetchedTilePaths).flat().slice(0, desiredCount);
            tileStack.push(...extendedTilePaths);

            shuffleTileStack(tileStack);

            localStorage.setItem('tileBank', JSON.stringify(tileStack));
        })
        .catch(error => console.error('Error fetching filepaths:', error));
}

// Fisher-Yates shuffle algorithm to randomize tiles.
function shuffleTileStack(tileStack) {
    // let tileStack = JSON.parse(localStorage.getItem('tileBank'));
    console.log(tileStack.length);
    for (let i = tileStack.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tileStack[i], tileStack[j]] = [tileStack[j], tileStack[i]];
    }

    localStorage.setItem('tileBank', JSON.stringify(tileStack));
}

function generateGameboard(size) {
    var gameboardSize = size * size;
}

