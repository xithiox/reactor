//////////////////////
// Configuration    //
//////////////////////

// Rendering
const CELLSIZE = 20;            // length of each side of a cell
const NSIZE = 10;               // diameter of neutrons
const CANVAS_HEIGHT = 400;      // height of canvas

// Functionality
const ABSORBER_CHANCE = 5;      // chance for an absorber to absorb a neutron

const FUEL_ABSORB_CHANCE = 5;   // chance for a fuel cell to absorb a neutron
const N_SPONT_CHANCE = 0.25;    // spontaneous neutron emission chance
const NSPAWN_MIN = 1;           // Min number of neutrons from reaction
const NSPAWN_MAX = 3;           // Max number of neutrons from reaction

const NSPEED_MIN = 1;           // Min neutron speed
const NSPEED_MAX = 10;          // Max neutron speed


// Global variables
var canvas;

var cols;
var rows;

var grid;
var neutrons;


//////////////////////////////
//  Resetting simulation    //
//////////////////////////////


function initCanvas() {
    var w = document.getElementById("sketch-container").offsetWidth;
    canvas = createCanvas(w, CANVAS_HEIGHT);
    canvas.parent("sketch-container");
}

function initGrid() {
    cols = floor(width / CELLSIZE);
    rows = floor(height / CELLSIZE);

    grid = new Array(cols);
    for (var i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
    }
}

function initNeutrons() {
    neutrons = [];
}

function placeTiles() {
    for (var x = 0; x < cols; x++) {
        for (var y = 0; y < rows; y++) {
            grid[x][y] = new Moderator(x, y);
            if (random(100) < 20) {
                grid[x][y] = new Fuel(x, y, 50);
            }
        }
    }

    for (var x = 0; x < cols; x++) {
        grid[x][0] = new Reflector(x, 0);
        grid[x][8] = new Absorber(x, 8);
        grid[x][9] = new Absorber(x, 9);
        grid[x][10] = new Absorber(x, 10);
    }
}


//////////////////////////////
//  Misc. custom functions  //
//////////////////////////////


function glow(x, y, diameter, color) {
    for (var i = 0; i < 10; i++) {
        fill(color.r, color.g, color.b, round(255/10));
        noStroke();
        ellipse(x, y, (diameter/10)*(i+1), (diameter/10)*(i+1));
    }
}

function plusOrMinus() {
    return round(random()) * 2 - 1;
}

function removeNeutron(n) {
    var index = neutrons.indexOf(n);

    if (index > -1) {
        neutrons.splice(index, 1);
    }
}


//////////////////////////////////
//  p5.js built-in functions    //
//////////////////////////////////


function setup() {
    initCanvas();
    initGrid();
    initNeutrons();

    placeTiles();
}

function draw() {
    background(242, 241, 239);

    for (var x = 0; x < cols; x++) {
        for (var y = 0; y < rows; y++) {
            grid[x][y].update();
            grid[x][y].display();
        }
    }

    for (var i = 0; i < neutrons.length; i++) {
        neutrons[i].update();
        if (neutrons[i].checkEdges()) {
            removeNeutron(neutrons[i]);
            continue;
        }

        var c = neutrons[i].currentTile();
        if (grid[c.x][c.y].onReact(neutrons[i])) {
            continue;
        }

        neutrons[i].display();
    }

    console.log(neutrons.length);
}

// Press the spacebar to reset the simulation
function keyPressed() {
    // Spacebar pressed
    if (keyCode === 32) {
        initGrid();
        initNeutrons();

        placeTiles();
        placeNeutrons();
    }
}

// Fit grid to screen
function windowResized() {
    var w = document.getElementById("sketch-container").offsetWidth;
    resizeCanvas(w, CANVAS_HEIGHT);

    initGrid();
    initNeutrons();

    placeTiles();
    placeNeutrons();
}
