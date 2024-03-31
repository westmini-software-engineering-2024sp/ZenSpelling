// Function to create twinkling pixels at random positions
  function createTwinklingPixel() {
    let pixel = document.createElement('div');
    pixel.className = 'twinkling-pixel';
    pixel.style.left = Math.random() * window.innerWidth + 'px';
    pixel.style.top = Math.random() * window.innerHeight + 'px';
    document.getElementById('twinkling-container').appendChild(pixel);
  }

  // Create multiple twinkling pixels
  for (let i = 0; i < 120; i++) {
    createTwinklingPixel();
  }

  document.getElementById("mute_play").onclick = function() {
      let audio = document.getElementById("background-music");

      if (audio.paused) {
          audio.play();
          this.textContent = "Turn Music OFF";
      } else {
          audio.pause();
          this.textContent = "Turn Music ON";
      }

      function playMusic() {
          // Your code to start playing the music
          // Store the state of the music player in session storage
          sessionStorage.setItem('musicPlaying', 'true');
      }

      // Function to check if the music should be playing
      function checkMusic() {
          let musicPlaying = sessionStorage.getItem('musicPlaying');
          if (musicPlaying === 'true') {
              // Your code to resume playing the music
              // For demonstration purposes, let's just log a message
          }
      }

      window.onload = checkMusic;

  }