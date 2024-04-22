function logout(){
    playSound('click-sound').play();

    setTimeout(function() {
        window.location.href = "/";
    }, 500);
}

function goBack(){
    playSound('click-sound').play();

    setTimeout(function() {
        history.back();
    }, 500);
}

function returnToMain(){
    playSound('click-sound').play();

    setTimeout(function() {
        window.location.href = "/start/";
    }, 500);
}

function playAgain(id){
    id.classList.add("pop");
    playSound('happy-sound').play();

    setTimeout(function() {
        id.classList.remove("pop");
        window.location.href = "/setup/";
    }, 1000);
}

function toProfile(id){
    id.classList.add("pop");
    playSound('click-sound').play();

    setTimeout(function() {
        id.classList.remove("pop");
        window.location.href = "/profile/3";
    }, 1000);
}
