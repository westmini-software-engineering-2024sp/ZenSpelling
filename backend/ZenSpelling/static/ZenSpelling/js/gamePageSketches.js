let gridSketch;
let tileSketch;

let GridSketch = function(sketch) {
  sketch.gridContainer = null;
  sketch.cols = 3;
  sketch.rows = 3;
  sketch.boxSize = 0;
  sketch.rotationAngle = 40;

  sketch.setup = function() {
    sketch.canvasContainer = sketch.select('#canvas-container');
    sketch.gridContainer = sketch.select('#grid-container');
    sketch.boxSize = sketch.gridContainer.width / 4;
    let gridCanvas = sketch.createCanvas(sketch.gridContainer.width, sketch.gridContainer.height, sketch.WEBGL);
    gridCanvas.parent(sketch.canvasContainer);
    gridCanvas.class('grid-canvas');
  }

  sketch.draw = function() {
    sketch.clear();
    // sketch.background("#228B22FF");
    sketch.translate(0, -100, -300);

    for (let i = 0; i < sketch.cols; i++) {
      for (let j = 0; j < sketch.rows; j++) {
        let x = i * sketch.boxSize;
        let y = j * sketch.boxSize * sketch.cos(sketch.radians(sketch.rotationAngle));
        let z = j * sketch.boxSize * sketch.sin(sketch.radians(sketch.rotationAngle));
        sketch.drawBox(x, y, z, sketch.boxSize, sketch.rotationAngle);
      }
    }
  }

  sketch.drawBox = function(x, y, z, size, rotationAngle) {
    sketch.push();
    sketch.translate(x - sketch.width / 2 + size, y - sketch.height / 2 + size, z - sketch.height / 2);
    sketch.rotateX(sketch.radians(rotationAngle));
    sketch.fill('#6C3413FF');
    sketch.box(size, size, size / 2);
    sketch.pop();
  }
};

let TileSketch = function(sketch) {
  sketch.canvasContainer = null;
  sketch.tileContainer = null;
  sketch.tileSize = 0;
  let filepaths = []
  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;
  let testTile;

  sketch.preload = function() {
    loadTilepaths()
  }

  sketch.setup = function() {
    sketch.canvasContainer = sketch.select('#canvas-container');
    sketch.tileContainer = sketch.select('#tile-container');
    sketch.tileSize = sketch.tileContainer.width / 2.5;

    let tileCanvas = sketch.createCanvas(sketch.canvasContainer.width, sketch.canvasContainer.height, sketch.WEBGL);
    tileCanvas.parent(sketch.canvasContainer);
    tileCanvas.class('tile-canvas');
  }

  function loadTilepaths() {
  fetch('/tilepaths/')
    .then(response => response.json())
    .then(data => {
      filepaths = data.tile_paths;
      testTile = sketch.loadModel(filepaths[0], true);
    })
    .catch(error => console.error('Error fetching filepaths:', error));
  }

  sketch.draw = function() {
    sketch.clear();
    // sketch.background("pink");

    if(!dragging){
      offsetX = -sketch.width / 3
      sketch.translate(offsetX, offsetY);
      sketch.rotateY(sketch.frameCount * 0.0125);
    } else {
      sketch.translate(offsetX, offsetY);
    }

    sketch.rotateX(sketch.PI);
    sketch.rotateY(sketch.PI);
    sketch.rotateX(sketch.radians(40));
    sketch.fill('#6C3413FF');

    // sketch.box(sketch.tileSize, sketch.tileSize, sketch.tileSize / 2);
    if (testTile) {
    sketch.model(testTile);
    }
  }

  sketch.mousePressed = function() {
    let d = sketch.dist(sketch.mouseX, sketch.mouseY, sketch.canvasContainer.width/2 - (sketch.width/3), sketch.canvasContainer.height/2);
    if (d < sketch.tileSize/2) {
      dragging = true;
    }
    return false;
  }

  sketch.mouseDragged = function() {
    if (dragging) {
      offsetX = sketch.mouseX - sketch.width / 2;
      offsetY = sketch.mouseY - sketch.height / 2;
      return false;
    }
  }

  sketch.mouseReleased = function() {
    dragging = false;
    offsetX = 0;
    offsetY = 0;
    showModal();
  }
};

function showModal() {
  // Show the modal
  $('#myModal').css('display', 'block');

  // Close the modal when the close button is clicked
  $('.close').click(function() {
    $('#myModal').css('display', 'none');
  });

  $.ajax({
    url: '/2',
    method: 'GET',
    success: function(response) {
      console.log(response.data);
      $('#modal-content').text(response.data);
    },
    error: function(xhr, status, error) {
      console.error(xhr.responseText);
    }
  });
}

document.addEventListener("DOMContentLoaded", function() {
   gridSketch = new p5(GridSketch);
   tileSketch = new p5(TileSketch);
});

