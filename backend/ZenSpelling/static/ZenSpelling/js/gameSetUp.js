function playGame(size) {
    generateQuestion(size);
    generateTileStack(size);

    setTimeout(() => {
        generateQuestion(size);
        generateTileStack(size);

        let currentTimestamp = new Date();
        localStorage.setItem('startTime', currentTimestamp.toString());

        window.location.href = '/game/'
    }, 100);
}

// This does everything (get the array of questions.id in the question set,
// do the counts for randomization,
// do the counts for tiles) in theory


/*
 * This function will generate which question should pop up
 * This should only be used if the player want to pull from the entire question table and not a question set
 */
function generateQuestion(sidelength) {
    let questionArray = [];
    let answerArray = [];
    let gameboardSize = sidelength * sidelength; //uncomment this if wanting to generate the entire board
    //let gameboardSize = sidelength; //uncomment this if wanting to run just the bare minimum of questions for testing
    let questionCount = parseInt(localStorage.getItem('questionCount'));

    for (let i = 0; i < gameboardSize; i++) {
        let randomNumber;

        if (gameboardSize <= questionCount) {
            do {
            randomNumber = Math.floor(Math.random() * questionCount) + 1;
            } while (questionArray.includes(randomNumber));
        } else {
            randomNumber = Math.floor(Math.random() * questionCount) + 1;
        }
        questionArray[i] = randomNumber;
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
    for (let i = tileStack.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tileStack[i], tileStack[j]] = [tileStack[j], tileStack[i]];
    }

    localStorage.setItem('tileBank', JSON.stringify(tileStack));
}

function playSoundAndStartGame(gridSize){
    console.log("playSoundAndStartGame is called");
    const questionSetId = localStorage.getItem('questionSetId')
    console.log("playSoundAndStartGame: " + questionSetId);
    localStorage.removeItem('questionSetId');

    if (questionSetId === null) {
        alert("null");
        return;
    }

    fetch(`generate_questions/?question_set_id=${questionSetId}`, {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });

    element.classList.add("pop");
    playSound('grid-select').play()
    setTimeout(function() {
        element.classList.remove("pop");
        //playGame(gridSize)
    }, 1000);
}


function playSoundAndHighlightQuestionSet(currentSet) {
    const questionSetId = currentSet.getAttribute('data-questionSetId');
    //console.log(questionSetId);
    localStorage.setItem('questionSetId', questionSetId);

    playSound('click-sound').play();
    let setList = document.getElementsByClassName('question-set-item');
    for (let i = 0; i < setList.length; i++) {
        setList[i].classList.remove('clicked');
    }
    currentSet.classList.add('clicked');
}
