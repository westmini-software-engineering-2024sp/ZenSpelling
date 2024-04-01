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

function submitAnswer() {
    let formAnswer = document.getElementById("myForm");
    let index = localStorage.getItem('questionNumber'); // Same as gamePageSketches

    formAnswer.addEventListener("submit", function (event) {
        event.preventDefault();
        let answer = document.querySelector('input[name="answer"]:checked').value;

        answerArray[index - 1] = parseInt(answer);
        localStorage.setItem('answerBank', JSON.stringify(answerArray));
        console.log(answerArray);

        closeModal();

        /*
        if (Math.random() > .5) {
            let correct = parseInt(localStorage.getItem('correctAnswers'));
            correct = correct + 1;
            localStorage.setItem('correctAnswers', JSON.stringify(correct));
        }
        */

        fetch('/answer/', {
            method: 'POST',
            headers: {
                'Content-Type': parseInt(answer)
            },
            body: JSON.stringify({
                answer: answer
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            closeModal();
        })
            .catch((error) => {
                console.error('Error:', error);
            });
    });

    //this needs to do an ajax call to the server, sending answer (the pk of answer.csv)
    //django needs to send back true or false, then js will handle the tile switching

}

function gameComplete() {
    console.log(localStorage.getItem('questionNumber') + " " + localStorage.getItem('gameboardSize'));
    if (parseInt(localStorage.getItem('questionNumber')) === parseInt(localStorage.getItem('gameboardSize'))) {
        window.location.href = '../complete/';
    }
}


/*document.addEventListener("DOMContentLoaded", function() {
    alert("eventListener triggered");
    var formAnswer = document.getElementById("myForm");

    formAnswer.addEventListener("submit", function(event) {
        event.preventDefault();
        var answer = document.querySelector('input[name="answer"]:checked').value;
        alert(answer);
    });
});*/