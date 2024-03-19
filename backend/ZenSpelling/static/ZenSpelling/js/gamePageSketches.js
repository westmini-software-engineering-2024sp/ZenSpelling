let gridSketch;
let tileSketch;
let gridModels;
let tileStack;
let currentTile;
let currentFilepath;
let placedTilePath;

let GridSketch = function(sketch) {
  sketch.gridContainer = null;
  sketch.cols = 3;
  sketch.rows = 3;
  sketch.boxSize = 0;
  sketch.rotationAngle = 40;
  gridModels = [];

  sketch.setup = function() {
    sketch.canvasContainer = sketch.select('#canvas-container');
    sketch.gridContainer = sketch.select('#grid-container');
    sketch.boxSize = sketch.gridContainer.width / 4;
    let gridCanvas = sketch.createCanvas(sketch.gridContainer.width, sketch.gridContainer.height, sketch.WEBGL);
    gridCanvas.parent(sketch.canvasContainer);
    gridCanvas.class('grid-canvas');

    // Initialize tile models array
    for (let i = 0; i < sketch.cols * sketch.rows; i++) {
      gridModels.push(null);
    }
    console.log(gridModels);
  }

  sketch.draw = function() {
    sketch.clear();
    // sketch.background("#228B22FF");
    sketch.translate(0, -100, -300);

    let gridIndex = 0;

    for (let i = 0; i < sketch.cols; i++) {
      for (let j = 0; j < sketch.rows; j++) {
        let x = i * sketch.boxSize;
        let y = j * sketch.boxSize * sketch.cos(sketch.radians(sketch.rotationAngle));
        let z = j * sketch.boxSize * sketch.sin(sketch.radians(sketch.rotationAngle));

        sketch.drawBox(x, y, z, sketch.boxSize, sketch.rotationAngle, gridModels[gridIndex]);
        // console.log(gridIndex + ' : ' + gridModels[gridIndex]);
        gridIndex++;
      }
    }
  }

  sketch.drawBox = function(x, y, z, size, rotationAngle, model) {
    sketch.push();
    sketch.translate(x - sketch.width / 2 + size, y - sketch.height / 2 + size, z - sketch.height / 2);

    if (model) {
      sketch.rotateX(sketch.radians(150));
      sketch.fill('#6C3413FF');
      sketch.model(model);
    } else {
      sketch.rotateX(sketch.radians(rotationAngle));
      sketch.fill('#6C3413FF');
      sketch.box(size, size, size / 2);
    }
    sketch.pop();
  }

  sketch.mouseReleased = function() {
    // Calculate grid position based on mouse coordinates
    let col = Math.floor(sketch.mouseX / sketch.boxSize);
    console.log(col);
    let row = Math.floor(sketch.mouseY / (sketch.boxSize * sketch.cos(sketch.radians(sketch.rotationAngle))));
    console.log(row);

    // Calculate index in tileModels array
    let index = col + row;
    console.log(index);

    // Assign the next filepath from the stack to the clicked position
    if (index < sketch.cols * sketch.rows) {
      console.log('A');
      console.log(currentTile);
      gridModels[index] = sketch.loadModel(currentFilepath, true);
      console.log('B');
    }

    console.log(gridModels);
  }
};

let TileSketch = function(sketch) {
  sketch.canvasContainer = null;
  sketch.tileContainer = null;
  sketch.tileSize = 0;

  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;
  let modal = false;

  tileStack = []; // Initialize an empty array to act as a stack for file paths

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
        tileStack.push(...data.tile_paths);
        loadNextTile();
      })
      .catch(error => console.error('Error fetching filepaths:', error));
  }

  function loadNextTile() {
    currentFilepath = tileStack.pop();
    if (currentFilepath) {
      currentTile = sketch.loadModel(currentFilepath, true);
    } else {
      console.log('No more tiles in stack');
    }
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

    if (currentTile) {
    sketch.model(currentTile);
    }
  }

  sketch.mousePressed = function() {
    let d = sketch.dist(sketch.mouseX, sketch.mouseY, sketch.canvasContainer.width/2 - (sketch.width/3), sketch.canvasContainer.height/2);
    if (d < sketch.tileSize) {
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
    placedTilePath = currentFilepath;
    loadNextTile();

    // if(!modal){
    //   modal = showModal();
    // }
      dragging = false;
      offsetX = 0;
      offsetY = 0;
  }
};

function showModal() {
  let modal = true;

  $('#myModal').css('display', 'block');

  $('.close').click(function() {
    $('#myModal').css('display', 'none');
  });

  $.ajax({
    url: '../ZenSpelling/2',
    method: 'GET',
    success: function(response) {
      $('#myModal').html(response);
    }
  });

  return modal;
}

function completeGame(){
  window.location.href = '../complete/';
}

document.addEventListener("DOMContentLoaded", function() {
   gridSketch = new p5(GridSketch);
   tileSketch = new p5(TileSketch);
});

document.addEventListener("DOMContentLoaded", function() {
  const openModalBtn = document.getElementById('openModalBtn');
  const modal = document.getElementById('modal');
  const closeModalBtn = modal.querySelector('.close');

  // Hide the modal initially using JavaScript
  modal.style.display = 'none';

  openModalBtn.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
});



