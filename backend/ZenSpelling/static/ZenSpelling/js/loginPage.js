function teacherPortal() {
    playSound('click-sound').play();
    setTimeout(function() {
        window.location.href = '/admin/';
    }, 500);
}

function loginPressed(){
    playSound('login-pressed').play();
}

