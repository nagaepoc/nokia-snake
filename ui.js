class UI {
    constructor() {
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('high-score');
        this.finalScoreElement = document.getElementById('final-score');
        this.startOverlay = document.getElementById('start-overlay');
        this.gameOverOverlay = document.getElementById('game-over-overlay');
        this.installBtn = document.getElementById('install-btn');
        this.pwaStatus = document.getElementById('pwa-status');
        this.resetScoreBtn = document.getElementById('reset-score-btn');
        
        this.init();
        this.updateHighScore();
        this.checkPWAStatus();
        this.initSpeedControls();
        this.initResetButton();
    }
    
    init() {
        this.updateScore(0);
        
        window.addEventListener('game:score', (e) => {
            this.updateScore(e.detail.score);
        });
        
        window.addEventListener('game:over', (e) => {
            this.showGameOver(e.detail.score);
        });
        
        this.setupEventListeners();
    }
    
    updateScore(score) {
        this.scoreElement.textContent = score;
        
        const highScore = localStorage.getItem('snakeHighScore') || 0;
        if (score > highScore) {
            localStorage.setItem('snakeHighScore', score);
            this.highScoreElement.textContent = score;
        }
    }
    
    updateHighScore() {
        const highScore = localStorage.getItem('snakeHighScore') || 0;
        this.highScoreElement.textContent = highScore;
    }
    
    showGameOver(score) {
        this.finalScoreElement.textContent = score;
        this.gameOverOverlay.style.display = 'flex';
        
        const highScore = localStorage.getItem('snakeHighScore') || 0;
        
        const gameOverMessage = document.querySelector('#game-over-overlay p');
        if (score > highScore) {
            this.showNewHighScore(score);
            if (gameOverMessage) {
                gameOverMessage.innerHTML = `🎉 <strong>New High Score: ${score}</strong> 🎉<br>Previous best: ${highScore}`;
            }
        } else if (score == highScore && highScore > 0) {
            if (gameOverMessage) {
                gameOverMessage.innerHTML = `🏆 <strong>Matched High Score: ${score}</strong> 🏆<br>Great job!`;
            }
        } else if (highScore > 0) {
            const difference = highScore - score;
            if (gameOverMessage) {
                gameOverMessage.innerHTML = `Score: <strong>${score}</strong><br>High Score: ${highScore} (${difference} more needed)`;
            }
        }
    }
    
    showNewHighScore(score) {
        const message = document.createElement('div');
        message.className = 'new-high-score';
        message.textContent = `🎉 New High Score: ${score}!`;
        message.style.cssText = `
            color: #ffd700;
            font-size: 1.2rem;
            margin-top: 10px;
            font-weight: bold;
            text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        `;
        
        this.gameOverOverlay.appendChild(message);
        
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 3000);
    }
    
    initSpeedControls() {
        document.getElementById('speed-slow').addEventListener('click', () => {
            game.setSpeed('slow');
            this.updateSpeedButtons('slow');
        });
        
        document.getElementById('speed-medium').addEventListener('click', () => {
            game.setSpeed('medium');
            this.updateSpeedButtons('medium');
        });
        
        document.getElementById('speed-fast').addEventListener('click', () => {
            game.setSpeed('fast');
            this.updateSpeedButtons('fast');
        });
        
        document.getElementById('speed-slow').addEventListener('touchstart', (e) => {
            e.preventDefault();
            game.setSpeed('slow');
            this.updateSpeedButtons('slow');
        });
        
        document.getElementById('speed-medium').addEventListener('touchstart', (e) => {
            e.preventDefault();
            game.setSpeed('medium');
            this.updateSpeedButtons('medium');
        });
        
        document.getElementById('speed-fast').addEventListener('touchstart', (e) => {
            e.preventDefault();
            game.setSpeed('fast');
            this.updateSpeedButtons('fast');
        });
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
    
    initResetButton() {
        this.resetScoreBtn.addEventListener('click', () => {
            this.showResetConfirmation();
        });
        
        this.resetScoreBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.showResetConfirmation();
        });
    }
    
    showResetConfirmation() {
        const highScore = localStorage.getItem('snakeHighScore') || 0;
        if (highScore == 0) {
            this.showToast('No high score to reset!', 'warning');
            return;
        }
        
        if (confirm(`Are you sure you want to reset your high score of ${highScore}? This cannot be undone!`)) {
            game.resetHighScore();
            this.showToast('High score reset successfully!', 'success');
        }
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (game.gameRunning && !game.gameOver) {
                    game.pause();
                    this.showPauseScreen();
                } else if (!game.gameRunning && !game.gameOver) {
                    game.resume();
                    this.hidePauseScreen();
                }
            }
        });
        
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && game.gameRunning && !game.gameOver) {
                game.pause();
            }
        });
    }
    
    showPauseScreen() {
        const pauseOverlay = document.createElement('div');
        pauseOverlay.id = 'pause-overlay';
        pauseOverlay.className = 'overlay';
        pauseOverlay.innerHTML = `
            <h2>Game Paused</h2>
            <p>Press ESC to resume</p>
            <button id="resume-btn" class="btn">Resume</button>
        `;
        
        const gameWrapper = document.querySelector('.game-wrapper');
        gameWrapper.appendChild(pauseOverlay);
        
        document.getElementById('resume-btn').addEventListener('click', () => {
            game.resume();
            this.hidePauseScreen();
        });
    }
    
    hidePauseScreen() {
        const pauseOverlay = document.getElementById('pause-overlay');
        if (pauseOverlay) {
            pauseOverlay.remove();
        }
    }
    
    checkPWAStatus() {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            this.pwaStatus.textContent = 'PWA Ready';
            this.pwaStatus.style.color = '#0a5c36';
        } else {
            this.pwaStatus.textContent = 'PWA Not Supported';
            this.pwaStatus.style.color = '#ccc';
        }
        
        if (window.matchMedia('(display-mode: standalone)').matches) {
            this.installBtn.style.display = 'none';
            this.pwaStatus.textContent = 'Installed as App';
        }
    }
    
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        
        const colors = {
            info: '#0a5c36',
            success: '#0c7d4a',
            warning: '#ffaa00',
            error: '#ff4444'
        };
        
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: #000;
            padding: 12px 20px;
            border-radius: 6px;
            font-weight: bold;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
    
    updateMobileControlsVisibility() {
        const mobileControls = document.querySelector('.mobile-controls');
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            mobileControls.style.display = 'flex';
        } else {
            mobileControls.style.display = 'none';
        }
    }
}

const ui = new UI();
window.ui = ui;

window.addEventListener('load', () => {
    ui.updateMobileControlsVisibility();
});

window.addEventListener('resize', () => {
    ui.updateMobileControlsVisibility();
});