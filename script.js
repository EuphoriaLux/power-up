const playArea = document.getElementById('play-area');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const messageElement = document.getElementById('message');
const contactElement = document.getElementById('contact');
const playAgainButton = document.getElementById('playAgain');

let score = 0;
let timeLeft = 30;
let gameInterval;
const powerUpTypes = ['red', 'blue', 'yellow'];

function startGame() {
    score = 0;
    timeLeft = 30;
    updateScore();
    updateTimer();
    contactElement.style.display = 'none';
    messageElement.textContent = 'Collectez les Power-Ups!';
    playArea.innerHTML = '';
    gameInterval = setInterval(updateGame, 1000);
    spawnPowerUp();
}

function updateGame() {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
        endGame();
    } else if (timeLeft % 5 === 0) {
        spawnPowerUp();
    }
}

function spawnPowerUp() {
    const powerUp = document.createElement('div');
    powerUp.className = `power-up ${powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)]} pulse`;
    powerUp.textContent = 'Power';
    powerUp.style.left = `${Math.random() * (playArea.offsetWidth - 60)}px`;
    powerUp.style.top = `${Math.random() * (playArea.offsetHeight - 60)}px`;
    powerUp.addEventListener('click', collectPowerUp);
    playArea.appendChild(powerUp);

    setTimeout(() => {
        if (powerUp.parentNode === playArea) {
            playArea.removeChild(powerUp);
        }
    }, 3000);
}

function collectPowerUp(event) {
    playArea.removeChild(event.target);
    score++;
    updateScore();
    if (score >= 15) {
        endGame();
    } else {
        spawnPowerUp();
    }
}

function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
}

function updateTimer() {
    timerElement.textContent = `Temps: ${timeLeft}s`;
}

function endGame() {
    clearInterval(gameInterval);
    playArea.innerHTML = '';
    if (score >= 15) {
        showContact();
    } else {
        messageElement.textContent = `Temps écoulé! Score final: ${score}. Essayez encore!`;
        setTimeout(startGame, 3000);
    }
}

function showContact() {
    contactElement.style.display = 'block';
}

playAgainButton.addEventListener('click', (e) => {
    e.preventDefault();
    startGame();
});

startGame();
