document.addEventListener('click', function(event) {
  let overlay = document.getElementById('overlay');
  let clickableImage = document.getElementById('clickable-image');

  // Check if the click event target is not the overlay or the clickable image
  if (event.target !== overlay && event.target !== clickableImage) {
    overlay.style.display = 'none'; // Hide the overlay
  }
});

document.getElementById('clickable-image').addEventListener('click', function() {
  let overlay = document.getElementById('overlay');
  if (overlay.style.display === 'block') {
    overlay.style.display = 'none';
  } else {
    overlay.style.display = 'block';
  }
});

