let gridSketch;
let tileSketch;
let gridCollisions;
let tileStack;
let currentTile;
let currentFilepath;
let placedTilePath;
let dataArray = {};
let tileSize = 0;
let placed = false;

let GridSketch = function(sketch) {
  sketch.gridContainer = null;
  sketch.cols = 3;
  sketch.rows = 3;
  sketch.boxSize = 0;
  sketch.rotationAngle = 40;

  sketch.setup = function() {
    sketch.canvasContainer = sketch.select('#canvas-container');
    sketch.gridContainer = sketch.select('#grid-container');

    let gridCanvas = sketch.createCanvas(sketch.gridContainer.width, sketch.gridContainer.height, sketch.WEBGL);

    gridCanvas.parent(sketch.canvasContainer);
    gridCanvas.class('grid-canvas');

    sketch.calculateBoxSize();

    // Initialize utility data
    for (let i = 0; i < sketch.cols; i++) {
        for(let j = 0; j < sketch.rows; j++){
            let key = i.toString() + j.toString();
            dataArray[key] = {
              x: "0",
              y: "0",
              z: "0",
              collision: false,
              model : ""
            };
        }
    }
  }

  sketch.calculateBoxSize = function() {
    sketch.boxSize = sketch.gridContainer.width / 4;
  }

  sketch.draw = function() {
    sketch.clear();
    sketch.translate(0, -100, -200);

    let gridIndex = 0;

    for (let i = 0; i < sketch.cols; i++) {
      for (let j = 0; j < sketch.rows; j++) {
        let x = i * sketch.boxSize;
        let y = j * sketch.boxSize * sketch.cos(sketch.radians(sketch.rotationAngle));
        let z = j * sketch.boxSize * sketch.sin(sketch.radians(sketch.rotationAngle));

        dataArray[i + '' + j].x = x;
        dataArray[i + '' + j].y = y;
        dataArray[i + '' + j].z = z;

        sketch.drawBox(x, y, z, sketch.boxSize, sketch.rotationAngle, dataArray[i + '' + j].model, sketch.rotationAngle, dataArray[i + '' + j].collision);

        gridIndex++;
      }
    }
  }

  sketch.drawBox = function(x, y, z, size, rotationAngle, model, collision) {
    sketch.push();
    sketch.translate(x - sketch.width / 2 + size, y - sketch.height / 2 + size, z - sketch.height / 2);
    // sketch.translate(x,y,z);
    if(collision){
      sketch.fill('rgba(255,255,255,0.5)');
    } else {
      sketch.fill('rgba(255,255,255,0.10)');
    }

    if (model) {
      sketch.image(model, -100, -100);
    } else {
      sketch.rotateX(sketch.radians(rotationAngle));
      sketch.box(size, size, size / 2);
    }
    sketch.pop();
  }

  sketch.setCollisionStatus = function(index, status) {
    gridCollisions[index] = status;
  }

  sketch.mouseReleased = function() {
    // Calculate grid position based on mouse coordinates
    let gridSize = Object.keys(dataArray).length;
    for(let i = 0; i < Math.sqrt(gridSize); i++){
      for(let j = 0; j < Math.sqrt(gridSize); j++){
        let d = sketch.dist(sketch.mouseX, sketch.mouseY, dataArray[i + '' + j].x, dataArray[i + '' + j].y);
        console.log("x:", sketch.mouseX);
        console.log("gridX: ", dataArray[i + '' + j].x);
        console.log("y: ", sketch.mouseY);
        console.log("gridY: ", dataArray[i + '' + j].y);
        if (d < tileSize && dataArray[i + '' + j].model === '') {
          dataArray[i + '' + j].model = sketch.loadImage(currentFilepath, function (img) {
            img.resize(300, 0);
            placed = true;
          })
        }
      }
    }
  }

  sketch.windowResized = function() {
    sketch.calculateBoxSize();
    sketch.resizeCanvas(sketch.gridContainer.width, sketch.gridContainer.height);
  }
};

let TileSketch = function(sketch) {
  sketch.canvasContainer = null;
  sketch.tileContainer = null;

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

    let tileCanvas = sketch.createCanvas(sketch.canvasContainer.width, sketch.canvasContainer.height, sketch.WEBGL);
    tileCanvas.parent(sketch.canvasContainer);
    tileCanvas.class('tile-canvas');

    sketch.calculateTileSize();
    loadTilepaths();
  }

  sketch.calculateTileSize = function() {
    tileSize = sketch.tileContainer.width / 2.5;
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
      currentTile = sketch.loadImage(currentFilepath, function(img) {
        img.resize(300, 0);
      });
    } else {
      currentTile = '';
    }
  }

  sketch.draw = function() {
    sketch.clear();

    if(!dragging){
      offsetX = -sketch.width / 2.5;
      offsetY = -sketch.height / 2.5;
    }

    sketch.translate(offsetX, offsetY);

    if (currentTile) {
        sketch.image(currentTile, 0, 0);
    }
  }

  sketch.mousePressed = function() {
    let d = sketch.dist(sketch.mouseX, sketch.mouseY, sketch.canvasContainer.width / 2 - (sketch.width / 3), sketch.canvasContainer.height / 2);
    if (d < tileSize) {
        dragging = true;
    }
    return false;
  }

sketch.mouseDragged = function() {
    if (dragging) {
        offsetX = sketch.mouseX - sketch.width / 1.5;
        offsetY = sketch.mouseY - sketch.height / 1.5;
        return false;
    }
  }

    // Loop through grid sketches and check for collision
    // for (let i = 0; i < gridSketch.cols * gridSketch.rows; i++) {
    //   let gridX = i % gridSketch.cols * gridSketch.boxSize;
    //   let gridY = Math.floor(i / gridSketch.cols) * gridSketch.boxSize * sketch.cos(sketch.radians(gridSketch.rotationAngle));
    //   let gridWidth = gridSketch.boxSize;
    //   let gridHeight = gridSketch.boxSize;
    //
    //   // Check collision with current grid box
    //   if (sketch.collidePointRect(sketch.mouseX, sketch.mouseY, gridX, gridY, gridWidth, gridHeight)) {
    //     // Collision detected with grid box i
    //     gridSketch.setCollisionStatus(i, true);
    //   } else {
    //     // No collision detected, reset collision status for this box
    //     gridSketch.setCollisionStatus(i, false);
    //   }
    // }


  sketch.mouseReleased = function() {
    placedTilePath = currentFilepath;
    if(placed){
      loadNextTile();
    }

    // if(!modal){
    //   modal = showModal();
    // }
      dragging = false;
      placed = false;
      offsetX = 0;
      offsetY = 0;
  }

  sketch.windowResized = function() {
    sketch.calculateTileSize();
    sketch.resizeCanvas(sketch.canvasContainer.width, sketch.canvasContainer.height);
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

  window.addEventListener('resize', function () {
    "use strict";
    window.location.reload();
});
});



