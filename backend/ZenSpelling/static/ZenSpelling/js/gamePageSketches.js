let gridSketch;
let tileSketch;
let tileStack = [];
let currentTile;
let currentFilepath;
let placedTilePath;
let dataArray = {};
let tileSize = 0;
let placed = false;
let xShift, yShift;
let tileLeftOffset, gridLeftOffset, tileGridOffsetDiff;
let dragging= false;
let gridDimension;

// Creating the sketch of the game-board.
let GridSketch = function(sketch) {
  sketch.gridContainer = null;
  sketch.boxSize = 0;

  /* Initial setup, defines html elements that will bound the canvas.
  ** Define the size of each grid box based on canvas size.
  ** Build out the json array that will hold metadata for each grid box.
  */
  sketch.setup = function() {
    sketch.canvasContainer = sketch.select('#canvas-container');
    sketch.gridContainer = sketch.select('#grid-container');

    let gridCanvas = sketch.createCanvas(sketch.gridContainer.width, sketch.gridContainer.height, sketch.WEBGL);

    gridCanvas.parent(sketch.canvasContainer);
    gridCanvas.class('grid-canvas');

    // Determines the width & height of the game board. Hard-coded for now.
    // TODO : Parameterize this based on user board-size choice.
    gridDimension = 4;

    sketch.calculateBoxSize();
    sketch.buildDataArray();
  }

  sketch.calculateBoxSize = function() {
    sketch.boxSize = sketch.gridContainer.height * 0.9 / gridDimension;
    xShift = sketch.gridContainer.width/2 + sketch.boxSize/2;
    yShift = sketch.gridContainer.height/2 + sketch.boxSize/2;
  }

  // This array will be the main reference for the program to determine how to handle each grid box.
  sketch.buildDataArray = function() {
    for (let i = 0; i < gridDimension; i++) {
      for(let j = 0; j < gridDimension; j++){
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

  // The method that draws each grid box.
  sketch.draw = function() {
    sketch.clear();

    for (let i = 0; i < gridDimension; i++) {
      for (let j = 0; j < gridDimension; j++) {
        let x = dataArray[i + '' + j].x = (i * sketch.boxSize) - (gridDimension/2 * sketch.boxSize);
        let y = dataArray[i + '' + j].y = (j * sketch.boxSize) - (gridDimension/2 * sketch.boxSize);

        sketch.drawBox(x, y, sketch.boxSize, dataArray[i + '' + j].model, dataArray[i + '' + j].collision);
      }
    }
  }

  // This determines if the grid box remains a box, or is a placed tile image.
  // It also determines if a grid box is highlighted when hovered over.
  sketch.drawBox = function(x, y, size, model, collision) {
    sketch.push();

    if(collision === true){
      sketch.fill('rgb(210,179,25)');
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

  // Decides if an image needs to be loaded in the metadata array when user releases cursor.
  sketch.mouseReleased = function() {
    let valid;
    for(let i = 0; i < gridDimension; i++){
      for(let j = 0; j < gridDimension; j++){
        // Saving this equation for now in case it is needed later.
        // let d = sketch.dist(sketch.mouseX, sketch.mouseY, dataArray[i + '' + j].x + xShift, dataArray[i + '' + j].y + yShift);

        valid = dataArray[i + '' + j].collision && dataArray[i + '' + j].model === '';
        console.log('Placed1: ', placed);
        if (valid) {
          placed = true;
          dataArray[i + '' + j].model = sketch.loadImage(currentFilepath, function (img) {
            img.resize(sketch.boxSize, 0);
          });
        }
      }
    }
  }

  // Dynamic window resizing.
  sketch.windowResized = function() {
    sketch.calculateBoxSize();
    sketch.resizeCanvas(sketch.gridContainer.width, sketch.gridContainer.height);
  }
};

// Creating a sketch of the current tile to be placed.
let TileSketch = function(sketch) {
  sketch.canvasContainer = null;
  sketch.tileContainer = null;

  let offsetX = 0;
  let offsetY = 0;
  let modal = false;

  sketch.preload = function() {
    loadTilepaths()
  }

  /*
  ** Same as GridSketch.setup(), with additional math to calculate position offset of the tile.
   */
  sketch.setup = function() {
    sketch.canvasContainer = sketch.select('#canvas-container');
    sketch.tileContainer = sketch.select('#tile-container');

    let tileCanvas = sketch.createCanvas(sketch.canvasContainer.width, sketch.canvasContainer.height, sketch.WEBGL);
    tileCanvas.parent(sketch.canvasContainer);
    tileCanvas.class('tile-canvas');

    tileLeftOffset = parseFloat(window.getComputedStyle(document.getElementById("grid-container"))
              .getPropertyValue("left"));
    gridLeftOffset = parseFloat(window.getComputedStyle(document.getElementById("tile-container"))
              .getPropertyValue("left"));
    tileGridOffsetDiff = tileLeftOffset - gridLeftOffset + gridSketch.gridContainer.width/2 + gridSketch.boxSize/2;

    sketch.calculateTileSize();
    loadTilepaths();
  }

  sketch.calculateTileSize = function() {
    tileSize = sketch.tileContainer.width * 0.80;
  }

  // Fetch tilepath endpoints and load them in a stack.
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
        img.resize(tileSize, 0);
      });
    } else {
      currentTile = '';
    }
  }

  // This draws the tile sketch.
  sketch.draw = function() {
    sketch.clear();

    if(!dragging){
      offsetX = -sketch.width / 2.1;
      offsetY = -sketch.height / 3;
    }

    sketch.translate(offsetX, offsetY);

    if (currentTile) {
        sketch.image(currentTile, 0, 0);
    }
  }

  // This activates dragging toggle if cursor is in range of the tile.
  sketch.mousePressed = function() {
    let d = sketch.dist(sketch.mouseX, sketch.mouseY, sketch.tileContainer.width / 2, sketch.tileContainer.height / 2);
    if (d < tileSize) {
        dragging = true;
    }
    return false;
  }

  // Constant recalculation of tile position when dragging.
  // Checks for collision with grid boxes.
  sketch.mouseDragged = function() {
    if (dragging) {
      offsetX = sketch.mouseX - sketch.width/1.8;
      offsetY = sketch.mouseY - sketch.height/1.2;

      for (let i = 0; i < gridDimension; i++) {
        for (let j = 0; j < gridDimension; j++){
          let d = sketch.dist(sketch.mouseX, sketch.mouseY, dataArray[i + '' + j].x + tileGridOffsetDiff, dataArray[i + '' + j].y + yShift);
          dataArray[i + '' + j].collision = d < tileSize/4;
        }
      }
      return false;
    }
  }

  // Loads next tile in stack if current tile is successfully placed. Question modal is shown.
  sketch.mouseReleased = function() {
    placedTilePath = currentFilepath;
    if(placed){
      loadNextTile();
    }

    if(!modal){
      modal = showModal();
    }

    dragging = false;
    placed = false;
    offsetX = 0;
    offsetY = 0;
  }

  // Dynamic window resizing.
  sketch.windowResized = function() {
    sketch.calculateTileSize();
    sketch.resizeCanvas(sketch.canvasContainer.width, sketch.canvasContainer.height);
  }
}

// Fetches question/answers to populate modal.
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

// Waits to create sketches until after DOM is loaded. This mitigates lag.
document.addEventListener("DOMContentLoaded", function() {
  gridSketch = new p5(GridSketch);
  tileSketch = new p5(TileSketch);

  const openModalBtn = document.getElementById('openModalBtn');
  const modal = document.getElementById('modal');
  const closeModalBtn = modal.querySelector('.close');

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

// Dynamic window resizing.
// TODO : This currently works, except it does not preserve the game board state on reload.
//  Possible solution: Use cookie to save game state.
window.addEventListener('resize', function () {
    window.location.reload();
});
