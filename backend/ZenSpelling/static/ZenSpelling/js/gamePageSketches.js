let gridSketch;
let tileSketch;

function setup() {
  gridSketch = new p5(GridSketch);
}

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
    gridCanvas.class('sketch-canvas2');
  }

  sketch.draw = function() {
    sketch.background("#228B22FF");
    sketch.translate(0, -200, -200);

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
  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;
  let rotationAngle = 0;

  sketch.setup = function() {
    sketch.canvasContainer = sketch.select('#canvas-container');
    sketch.tileContainer = sketch.select('#tile-container');
    sketch.tileSize = sketch.tileContainer.width / 2;

    let tileCanvas = sketch.createCanvas(sketch.canvasContainer.width, sketch.canvasContainer.height, sketch.WEBGL);
    tileCanvas.parent(sketch.canvasContainer);
    tileCanvas.class('sketch-canvas');
  }

  sketch.draw = function() {
    sketch.clear();
    // sketch.background("pink");

    if(!dragging){
      sketch.offsetX = sketch.canvasContainer.width/3;
      sketch.translate(sketch.offsetX * -1, sketch.offsetY);
      rotationAngle = sketch.frameCount * 0.0125;
      sketch.rotateY(rotationAngle);
    }

    sketch.rotateX(sketch.radians(40));
    sketch.fill('#6C3413FF');

    sketch.box(sketch.tileSize, sketch.tileSize, sketch.tileSize / 2);
  }

  sketch.mousePressed = function() {
    let d = sketch.dist(sketch.mouseX, sketch.mouseY, sketch.width / 2, sketch.height / 2);
    if (d < sketch.tileSize / 2) {
      dragging = true;
      sketch.offsetX = sketch.mouseX;
      sketch.offsetY = sketch.mouseY;
    }
  }

  sketch.mouseDragged = function() {
    if (dragging) {
      sketch.offsetX = sketch.mouseX - sketch.width / 2;
      sketch.offsetY = sketch.mouseY - sketch.height / 2;
    }
  }

  sketch.mouseReleased = function() {
    dragging = false;
    sketch.offsetX = sketch.canvasContainer.width/3;
    sketch.offsetY = 0;
  }
};

document.addEventListener("DOMContentLoaded", function() {
  tileSketch = new p5(TileSketch);
});
