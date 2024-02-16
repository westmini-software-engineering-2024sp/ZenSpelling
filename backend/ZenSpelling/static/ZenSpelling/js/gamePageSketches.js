let gridSketch;
let tileSketch;

function setup() {
  gridSketch = new p5(GridSketch);
  tileSketch = new p5(TileSketch);
}

let GridSketch = function(sketch) {
  sketch.gridContainer = null;
  sketch.cols = 3;
  sketch.rows = 3;
  sketch.boxSize = 0;
  sketch.rotationAngle = 40;

  sketch.setup = function() {
    sketch.gridContainer = select('#grid-container');
    sketch.boxSize = sketch.gridContainer.width / 4;
    let gridCanvas = sketch.createCanvas(sketch.gridContainer.width, sketch.gridContainer.height, sketch.WEBGL);
    gridCanvas.parent(sketch.gridContainer);
  }

  sketch.draw = function() {
    sketch.background("#228B22FF");
    sketch.translate(0, -100, 0);

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
  sketch.tileContainer = null;
  sketch.tileSize = 0;

  sketch.setup = function() {
    sketch.tileContainer = select('#tile-container');
    sketch.tileSize = sketch.tileContainer.width / 3;
    let tileCanvas = sketch.createCanvas(sketch.tileContainer.width, sketch.tileContainer.height, sketch.WEBGL);
    tileCanvas.parent(sketch.tileContainer);
  }

  sketch.draw = function() {
    sketch.background("#228B22FF");

    sketch.rotateY(sketch.frameCount * 0.0125);
    sketch.rotateX(45);
    sketch.fill('#6C3413FF');
    sketch.box(sketch.tileSize, sketch.tileSize, sketch.tileSize / 2);
  }
};
