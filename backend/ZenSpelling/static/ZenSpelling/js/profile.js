function testCompletePage() {
    let currentTimestamp = new Date();
    localStorage.setItem('startTime', currentTimestamp.toString());
    localStorage.setItem('gameboardSize', 9);
    localStorage.setItem('correctAnswers', 9);
    localStorage.setItem('streak', 5);

    setTimeout(() => {
        currentTimestamp = new Date();
    localStorage.setItem('finishTime', currentTimestamp.toString());
    window.location.href = '../complete/';
    }, 2000);
}


document.addEventListener("DOMContentLoaded", function() {
    // Function to format seconds into hours, minutes, and seconds dynamically
    function formatTimeWithHours(seconds) {
        let parts = [];
        let hours = Math.floor(seconds / 3600);
        let remainder = seconds % 3600;
        let minutes = Math.floor(remainder / 60);
        let remainingSeconds = remainder % 60;

        if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
        if (minutes > 0 || hours > 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
        parts.push(`${remainingSeconds} second${remainingSeconds > 1 ? 's' : ''}`);

        return parts.join(', ');
    }

    // Function to format seconds into minutes and seconds dynamically
    function formatTime(seconds) {
        let parts = [];
        let minutes = Math.floor(seconds / 60);
        let remainingSeconds = seconds % 60;

        if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
        parts.push(`${remainingSeconds} second${remainingSeconds > 1 ? 's' : ''}`);

        return parts.join(' and ');
    }

    let timeSpentElement = document.getElementById('timeSpent');
    let fastestGameElement = document.getElementById('fastestGame');

    // Function to extract numbers from text
    function extractSeconds(text) {
        let parts = text.match(/(\d+)/); // Use regex to find the first number
        return parts ? parseInt(parts[0]) : 0; // Return the number or 0 if not found
    }

    let timeSpentSeconds = extractSeconds(timeSpentElement.textContent);
    let fastestGameSeconds = extractSeconds(fastestGameElement.textContent);

    timeSpentElement.textContent = formatTimeWithHours(timeSpentSeconds);
    fastestGameElement.textContent = formatTime(fastestGameSeconds);
});
