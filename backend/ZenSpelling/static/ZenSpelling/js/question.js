//haven't finished this, sorry
// TODO: As of now, does not work.
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

    submitAnswer();
}

function submitAnswer() {
    let formAnswer = document.getElementById("myForm");

    formAnswer.addEventListener("submit", function(event) {
        event.preventDefault();
        var answer = document.querySelector('input[name="answer"]:checked').value;
        alert(answer);
    });
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

/*
function completeGame() {
    window.location.href = '../complete/';
}
 */