class Game {
    constructor() {
        this.gridSize = 20;
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.reset();
        this.lastRenderTime = 0;
        this.gameRunning = false;
        
        this.speedSettings = {
            slow: { base: 300 },    // ~3.3 moves per second
            medium: { base: 200 },   // 5 moves per second
            fast: { base: 150 }      // ~6.7 moves per second
        };
        
        this.currentSpeedSetting = 'medium';
        this.baseSpeed = this.speedSettings[this.currentSpeedSetting].base;
        this.currentSpeed = this.baseSpeed;
        
        this.init();
        this.loadSavedSettings();
    }
    
    loadSavedSettings() {
        const savedSpeed = localStorage.getItem('snakeSpeedSetting');
        if (savedSpeed && this.speedSettings[savedSpeed]) {
            this.setSpeed(savedSpeed);
            this.updateSpeedButtons(savedSpeed);
        }
    }
    
    updateSpeedButtons(activeSpeed) {
        document.querySelectorAll('.speed-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const speedLabels = {
            slow: 'speed-slow',
            medium: 'speed-medium',
            fast: 'speed-fast'
        };
        
        const activeBtn = document.getElementById(speedLabels[activeSpeed]);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }
    
    init() {
        const canvasSize = Math.min(window.innerWidth - 40, 400);
        this.canvas.width = canvasSize;
        this.canvas.height = canvasSize;
        
        this.cellSize = Math.floor(this.canvas.width / this.gridSize);
        this.canvas.width = this.cellSize * this.gridSize;
        this.canvas.height = this.cellSize * this.gridSize;
        
        this.spawnFood();
    }
    
    reset() {
        this.snake = [
            {x: 10, y: 10},
            {x: 9, y: 10},
            {x: 8, y: 10}
        ];
        this.direction = {x: 1, y: 0};
        this.nextDirection = {x: 1, y: 0};
        this.food = {x: 0, y: 0};
        this.score = 0;
        this.gameOver = false;
        this.currentSpeed = this.baseSpeed;
        
        this.updateHighScoreDisplay();
    }
    
    updateHighScoreDisplay() {
        const highScore = localStorage.getItem('snakeHighScore') || 0;
        document.getElementById('high-score').textContent = highScore;
    }
    
    resetHighScore() {
        localStorage.removeItem('snakeHighScore');
        this.updateHighScoreDisplay();
    }
    
    setSpeed(speedSetting) {
        if (this.speedSettings[speedSetting]) {
            this.currentSpeedSetting = speedSetting;
            this.baseSpeed = this.speedSettings[speedSetting].base;
            this.currentSpeed = this.baseSpeed;
            
            localStorage.setItem('snakeSpeedSetting', speedSetting);
            
            const speedLabels = {
                slow: 'Slow',
                medium: 'Medium',
                fast: 'Fast'
            };
            document.getElementById('current-speed').textContent = speedLabels[speedSetting];
            
            return true;
        }
        return false;
    }
    
    spawnFood() {
        let foodPosition;
        let validPosition = false;
        
        while (!validPosition) {
            foodPosition = {
                x: Math.floor(Math.random() * this.gridSize),
                y: Math.floor(Math.random() * this.gridSize)
            };
            
            validPosition = !this.snake.some(segment => 
                segment.x === foodPosition.x && segment.y === foodPosition.y
            );
        }
        
        this.food = foodPosition;
    }
    
    update() {
        if (this.gameOver || !this.gameRunning) return;
        
        this.direction = {...this.nextDirection};
        
        const head = {...this.snake[0]};
        head.x += this.direction.x;
        head.y += this.direction.y;
        
        if (this.checkCollision(head)) {
            this.gameOver = true;
            this.gameRunning = false;
            document.getElementById('game-over-overlay').style.display = 'flex';
            document.getElementById('final-score').textContent = this.score;
            
            const highScore = localStorage.getItem('snakeHighScore') || 0;
            if (this.score > highScore) {
                localStorage.setItem('snakeHighScore', this.score);
                this.updateHighScoreDisplay();
                
                if (this.score > highScore && highScore > 0) {
                    this.showNewHighScoreNotification();
                }
            }
            return;
        }
        
        this.snake.unshift(head);
        
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            document.getElementById('score').textContent = this.score;
            
            this.spawnFood();
            
            const highScore = localStorage.getItem('snakeHighScore') || 0;
            if (this.score > highScore) {
                localStorage.setItem('snakeHighScore', this.score);
                this.updateHighScoreDisplay();
                
                if (this.score > highScore && highScore > 0) {
                    this.showNewHighScoreNotification();
                }
            }
        } else {
            this.snake.pop();
        }
    }
    
    checkCollision(position) {
        if (position.x < 0 || position.x >= this.gridSize ||
            position.y < 0 || position.y >= this.gridSize) {
            return true;
        }
        
        return this.snake.some(segment => 
            segment.x === position.x && segment.y === position.y
        );
    }
    
    changeDirection(newDirection) {
        if ((newDirection.x === -this.direction.x && newDirection.y === 0) ||
            (newDirection.y === -this.direction.y && newDirection.x === 0)) {
            return;
        }
        
        this.nextDirection = newDirection;
    }
    
    start() {
        this.reset();
        this.gameRunning = true;
        this.gameOver = false;
        document.getElementById('start-overlay').style.display = 'none';
        document.getElementById('game-over-overlay').style.display = 'none';
        this.lastRenderTime = performance.now();
        this.gameLoop();
    }
    
    gameLoop(currentTime = 0) {
        if (!this.gameRunning) return;
        
        const deltaTime = currentTime - this.lastRenderTime;
        
        if (deltaTime > this.currentSpeed) {
            this.update();
            this.lastRenderTime = currentTime - (deltaTime % this.currentSpeed);
        }
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    pause() {
        this.gameRunning = false;
        this.showPauseOverlay();
    }
    
    resume() {
        if (!this.gameOver) {
            this.gameRunning = true;
            this.lastRenderTime = performance.now();
            this.gameLoop();
            this.hidePauseOverlay();
        }
    }
    
    showPauseOverlay() {
        if (this.gameRunning || this.gameOver) return;
        
        const pauseOverlay = document.createElement('div');
        pauseOverlay.id = 'auto-pause-overlay';
        pauseOverlay.className = 'overlay';
        pauseOverlay.innerHTML = `
            <h2>Game Paused</h2>
            <p>Game was interrupted</p>
            <button id="resume-game-btn" class="btn">Resume Game</button>
        `;
        
        const gameWrapper = document.querySelector('.game-wrapper');
        if (gameWrapper && !document.getElementById('auto-pause-overlay')) {
            gameWrapper.appendChild(pauseOverlay);
            
            document.getElementById('resume-game-btn').addEventListener('click', () => {
                this.resume();
            });
            
            document.getElementById('resume-game-btn').addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.resume();
            });
        }
    }
    
    hidePauseOverlay() {
        const pauseOverlay = document.getElementById('auto-pause-overlay');
        if (pauseOverlay) {
            pauseOverlay.remove();
        }
    }
    
    getState() {
        return {
            snake: this.snake,
            food: this.food,
            score: this.score,
            gameOver: this.gameOver,
            gameRunning: this.gameRunning,
            gridSize: this.gridSize
        };
    }
    
    showNewHighScoreNotification() {
        const notification = document.createElement('div');
        notification.className = 'high-score-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span>🎉 New High Score! 🎉</span>
                <p>${this.score} points!</p>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #0a5c36, #0c7d4a);
            color: #000;
            padding: 15px 30px;
            border-radius: 8px;
            font-weight: bold;
            z-index: 1000;
            animation: slideDown 0.5s ease, fadeOut 0.5s ease 2.5s forwards;
            box-shadow: 0 5px 20px rgba(10, 92, 54, 0.5);
            text-align: center;
            min-width: 200px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}

const game = new Game();

window.addEventListener('resize', () => {
    game.init();
});

window.game = game;