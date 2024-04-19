//haven't finished this, sorry
let answerArray = JSON.parse(localStorage.getItem('answerBank')) || [];
let onStreak = false;
let streakCount;
localStorage.setItem('streak', JSON.stringify(0));

function closeModal() {
    const modal1 = document.getElementById("myModal");
    modal1.classList.remove("slideDown");
    modal1.classList.add("slideUp"); // Add slideUp animation class

    setTimeout(() => {
        modal1.style.display = "none"; // Hide the modal after animation
        modal1.classList.remove("slideUp"); // Remove slideUp animation class
        modal1.classList.add("slideDown");

        document.body.style.overflow = ""; // Re-enable scrolling of background content
    }, 500)// Adjust timeout to match animation duration
    modal = false;
    setTimeout(function() {
    }, 1000);
}

// this submits the PK of answer to the server via an ajax call
function submitAnswer() {
    let sound;
    let formAnswer = document.getElementById("myForm");
    let index = localStorage.getItem('questionNumber'); // Same as gamePageSketches

    formAnswer.addEventListener("submit", function (event) {
        event.preventDefault();
        let answer = document.querySelector('input[name="answer"]:checked').value;
        let modalSpace = document.getElementById('sub-label');
        modalSpace.classList.add("pop");

        answerArray[index - 1] = parseInt(answer);
        localStorage.setItem('answerBank', JSON.stringify(answerArray));

        // sending answer to server
        fetch('/game/answer/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify({
                answer: answer
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {

                if (data.exists) { //aka if correct
                    playSound('correct-sound').play();
                    let correct = parseInt(localStorage.getItem('correctAnswers'));
                    correct = correct + 1;
                    localStorage.setItem('correctAnswers', JSON.stringify(correct));

                    // creating the streak
                    if (onStreak === false) {
                        onStreak = true;
                        streakCount = 1;
                    } else { // streak already exists
                        streakCount = streakCount + 1;
                    }

                    //checking if the saved streak is larger than the current streak
                    if (parseInt(localStorage.getItem('streak')) < streakCount) {
                        localStorage.setItem('streak', JSON.stringify(streakCount));
                    }

                    modalSpace.innerHTML = 'CORRECT!';

                    if(dataArray[newRow + '' + newCol].weed){
                        dataArray[newRow + '' + newCol].model = '';
                        dataArray[newRow + '' + newCol].weed = false;
                        dataArray[newRow + '' + newCol].collision = false;
                    }

                } else {
                    playSound('wrong-sound').play();
                    onStreak = false;
                    newFilePath = `/static/Assets/WeedTiles/weedTile01.png`;
                    dataArray[newRow + '' + newCol].model = gridSketch.loadImage(newFilePath, function (img) {
                        img.resize(gridSketch.boxSize, 0);
                    });
                    dataArray[newRow + '' + newCol].weed = true;
                    modalSpace.innerHTML = 'WRONG!';
                }
                setTimeout(function() {
                    closeModal();
                }, 1000);

                if (parseInt(localStorage.getItem('questionNumber')) === parseInt(localStorage.getItem('gameboardSize'))) {
                    let eventTimestamp = new Date(); //do timestamp
                    alert(eventTimestamp.toString());
                    localStorage.setItem('finishTime', eventTimestamp.toString());
                    //a delay added. Maybe change this to a button called, complete game that only appears when the game is complete
                    gameComplete();
                }

            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });
}

// when the game is complete (all questions answered) complete screen is shown
function gameComplete() { //this can happen too early
    window.location.href = '../complete/';
}

// passed to the server so we don't get a Forbidden
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