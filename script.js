import { startPowerUpCollector } from './games/power-up-collector/power-up-collector.js';

const gameButtons = document.querySelectorAll('.game-button');
const games = document.querySelectorAll('.game');

gameButtons.forEach(button => {
    button.addEventListener('click', () => {
        const gameId = button.getAttribute('data-game');
        showGame(gameId);
    });
});

function showGame(gameId) {
    games.forEach(game => {
        game.classList.remove('active');
    });
    const selectedGame = document.getElementById(gameId);
    selectedGame.classList.add('active');
    
    if (gameId === 'power-up-collector') {
        startPowerUpCollector();
    }
    // Add more game initializations here as you create them
}

// Initialize the first game (Power-Up Collector) when the page loads
document.addEventListener('DOMContentLoaded', () => {
    showGame('power-up-collector');
});
