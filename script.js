const playArea = document.getElementById('play-area');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const messageElement = document.getElementById('message');
const contactElement = document.getElementById('contact');
const playAgainButton = document.getElementById('playAgain');

let score = 0;
let timeLeft = 30;
let gameInterval;
let level = 1;
const powerUpTypes = ['red', 'blue', 'yellow'];

function startGame() {
    score = 0;
    timeLeft = 30;
    level = 1;
    updateScore();
    updateTimer();
    updateLevel();
    contactElement.style.display = 'none';
    messageElement.textContent = 'Collectez les Power-Ups!';
    playArea.innerHTML = '';
    gameInterval = setInterval(updateGame, 1000);
    spawnPowerUp();
}

function updateLevel() {
    level = Math.floor(score / 5) + 1;
    document.getElementById('levelReached').textContent = level;
}

function showEncouragement() {
    const messages = [
        "Excellent travail !",
        "Continuez comme ça !",
        "Vous êtes en feu !",
        "Incroyable !",
        "Fantastique !"
    ];
    messageElement.textContent = messages[Math.floor(Math.random() * messages.length)];
    setTimeout(() => {
        messageElement.textContent = 'Collectez les Power-Ups!';
    }, 1500);
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
    updateLevel();
    if (score % 5 === 0) {
        showEncouragement();
    }
    if (score >= 30) {
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
    if (score >= 30) {
        showContact();
    } else {
        messageElement.textContent = `Temps écoulé! Score final: ${score}. Niveau atteint: ${level}. Essayez encore!`;
        setTimeout(startGame, 3000);
    }
}

function showContact() {
    contactElement.style.display = 'block';
}

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // Ici, vous pouvez ajouter le code pour envoyer le formulaire
    alert('Merci pour votre message ! Nous vous contacterons bientôt.');
    this.reset();
});

playAgainButton.addEventListener('click', (e) => {
    e.preventDefault();
    startGame();
});

startGame();
