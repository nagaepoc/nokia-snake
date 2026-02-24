class Renderer {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.lastRenderTime = 0;
        this.fps = 60;
        this.frameInterval = 1000 / this.fps;
        
        this.colors = {
            background: '#000000',
            grid: '#0a3c26',
            snake: '#0a5c36',
            snakeHead: '#0c7d4a',
            food: '#ff4444',
            foodGlow: '#ff8888'
        };
        
        this.init();
        this.startRendering();
    }
    
    init() {
        this.canvas.width = game.canvas.width;
        this.canvas.height = game.canvas.height;
        this.cellSize = game.cellSize;
    }
    
    startRendering() {
        const renderLoop = (currentTime) => {
            requestAnimationFrame(renderLoop);
            
            const deltaTime = currentTime - this.lastRenderTime;
            
            if (deltaTime > this.frameInterval) {
                this.clear();
                this.drawGrid();
                this.drawFood();
                this.drawSnake();
                this.lastRenderTime = currentTime - (deltaTime % this.frameInterval);
            }
        };
        
        requestAnimationFrame(renderLoop);
    }
    
    clear() {
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawGrid() {
        this.ctx.strokeStyle = this.colors.grid;
        this.ctx.lineWidth = 0.5;
        
        for (let x = 0; x <= game.gridSize; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.cellSize, 0);
            this.ctx.lineTo(x * this.cellSize, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y <= game.gridSize; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.cellSize);
            this.ctx.lineTo(this.canvas.width, y * this.cellSize);
            this.ctx.stroke();
        }
    }
    
    drawSnake() {
        const snake = game.snake;
        
        snake.forEach((segment, index) => {
            const x = segment.x * this.cellSize;
            const y = segment.y * this.cellSize;
            const size = this.cellSize - 1;
            
            if (index === 0) {
                this.ctx.fillStyle = this.colors.snakeHead;
                this.ctx.fillRect(x, y, size, size);
                
                this.ctx.fillStyle = '#000';
                const eyeSize = Math.max(2, this.cellSize / 8);
                const eyeOffset = Math.max(2, this.cellSize / 4);
                
                const direction = game.direction;
                if (direction.x === 1) {
                    this.ctx.fillRect(x + size - eyeOffset, y + eyeOffset, eyeSize, eyeSize);
                    this.ctx.fillRect(x + size - eyeOffset, y + size - eyeOffset - eyeSize, eyeSize, eyeSize);
                } else if (direction.x === -1) {
                    this.ctx.fillRect(x + eyeOffset, y + eyeOffset, eyeSize, eyeSize);
                    this.ctx.fillRect(x + eyeOffset, y + size - eyeOffset - eyeSize, eyeSize, eyeSize);
                } else if (direction.y === 1) {
                    this.ctx.fillRect(x + eyeOffset, y + size - eyeOffset, eyeSize, eyeSize);
                    this.ctx.fillRect(x + size - eyeOffset - eyeSize, y + size - eyeOffset, eyeSize, eyeSize);
                } else if (direction.y === -1) {
                    this.ctx.fillRect(x + eyeOffset, y + eyeOffset, eyeSize, eyeSize);
                    this.ctx.fillRect(x + size - eyeOffset - eyeSize, y + eyeOffset, eyeSize, eyeSize);
                }
            } else {
                this.ctx.fillStyle = this.colors.snake;
                this.ctx.fillRect(x, y, size, size);
                
                if (index < snake.length - 1) {
                    const nextSegment = snake[index + 1];
                    const prevSegment = snake[index - 1];
                    
                    this.ctx.fillStyle = '#0a3c26';
                    const patternSize = Math.max(1, this.cellSize / 6);
                    
                    if (prevSegment && nextSegment) {
                        if (prevSegment.x === nextSegment.x || prevSegment.y === nextSegment.y) {
                            this.ctx.fillRect(x + patternSize, y + patternSize, 
                                            size - 2 * patternSize, size - 2 * patternSize);
                        }
                    }
                }
            }
        });
    }
    
    drawFood() {
        const food = game.food;
        const x = food.x * this.cellSize;
        const y = food.y * this.cellSize;
        const size = this.cellSize - 1;
        const time = Date.now() * 0.005;
        const pulse = Math.sin(time) * 0.2 + 0.8;
        
        this.ctx.fillStyle = this.colors.food;
        this.ctx.beginPath();
        this.ctx.arc(x + size/2, y + size/2, size/2 * pulse, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillStyle = this.colors.foodGlow;
        this.ctx.beginPath();
        this.ctx.arc(x + size/2, y + size/2, size/4 * pulse, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillStyle = '#fff';
        this.ctx.beginPath();
        this.ctx.arc(x + size/3, y + size/3, size/8, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    resize() {
        this.init();
    }
}

const renderer = new Renderer();
window.renderer = renderer;

window.addEventListener('resize', () => {
    renderer.resize();
});