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
let shiftX, shiftY;

let GridSketch = function(sketch) {
  sketch.gridContainer = null;
  sketch.cols = 4;
  sketch.rows = 4;
  sketch.boxSize = 0;

  sketch.setup = function() {
    sketch.canvasContainer = sketch.select('#canvas-container');
    sketch.gridContainer = sketch.select('#grid-container');

    let gridCanvas = sketch.createCanvas(sketch.gridContainer.width, sketch.gridContainer.height, sketch.WEBGL);

    gridCanvas.parent(sketch.canvasContainer);
    gridCanvas.class('grid-canvas');

    sketch.calculateBoxSize();

    for (let i = 0; i < sketch.cols; i++) {
      for(let j = 0; j < sketch.rows; j++){
        let key = i.toString() + j.toString();
        dataArray[key] = {
          x: "0",
          y: "0",
          collision: false,
          model : ""
        };
      }
    }
  }

  sketch.calculateBoxSize = function() {
    sketch.boxSize = sketch.gridContainer.height * 0.9 / sketch.cols;
  }

  sketch.draw = function() {
    sketch.clear();

    for (let i = 0; i < sketch.cols; i++) {
      for (let j = 0; j < sketch.rows; j++) {
        let x = (i * sketch.boxSize) - (sketch.rows/2 * sketch.boxSize);
        let y = (j * sketch.boxSize) - (sketch.cols/2 * sketch.boxSize);

        dataArray[i + '' + j].x = x;
        dataArray[i + '' + j].y = y;

        sketch.drawBox(x, y, sketch.boxSize, dataArray[i + '' + j].model, dataArray[i + '' + j].collision);
      }
    }
  }

  sketch.drawBox = function(x, y, size, model, collision) {
    sketch.push();

    if(collision === true){
      console.log('collision');
      sketch.fill('rgba(175,155,29,0.5)');
    } else {
      sketch.fill('rgba(255,255,255,0.10)');
    }

    if (model) {
      sketch.image(model, x, y);
    } else {
      sketch.square(x, y, size);
    }

    sketch.pop();
  }

  sketch.setCollisionStatus = function(index, status) {
    gridCollisions[index] = status;
  }

  sketch.mouseReleased = function() {
    let gridSize = Object.keys(dataArray).length;
    let xShift = sketch.gridContainer.width/2 + sketch.boxSize/2;
    let yShift = sketch.gridContainer.height/2 + sketch.boxSize/2;

    for(let i = 0; i < Math.sqrt(gridSize); i++){
      for(let j = 0; j < Math.sqrt(gridSize); j++){
        let d = sketch.dist(sketch.mouseX, sketch.mouseY, dataArray[i + '' + j].x + xShift, dataArray[i + '' + j].y + yShift);

        if (d < tileSize/2 && dataArray[i + '' + j].model === '') {
          dataArray[i + '' + j].model = sketch.loadImage(currentFilepath, function (img) {
            img.resize(sketch.boxSize, 0);
            placed = true;
          });
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
        img.resize(250, 0);
      });
    } else {
      currentTile = '';
    }
  }

  sketch.draw = function() {
    sketch.clear();

    if(!dragging){
      offsetX = -sketch.width / 2.35;
      offsetY = -sketch.height / 3;
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
        offsetX = sketch.mouseX - sketch.width/1.8;
        offsetY = sketch.mouseY - sketch.height/1.2;
        return false;
    }

    let gridSize = Object.keys(dataArray).length;

    for (let i = 0; i < gridSketch.cols * gridSketch.rows; i++) {
      for (let j = 0; j < Math.sqrt(gridSize); j++){
        let d = sketch.dist(sketch.mouseX, sketch.mouseY, dataArray[i + '' + j].x + shiftX, dataArray[i + '' + j].y + shiftY);
        dataArray[i + '' + j].collision = d < tileSize;
      }
    }
  }


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
}

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

window.addEventListener('resize', function () {
    window.location.reload();
  });
