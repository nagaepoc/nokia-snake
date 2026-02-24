class InputHandler {
    constructor() {
        this.keys = new Set();
        this.touchStart = null;
        this.swipeThreshold = 30;
        
        this.initKeyboard();
        this.initMobileControls();
        this.initTouch();
        this.initGameButtons();
    }
    
    initKeyboard() {
        document.addEventListener('keydown', (e) => {
            if (!game.gameRunning && e.key !== ' ') return;
            
            switch(e.key.toLowerCase()) {
                case 'arrowup':
                case 'w':
                    e.preventDefault();
                    game.changeDirection({x: 0, y: -1});
                    break;
                case 'arrowdown':
                case 's':
                    e.preventDefault();
                    game.changeDirection({x: 0, y: 1});
                    break;
                case 'arrowleft':
                case 'a':
                    e.preventDefault();
                    game.changeDirection({x: -1, y: 0});
                    break;
                case 'arrowright':
                case 'd':
                    e.preventDefault();
                    game.changeDirection({x: 1, y: 0});
                    break;
                case ' ':
                    e.preventDefault();
                    if (game.gameOver) {
                        document.getElementById('restart-btn').click();
                    } else if (!game.gameRunning) {
                        document.getElementById('start-btn').click();
                    }
                    break;
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys.delete(e.key.toLowerCase());
        });
        
        window.addEventListener('blur', () => {
            if (game.gameRunning && !game.gameOver) {
                game.pause();
            }
        });
        
        window.addEventListener('focus', () => {
            if (!game.gameOver) {
                game.resume();
            }
        });
    }
    
    initMobileControls() {
        const upBtn = document.getElementById('up-btn');
        const downBtn = document.getElementById('down-btn');
        const leftBtn = document.getElementById('left-btn');
        const rightBtn = document.getElementById('right-btn');
        
        const handleDirection = (x, y) => {
            if (game.gameRunning) {
                game.changeDirection({x, y});
            }
        };
        
        upBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleDirection(0, -1);
            upBtn.classList.add('pulse');
        });
        
        upBtn.addEventListener('touchend', () => {
            upBtn.classList.remove('pulse');
        });
        
        downBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleDirection(0, 1);
            downBtn.classList.add('pulse');
        });
        
        downBtn.addEventListener('touchend', () => {
            downBtn.classList.remove('pulse');
        });
        
        leftBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleDirection(-1, 0);
            leftBtn.classList.add('pulse');
        });
        
        leftBtn.addEventListener('touchend', () => {
            leftBtn.classList.remove('pulse');
        });
        
        rightBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleDirection(1, 0);
            rightBtn.classList.add('pulse');
        });
        
        rightBtn.addEventListener('touchend', () => {
            rightBtn.classList.remove('pulse');
        });
        
        upBtn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            handleDirection(0, -1);
            upBtn.classList.add('pulse');
        });
        
        upBtn.addEventListener('mouseup', () => {
            upBtn.classList.remove('pulse');
        });
        
        upBtn.addEventListener('mouseleave', () => {
            upBtn.classList.remove('pulse');
        });
        
        downBtn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            handleDirection(0, 1);
            downBtn.classList.add('pulse');
        });
        
        downBtn.addEventListener('mouseup', () => {
            downBtn.classList.remove('pulse');
        });
        
        downBtn.addEventListener('mouseleave', () => {
            downBtn.classList.remove('pulse');
        });
        
        leftBtn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            handleDirection(-1, 0);
            leftBtn.classList.add('pulse');
        });
        
        leftBtn.addEventListener('mouseup', () => {
            leftBtn.classList.remove('pulse');
        });
        
        leftBtn.addEventListener('mouseleave', () => {
            leftBtn.classList.remove('pulse');
        });
        
        rightBtn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            handleDirection(1, 0);
            rightBtn.classList.add('pulse');
        });
        
        rightBtn.addEventListener('mouseup', () => {
            rightBtn.classList.remove('pulse');
        });
        
        rightBtn.addEventListener('mouseleave', () => {
            rightBtn.classList.remove('pulse');
        });
    }
    
    initTouch() {
        document.addEventListener('touchstart', (e) => {
            this.touchStart = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
        });
        
        document.addEventListener('touchmove', (e) => {
            if (!this.touchStart || !game.gameRunning) return;
            
            e.preventDefault();
            
            const touchEnd = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
            
            const dx = touchEnd.x - this.touchStart.x;
            const dy = touchEnd.y - this.touchStart.y;
            
            if (Math.abs(dx) > Math.abs(dy)) {
                if (Math.abs(dx) > this.swipeThreshold) {
                    game.changeDirection({x: Math.sign(dx), y: 0});
                    this.touchStart = touchEnd;
                }
            } else {
                if (Math.abs(dy) > this.swipeThreshold) {
                    game.changeDirection({x: 0, y: Math.sign(dy)});
                    this.touchStart = touchEnd;
                }
            }
        });
        
        document.addEventListener('touchend', () => {
            this.touchStart = null;
        });
    }
    
    initGameButtons() {
        const startBtn = document.getElementById('start-btn');
        const restartBtn = document.getElementById('restart-btn');
        
        startBtn.addEventListener('click', () => {
            game.start();
        });
        
        restartBtn.addEventListener('click', () => {
            game.start();
        });
        
        startBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            startBtn.click();
        });
        
        restartBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            restartBtn.click();
        });
    }
    
    isKeyPressed(key) {
        return this.keys.has(key.toLowerCase());
    }
}

const inputHandler = new InputHandler();
window.inputHandler = inputHandler;