"use strict";

const input = document.getElementById("typingInput");
const wordsContainer = document.getElementById("wordsContainer");
const wpmValue = document.querySelector(".wpm-value");
const accuracyValue = document.querySelector(".accuracy-value");
const timeValue = document.querySelector(".time-value");
const restartButton = document.getElementById("restartBtn");

const TIME_PER_ROUND = 60;

const text = `Believe it or not-and I know most people do not-violence has been in decline over long stretches of time, and we may be living in the most peaceful time in our species' existence. The decline of violence, to be sure, has not been steady; it has not brought violence down to zero (to put it mildly); and it is not guaranteed to continue.`

let currentLetter = -1;
let totalLetters = text.length;
let mistakes = 0;
let gameStarted = false;
let startTime = -1;
let time = TIME_PER_ROUND;
let timer = -1;
let gameOver = false;

function getWords() {
    let wordCount = 0;
    for (let i = 0; i < Math.min(text.length, currentLetter+1); i++) {
        if (text[i] === " ") {
            wordCount++;
        }
    }
    return wordCount+1;
}

function showTextOnDOM() {
    wordsContainer.innerHTML = ""
    let count = 0;
    text.split(" ").forEach((word, idx, sentence) => {
        let html = `<div class="word">`;
        for (const letter of word) {
            html += `<span data-val="${letter}" class="letter letter-${count++}">${letter}</span>`;
        }

        if (idx != sentence.length-1)
            html += `<span data-val=" " class="letter letter-${count++}"> </span>`;

        html += "<div>";
        wordsContainer.insertAdjacentHTML("beforeend", html);
    }); 
}

function markCorrect() {
    const curr = document.querySelector(`.letter-${currentLetter}`);
    curr?.classList.remove("current");
    curr?.classList.add("correct");    

    document.querySelector(`.letter-${++currentLetter}`)?.classList.add("current");
}

function markMistake(){
    mistakes++;
    const curr = document.querySelector(`.letter-${currentLetter}`);
    curr?.classList.remove("current");
    curr?.classList.add("incorrect");    
    document.querySelector(`.letter-${++currentLetter}`)?.classList.add("current");
}
function moveCursorToPreviousLetter() {
    if (currentLetter <= 0) return;

    document.querySelector(`.letter-${currentLetter--}`)?.classList.remove("current");

    const curr = document.querySelector(`.letter-${currentLetter}`);
    curr?.classList.add("current");
    curr?.classList.remove("correct");
    curr?.classList.remove("incorrect");
}

function showStats(accuracy = 100, wpm = 0) {
    
    if (accuracy !== 100)
        accuracy = Math.floor((1 - mistakes/currentLetter) * 100);
    if (wpm !== 0)
        wpm = Math.floor(getWords() / ((Date.now()-startTime)/(1000*60)));

    wpmValue.textContent = wpm;
    accuracyValue.textContent = `${accuracy}%`;
    timeValue.textContent = `${time}s`;
}

function startGame() {
    gameStarted = true;
    gameOver = false;
    startTime = Date.now();
    if (timer !== -1) 
        clearInterval(timer);
    timer = setInterval(() => {
        time--;
        timeValue.textContent = `${time}s`;
        if (time === 0) {
            showStats(-1, -1);
            stopGame();
            clearInterval(timer);
        }
    }, 1 * 1000);
    // init();
}

function stopGame() {
    gameStarted = false;
    gameOver = true;
    if (timer !== -1)
        clearInterval(timer);
    timer = startTime = currentLetter = -1;
    totalLetters = text.length;
    mistakes = 0;
    time = TIME_PER_ROUND;
    wordsContainer.querySelectorAll(".letter").forEach(elem => {
        elem.classList.remove("current");
    });
}


function init() {
    input.focus();
    showTextOnDOM();
    markCorrect();
    showStats(100, 0);
    gameOver = false;
}

restartButton.addEventListener("click", () => {
    stopGame();
    init();
});

document.body.addEventListener("keydown", (e) => {

    const ignored_keys = ["Control", "Shift", "CapsLock", "Tab", "ArrowLeft,", "ArrowRight","ArrowDown", "Shift"];

    if (gameOver || ignored_keys.includes(e.key))
        return;

    if (e.key === "Backspace") {
        moveCursorToPreviousLetter();
    } else if (currentLetter < totalLetters) {
        if (text[currentLetter] === e.key) {
            markCorrect();
        } else if (text[currentLetter] !== e.key) {
            markMistake();
        }
        if (!gameStarted)
            startGame();
    } 
    if (currentLetter >= totalLetters && gameStarted) {
        showStats(-1, -1);
        stopGame();
    }
})

init();