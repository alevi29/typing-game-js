var WIDTH = window.innerWidth - 20;
var HEIGHT = window.innerHeight - 20;
var inStartMenu = true;
var inSettings = false;
var inGame = false;
var wordRate = 1.0;
var minWordLength = 3;
var maxWordLength = 7;

function inputHandler(event) {
    if (inStartMenu) {
        if (event.key == "ArrowDown" || event.key == "ArrowUp") {
            if (START.inFocus) {
                START.inFocus = false;
                SETTINGS.inFocus = true;
            }

            else {
                SETTINGS.inFocus = false;
                START.inFocus = true;
            }
        }

        if (event.key == "Enter") {
            if (START.inFocus) {
                inGame = true;
                inStartMenu = false;
            }

            else {
                inSettings = true;
                inStartMenu = false;
            }
        }
    }

    else if (inSettings) {
        if (event.key == "ArrowDown" || event.key == "ArrowUp") {
            if (NORMAL.inFocus) {
                NORMAL.inFocus = false;
                HARD.inFocus = true;
                wordRate = 1.0;
                minWordLength = 3;
                maxWordLength = 7;
            }

            else {
                HARD.inFocus = false;
                NORMAL.inFocus = true;
                wordRate = 1.5;
                minWordLength = 5;
                maxWordLength = 13;
            }
        }

        if (event.key == "Enter") {
            inStartMenu = true;
            inSettings = false;
        }
    }
}

document.addEventListener('keydown', inputHandler);

// initialize canvas
var canvas = document.getElementById("canvas");
canvas.width = WIDTH;
canvas.height = HEIGHT;
var context = canvas.getContext("2d");

// word class
class Word {
    constructor(xPos, yPos, text, isButton, inFocus) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.text = text;
        this.complete = false;
        this.isButton = isButton;
        this.inFocus = inFocus;
    }

    renderWord() {
        if (this.complete) {

        }
    }

    renderButton() {
        context.fillStyle = this.inFocus ? "green" : "white";
        context.strokeStyle = "white";
        context.textAlign = "center";
        context.font = "48px Courier New";
        context.fillText(this.text, this.xPos, this.yPos);
    }
}

// initialize menu buttons
const START = new Word(WIDTH / 2, -((HEIGHT - HEIGHT / 8) - (HEIGHT - HEIGHT / 4)) - 100, "START", true, true);
const SETTINGS = new Word(WIDTH / 2, -100, "SETTINGS", true, false);
const NORMAL = new Word(WIDTH / 2, HEIGHT - 2 * (HEIGHT / 8), "NORMAL", true, true);
const HARD = new Word(WIDTH / 2, HEIGHT - 1 * (HEIGHT / 8), "HARD", true, false);


// handle initial load animation
function menuInit() {
    context.clearRect(0, 0, WIDTH, HEIGHT);
    if (START.yPos < (HEIGHT - HEIGHT / 4)) {
        START.yPos += 10;
        SETTINGS.yPos += 10;
        START.renderButton();
        SETTINGS.renderButton();
    }

    else {
        clearInterval(initInterval);
    }
}

const initInterval = setInterval(menuInit, 12);

menuInit();

// main game loop
function gameLoop() {
    // clear context and fill background
    context.clearRect(0, 0, WIDTH, HEIGHT);
    if (context) {
        context.fillStyle = "black";
        context.fillRect(0, 0, WIDTH, HEIGHT);
    }

    // render start buttons if we are in start menu
    if (inStartMenu) {
        START.renderButton();
        SETTINGS.renderButton();
    }

    else if (inSettings) {
        NORMAL.renderButton();
        HARD.renderButton();
    }


    else if (inGame) {

    }

    requestAnimationFrame(gameLoop)
}

requestAnimationFrame(gameLoop);


