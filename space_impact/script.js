const Game = () => {
    const [gameState, setGameState] = React.useState('start');
    const [playerType, setPlayerType] = React.useState(null);
    const [score, setScore] = React.useState(0);
    const [playerPosition, setPlayerPosition] = React.useState(50);
    const [powerUps, setPowerUps] = React.useState([]);
    const [highScore, setHighScore] = React.useState(0);

    React.useEffect(() => {
        const storedHighScore = localStorage.getItem('highScore');
        if (storedHighScore) setHighScore(parseInt(storedHighScore));

        const handleKeyPress = (e) => {
            if (gameState === 'playing') {
                if (e.key === 'ArrowLeft') {
                    setPlayerPosition((prev) => Math.max(0, prev - 5));
                } else if (e.key === 'ArrowRight') {
                    setPlayerPosition((prev) => Math.min(90, prev + 5));
                } else if (e.key === ' ') {
                    shoot();
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [gameState]);

    React.useEffect(() => {
        if (gameState === 'playing') {
            const interval = setInterval(() => {
                setPowerUps((prev) => [
                    ...prev,
                    {
                        id: Date.now(),
                        position: Math.random() * 90,
                        top: 0,
                    },
                ]);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [gameState]);

    React.useEffect(() => {
        if (gameState === 'playing') {
            const interval = setInterval(() => {
                setPowerUps((prev) =>
                    prev.map((pu) => ({
                        ...pu,
                        top: pu.top + 1,
                    })).filter((pu) => pu.top < 100)
                );
            }, 20);

            return () => clearInterval(interval);
        }
    }, [gameState]);

    const startGame = (type) => {
        setPlayerType(type);
        setGameState('playing');
        setScore(0);
    };

    const shoot = () => {
        setPowerUps((prev) =>
            prev.filter((pu) => {
                const hit = Math.abs(pu.position - playerPosition) < 10 && pu.top > 80;
                if (hit) {
                    setScore((s) => s + 1);
                }
                return !hit;
            })
        );
    };

    const endGame = () => {
        setGameState('end');
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('highScore', score);
        }
    };

    return (
        <div id="game-container">
            <h1>Power-Up Space Game</h1>
            {gameState === 'start' && (
                <div className="menu">
                    <h2>Choose your spaceship:</h2>
                    <button onClick={() => startGame('male')}>Male</button>
                    <button onClick={() => startGame('female')}>Female</button>
                </div>
            )}
            {gameState === 'playing' && (
                <div id="game-area">
                    <div
                        className="spaceship"
                        style={{
                            left: `${playerPosition}%`,
                            backgroundImage: `url(${playerType === 'male' ? 'male_ship.png' : 'female_ship.png'})`,
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat'
                        }}
                    ></div>
                    {powerUps.map((pu) => (
                        <div
                            key={pu.id}
                            className="power-up"
                            style={{ left: `${pu.position}%`, top: `${pu.top}%` }}
                        ></div>
                    ))}
                    <div id="score">Score: {score}</div>
                    <button id="end-game" onClick={endGame}>End Game</button>
                </div>
            )}
            {gameState === 'end' && (
                <div id="game-over">
                    <h2>Game Over</h2>
                    <p>Your score: {score}</p>
                    <p>High score: {highScore}</p>
                    <p>Contact us:</p>
                    <p>Email: contact@power-up.com</p>
                    <p>Phone: +33 1 23 45 67 89</p>
                    <button onClick={() => setGameState('start')}>Play Again</button>
                </div>
            )}
        </div>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <Game />
    </React.StrictMode>,
    document.getElementById('root')
);