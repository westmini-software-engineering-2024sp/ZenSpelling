//haven't finished this, sorry
var answerArray = JSON.parse(localStorage.getItem('answerBank')) || [];

// TODO: As of now, does not work.
// But it does
function closeModal() {
    const modal1 = document.getElementById("myModal");
    modal1.classList.remove("slideDown")
    modal1.classList.add("slideUp"); // Add slideUp animation class

    setTimeout(() => {
        modal1.style.display = "none"; // Hide the modal after animation
        modal1.classList.remove("slideUp"); // Remove slideUp animation class
        modal1.classList.add("slideDown")
        document.body.style.overflow = ""; // Re-enable scrolling of background content
    }, 500)// Adjust timeout to match animation duration
    modal = false;

    gameComplete();
}

// this submits the PK of answer to the server via an ajax call
function submitAnswer() {
    let formAnswer = document.getElementById("myForm");
    let index = localStorage.getItem('questionNumber'); // Same as gamePageSketches

    formAnswer.addEventListener("submit", function (event) {
        event.preventDefault();
        let answer = document.querySelector('input[name="answer"]:checked').value;

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
                console.log('Server response:', data);
                if (data.exists) { //aka if correct
                    let correct = parseInt(localStorage.getItem('correctAnswers'));
                    correct = correct + 1;
                    localStorage.setItem('correctAnswers', JSON.stringify(correct));
                }
                closeModal();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });

}

// when the game is complete (all questions answered) complete screen is shown
function gameComplete() {
    console.log(localStorage.getItem('questionNumber') + " " + localStorage.getItem('gameboardSize'));
    if (parseInt(localStorage.getItem('questionNumber')) === parseInt(localStorage.getItem('gameboardSize'))) {
        window.location.href = '../complete/';
    }
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
