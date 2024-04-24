let gridSketch;
let tileSketch;
let tileStack = JSON.parse(localStorage.getItem('tileBank')) || [];
let currentTile;
let currentFilepath;
let numericDigits;
let newFilePath;
let placedTilePath;
let dataArray = {};
let tileSize = 0;
let placed = false;
let xShift, yShift;
let tileLeftOffset, tileTopOffset, gridLeftOffset, tileGridOffsetDiff;
let dragging = false;
let gridDimension;
let pulse = 1.0;
let oscillatePulse = 1;
let modal = false;
let newRow, newCol;

// Creating the sketch of the game-board.
let GridSketch = function (sketch) {
    sketch.gridContainer = null;
    sketch.boxSize = 0;

    /* Initial setup, defines html elements that will bound the canvas.
    ** Define the size of each grid box based on canvas size.
    ** Build out the json array that will hold metadata for each grid box.
    */
    sketch.setup = function () {
        sketch.canvasContainer = sketch.select('#canvas-container');
        sketch.gridContainer = sketch.select('#grid-container');

        let gridCanvas = sketch.createCanvas(sketch.gridContainer.width, sketch.gridContainer.height, sketch.WEBGL);

        gridCanvas.parent(sketch.canvasContainer);
        gridCanvas.class('grid-canvas');

        gridDimension = localStorage.getItem('boardsize');

        sketch.calculateBoxSize();
        sketch.buildDataArray();

        // Construct image grid to accept placed tiles.
        let tileGrid = document.getElementById('img-grid');
        tileGrid.style.gridTemplateColumns = `repeat(${gridDimension}, auto)`;
        for(let i = 0; i < gridDimension; i++){
            for(let j = 0; j < gridDimension; j++){
                const img = document.createElement('img')
                img.id = 'grid' + j + '' + i;
                img.width = sketch.boxSize;
                img.height = sketch.boxSize;
                tileGrid.appendChild(img);
            }
        }
    }

    sketch.calculateBoxSize = function () {
        sketch.boxSize = sketch.gridContainer.height * 0.9 / gridDimension;
        xShift = sketch.gridContainer.width / 2 + sketch.boxSize / 2;
        yShift = sketch.gridContainer.height / 2 + sketch.boxSize / 2;
    }

    // This array will be the main reference for the program to determine how to handle each grid box.
    sketch.buildDataArray = function () {
        for (let i = 0; i < gridDimension; i++) {
            for (let j = 0; j < gridDimension; j++) {
                let key = i.toString() + j.toString();
                dataArray[key] = {
                    x: "0",
                    y: "0",
                    collision: false,
                    model: "",
                    weed: false
                };
            }
        }
    }

    // The method that draws each grid box.
    sketch.draw = function () {
        sketch.clear();

        for (let i = 0; i < gridDimension; i++) {
            for (let j = 0; j < gridDimension; j++) {
                let x = dataArray[i + '' + j].x = (i * sketch.boxSize) - (gridDimension / 2 * sketch.boxSize);
                let y = dataArray[i + '' + j].y = (j * sketch.boxSize) - (gridDimension / 2 * sketch.boxSize);

                sketch.drawBox(x, y, sketch.boxSize, dataArray[i + '' + j].model, dataArray[i + '' + j].collision, dataArray[i + '' + j].weed);
            }
        }
    }

    // This determines if the grid box remains a box, or is a placed tile image.
    // It also determines if a grid box is highlighted when hovered over.
    sketch.drawBox = function (x, y, size, model, collision) {
        sketch.push();

        if (collision === true && !model) {
            sketch.fill('rgb(231,193,22)');
        } else {
            sketch.fill('rgba(255,255,255,0.10)');
        }

        if (!model) {
            sketch.square(x, y, size);
        }

        sketch.pop();
    }

    // Opens the question modal if weed tile is clicked.
    sketch.mousePressed = function() {
        for (let i = 0; i < gridDimension; i++) {
            for (let j = 0; j < gridDimension; j++) {
                let d = sketch.dist(sketch.mouseX, sketch.mouseY,
                    dataArray[i + '' + j].x + gridSketch.gridContainer.width/2 + sketch.boxSize/2,
                    dataArray[i + '' + j].y + gridSketch.gridContainer.height/2 + sketch.boxSize/2);
                if(d < sketch.boxSize/2 && dataArray[i + '' + j].weed && !modal){
                    playSound('release-sound').play();
                    newRow = i;
                    newCol = j;
                    modal = true;
                    showModal();
                }
            }
        }
    }

    // Decides if an image needs to be loaded in the metadata array when user releases cursor.
    sketch.mouseReleased = function () {
        let valid;
        for (let i = 0; i < gridDimension; i++) {
            for (let j = 0; j < gridDimension; j++) {
                // Saving this equation for now in case it is needed later.
                // let d = sketch.dist(sketch.mouseX, sketch.mouseY, dataArray[i + '' + j].x + xShift, dataArray[i + '' + j].y + yShift);

                valid = dataArray[i + '' + j].collision && dataArray[i + '' + j].model === '';
                if (valid) {
                    placed = true;

                    // Extract numeric digits from currentFilePath.
                    numericDigits = currentFilepath.match(/\d+/)[0];
                    // Construct the new filepath pointing to the Tile's matching GridTile.
                    newFilePath = `/static/Assets/GridTiles/gridTile${numericDigits}.png`;

                    newRow = i;
                    newCol = j;
                    dataArray[i + '' + j].model = sketch.loadImage(newFilePath, function (img) {
                        img.resize(sketch.boxSize, 0);
                    });
                    let tilePlace = document.getElementById('grid' + i + '' + j);
                    console.log('grid' + i + '' + j);
                    tilePlace.src = newFilePath;
                }
            }
        }
    }

    // Dynamic window resizing.
    sketch.windowResized = function () {
        sketch.calculateBoxSize();
        sketch.resizeCanvas(sketch.gridContainer.width, sketch.gridContainer.height);
    }
};

// Creating a sketch of the current tile to be placed.
let TileSketch = function (sketch) {
    sketch.canvasContainer = null;
    sketch.tileContainer = null;

    let offsetX = 0;
    let offsetY = 0;

    /*
    ** Same as GridSketch.setup(), with additional math to calculate position offset of the tile.
     */
    sketch.setup = function () {
        sketch.canvasContainer = sketch.select('#canvas-container');
        sketch.tileContainer = sketch.select('#tile-container');

        let tileCanvas = sketch.createCanvas(sketch.canvasContainer.width, sketch.canvasContainer.height, sketch.WEBGL);
        tileCanvas.parent(sketch.canvasContainer);
        tileCanvas.class('tile-canvas');

        tileTopOffset = parseFloat(window.getComputedStyle(document.getElementById("grid-container"))
            .getPropertyValue("top"));
        tileLeftOffset = parseFloat(window.getComputedStyle(document.getElementById("grid-container"))
            .getPropertyValue("left"));
        gridLeftOffset = parseFloat(window.getComputedStyle(document.getElementById("tile-container"))
            .getPropertyValue("left"));
        tileGridOffsetDiff = tileLeftOffset - gridLeftOffset + gridSketch.gridContainer.width / 2 + gridSketch.boxSize / 2;

        sketch.calculateTileSize();
        loadNextTile();
    }

    sketch.calculateTileSize = function () {
        tileSize = sketch.tileContainer.width * 0.80;
    }

    /* Fetch tilepaths from endpoint and load them in a stack.
    ** This will fetch repeat tiles to compensate for a smaller tile count vs. grid size.
    ** (We may not need that logic if we have 25+ tile assets).
     */
    function loadNextTile() {
        if (tileStack.length > 0) {
            currentFilepath = tileStack.pop();
            currentTile = sketch.loadImage(currentFilepath, function (img) {
                img.resize(tileSize, 0);
            });
            localStorage.setItem('tileBank', JSON.stringify(tileStack));
        } else {
            console.log("No more tiles in the stack.");
            currentTile = '';
        }
    }

    // do this ONLY if you need to read the next tile but do not need to remove it from the stack
    function loadNextTileInStack() {
        if (tileStack.length > 0) {
            currentFilepath = tileStack.pop();
            currentTile = sketch.loadImage(currentFilepath, function (img) {
                img.resize(tileSize, 0);
            });
        } else {
            console.log("No more tiles in the stack.");
            currentTile = '';
        }
    }

    // This draws the tile sketch. Includes pulsing animations.
    sketch.draw = function () {
        sketch.clear();

        if (!dragging) {
            offsetX = -sketch.width / 2.1;
            offsetY = -sketch.height / 3;
            if (pulse > 1.03) {
                oscillatePulse = 0;
            } else if (pulse < 0.96) {
                oscillatePulse = 1;
            }

            if (oscillatePulse === 1) {
                pulse += 0.002;
            } else if (oscillatePulse === 0) {
                pulse -= 0.001;
            }
        }

        sketch.translate(offsetX, offsetY);

        if (currentTile) {
            if (dragging) {
                if (pulse > 1.09) {
                    oscillatePulse = 0;
                } else if (pulse < 0.91) {
                    oscillatePulse = 1;
                }

                if (oscillatePulse === 1) {
                    pulse += 0.008;
                } else if (oscillatePulse === 0) {
                    pulse -= 0.004;
                }
            }
            sketch.image(currentTile, 0, 0, 0, currentTile.height * pulse);
        }
    }

    // This activates dragging toggle if cursor is in range of the tile.
    sketch.mousePressed = function () {
        let d = sketch.dist(sketch.mouseX, sketch.mouseY, sketch.tileContainer.width / 2, sketch.tileContainer.height / 2);

        if (d < tileSize && !modal) {
            playSound('click-sound').play();
            dragging = true;
        }
        return false;
    }

    // Constant recalculation of tile position when dragging.
    // Checks for collision with grid boxes.
    sketch.mouseDragged = function () {
        if (dragging && !modal) {
            offsetX = sketch.mouseX - sketch.width / 1.8;
            offsetY = sketch.mouseY - sketch.height / 1.2;

            for (let i = 0; i < gridDimension; i++) {
                for (let j = 0; j < gridDimension; j++) {
                    let d = sketch.dist(sketch.mouseX, sketch.mouseY, dataArray[i + '' + j].x + tileGridOffsetDiff, dataArray[i + '' + j].y + yShift);
                    dataArray[i + '' + j].collision = d < tileSize/6;
                }
            }
            return false;
        }
    }

    // Loads next tile in stack if current tile is successfully placed. Question modal is shown.
    sketch.mouseReleased = function () {
        placedTilePath = currentFilepath;
        if (placed) {
            playSound('release-sound').play();
            modal = true;
            showModal();
            loadNextTileInStack();
        }

        dragging = false;
        placed = false;
        pulse = 1.0;
        oscillatePulse = 1;
        offsetX = 0;
        offsetY = 0;
    }

    // Dynamic window resizing.
    sketch.windowResized = function () {
        sketch.calculateTileSize();
        sketch.resizeCanvas(sketch.canvasContainer.width, sketch.canvasContainer.height);
    }
}

// Fetches question/answers to populate modal.
function showModal() {
    $.ajax({
        url: '../ZenSpelling/' + getGeneratedQuestion(),
        method: 'GET',
        success: function (response) {
            $('#myModal').html(response)
                .css('display', 'block');
        }
    });

    $('.close').click(function () {
        $('#myModal').css('display', 'none');
    });
}

// From the localStorage questionBank, it gets the next question
function getGeneratedQuestion() {
    var question = JSON.parse(localStorage.getItem('questionBank'));
    var index = localStorage.getItem('questionNumber');
    var nextIndex = JSON.parse(localStorage.getItem('questionNumber'));
    localStorage.setItem('questionNumber', (nextIndex + 1));
    return question[index];
}

/*
** Document/Window Event Listeners
 */
createGamePageOnDomLoaded();
resizeBoardElementsOnScreenResize();
hideLoadingScreenOnWindowLoad();

/*
** Below this point are all the helper function definitions.
 */
function createGamePageOnDomLoaded(){
    document.addEventListener("DOMContentLoaded", function () {
        gridSketch = new p5(GridSketch);
        tileSketch = new p5(TileSketch);

        toggleMusic("background-music");

         const modal = document.getElementById('modal');
         modal.style.display = 'block';

         showModalOnClick();
    });
}

function showModalOnClick(){
    window.addEventListener('click', (event) => {if (event.target === modal) {
    } else {
        modal.style.display = 'none';
    }
    });
}

// TODO : This currently works, except it does not preserve the game board state on reload.
//  Possible solution: Use cookie to save game state.
function resizeBoardElementsOnScreenResize(){
    window.addEventListener('resize', function () {
    window.location.reload();
    });
}

function hideLoadingScreenOnWindowLoad(){
    window.addEventListener('load', function () {
    let loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.add("fadeOut");
    setTimeout(function() {
            loadingScreen.style.display = 'none'; // Hide loading screen when page is loaded
            }, 1000);
    });
}
