function playSound(soundId) {
    let soundEffect = document.getElementById(soundId);

    // Nested function, in case we want to add more functionality (pause, reset, playOnce, etc).
    return {
        play: function () {
            soundEffect.play();
        },
        loop: function () {
            soundEffect.loop = true;
            soundEffect.play();
        },
        soundEffect: soundEffect
    };
}

function toggleMusic(id) {
      let audio = document.getElementById(id);

      if(audio.paused) {
          audio.play();
          this.textContent = "Music OFF";
      }
      else {
          audio.pause();
          this.textContent = "Music ON";
      }
}

// TODO : Unsure if we will still need this logic. Saving for now.
// function togglePlay() {
//     let audio = document.getElementById('audio-player');
//     if (audio.paused) {
//         audio.play();
//         localStorage.setItem('isPlaying', 'true');
//     } else {
//         audio.pause();
//         localStorage.setItem('isPlaying', 'false');
//     }
// }
//
// // Check for playback state when the page loads
// window.onload = function() {
//     let audio = document.getElementById('audio-player');
//     let isPlaying = localStorage.getItem('isPlaying');
//     if (isPlaying === 'true') {
//         audio.play();
//     }
// }