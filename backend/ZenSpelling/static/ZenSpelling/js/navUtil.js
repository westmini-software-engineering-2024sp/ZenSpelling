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
