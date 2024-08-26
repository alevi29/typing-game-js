// TODO: add wpm, score, current input, etc.
import { wordList } from "./words";
var WIDTH = window.innerWidth - 20;
var HEIGHT = window.innerHeight - 20;
var inStartMenu = true;
var inSettings = false;
var inGame = false;
var gameOver = false;
var lowest = 0;
var wordRate = 1.0;
var minWordLength = 3;
var maxWordLength = 7;
var curWordIndex = 0;
var curWord = "";
var curInput = "";
var dropRate = 1.0;

// initialize word array (in game)
var words = new Set();
var wordsQueue = [];
var queueIndex = 0;

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
                spawnRateInterval = setInterval(rampingDifficulty, 2000);
                wordCreationInterval = setInterval(createWord, 1000);
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
                if (event.key == "Enter") {
                    wordRate = 1.0;
                    minWordLength = 3;
                    maxWordLength = 7;
                }
            }

            else {
                HARD.inFocus = false;
                NORMAL.inFocus = true;
                if (event.key == "Enter") {
                    wordRate = 0.7;
                    minWordLength = 5;
                    maxWordLength = 13;
                }
            }
        }

        if (event.key == "Enter" || event.key == "Escape") {
            inStartMenu = true;
            inSettings = false;
        }
    }

    else if (inGame) {
        if (event.key == "Backspace") {
            if (curWordIndex > 0) {
                curWordIndex--;
            }

            if (curInput != "") {
                curInput = curInput.slice(0, -1);
            }
        }
        // if key pressed is an alphabetical character
        else if (event.keyCode >= 65 && event.keyCode <= 90 && curInput.length < curWord.length) {
            // append pressed character to input string
            curInput += event.key.toLowerCase();

            /*
            // advance current word index if input character matches next character of word
            if (curInput.length - 1 == curWordIndex && event.key.toLowerCase() == curWord[curWordIndex]) {
                curWordIndex++;
            }
            */

            curWordIndex++;
            console.log(curInput);
            console.log(curWord);

            if (curInput == curWord) {
                words.forEach(function (word) {
                    if (word.text == curWord) {
                        words.delete(word)
                    }
                });

                queueIndex++;
                console.log(wordsQueue[queueIndex]);
                curWord = wordsQueue[queueIndex];
                curInput = "";
                curWordIndex = 0;
            }
        }

    }

    else if (gameOver) {
        inStartMenu = true;
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
        var xStart = this.xPos;
        context.textAlign = "left";
        for (var i = 0; i < this.text.length; ++i) {
            if (this.text == curWord) {
                if (i >= curWordIndex) {
                    context.fillStyle = "white";
                }

                else if (curInput[i] == curWord[i]) {
                    context.fillStyle = "green";
                }

                else {
                    context.fillStyle = "red";
                }
            }
            else {
                context.fillStyle = "white";
            }

            context.font = "32px Arial";
            context.fillText(this.text.charAt(i), this.xPos, this.yPos);
            this.xPos += context.measureText(this.text.charAt(i)).width;

        }
        this.xPos = xStart;
        this.yPos += dropRate;
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

// handle word creation
function createWord() {
    // initialize new word according to difficulty settings
    var newWord = wordList[Math.floor(Math.random() * 1952)]

    /*
while (newWord.length < minWordLength || newWord.length > maxWordLength) {
    newWord = wordList[Math.floor(Math.random() * 1952)]
}
    */

    // create word object, set random initial x position, add to word list
    newWordObject = new Word(Math.floor(Math.random() * (3 / 4 * WIDTH)), 0, newWord, false, false);
    words.add(newWordObject);
    wordsQueue.push(newWordObject.text);
}

function rampingDifficulty() {
    dropRate += 0.1;
    wordRate -= 0.05;
}

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
        // find current word (closest to bottom)
        words.forEach(function (word) {
            word.renderWord();
            if (word.yPos > lowest) {
                lowest = word.yPos;
                curWord = word.text;
            }
        });

        // check for a word hitting the bottom
        words.forEach(function (word) {
            if (word.yPos > canvas.height) {
                inGame = false;
                gameOver = true;
                lowest = 0;
                words.clear()
                curInput = "";
                curWord = "";
                curWordIndex = 0;
                queueIndex = 0;
                wordRate = 1.0;
                dropRate = 1.0;
                clearInterval(wordCreationInterval);
            }
        })
    }

    else if (gameOver) {
        context.strokeStyle = "red";
        context.fillStyle = "red";
        context.font = "48px Courier New";
        context.textAlign = "center";
        context.fillText("GAME OVER!", WIDTH / 2, HEIGHT / 2);
        context.font = "24px Courier New";
        context.fillText("press any key to return to start", WIDTH / 2, HEIGHT / 2 + 100);
    }

    requestAnimationFrame(gameLoop)
}

requestAnimationFrame(gameLoop);