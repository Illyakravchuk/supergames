'use strict';
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const gameField = new Image();
gameField.src = 'gameField.png';

const cherry = new Image();
cherry.src = 'food.png';

const cellSize = 32;
let rating = 0;

let food = {
    x: Math.floor(Math.random() * 17 + 1) * cellSize,
    y: Math.floor(Math.random() * 15 + 3) * cellSize,
};

const snake = [];
snake[0] = {
    x: 9 * cellSize,
    y: 10 * cellSize,
};

document.addEventListener('keydown', direction);

let dir;
function direction(event) {
    if (event.keyCode == 37 && dir != 'right') dir = 'left';
    else if (event.keyCode == 38 && dir != 'down') dir = 'up';
    else if (event.keyCode == 39 && dir != 'left') dir = 'right';
    else if (event.keyCode == 40 && dir != 'up') dir = 'down';
}

function restartGame() {
    document.getElementById('game-over-message').style.display = 'none';
    const restartButton = document.getElementById('restart-button');
    if (restartButton) restartButton.style.display = 'none';
    snake.length = 0;
    snake[0] = { x: 9 * cellSize, y: 10 * cellSize };
    dir = null;
    rating = 0;
    food = {
        x: Math.floor(Math.random() * 17 + 1) * cellSize,
        y: Math.floor(Math.random() * 15 + 3) * cellSize,
    };
    gameInterval = setInterval(createGame, 100);
}

function gameOver() {
    clearInterval(gameInterval);
    const gameOverMessage = document.getElementById('game-over-message');
    gameOverMessage.style.display = 'block';

    const restartButton = document.getElementById('restart-button');
    restartButton.style.display = 'block';
}

function eatTail(head, arr) {
    for (let i = 0; i < arr.length; i++) {
        if (head.x == arr[i].x && head.y == arr[i].y) {
            gameOver();
            return;
        }
    }
}

function createGame() {
    ctx.drawImage(gameField, 0, 0);

    ctx.drawImage(cherry, food.x, food.y);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i == 0 ? 'green' : 'red';
        ctx.fillRect(snake[i].x, snake[i].y, cellSize, cellSize);
    }
    ctx.fillStyle = 'white';
    ctx.font = '50px Arial';
    ctx.fillText(rating, cellSize * 2.5, cellSize * 1.7);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (snakeX == food.x && snakeY == food.y) {
        rating++;
        food = {
            x: Math.floor(Math.random() * 17 + 1) * cellSize,
            y: Math.floor(Math.random() * 15 + 3) * cellSize,
        };
    } else {
        snake.pop();
    }

    if (
        snakeX < cellSize ||
        snakeX > cellSize * 17 ||
        snakeY < 3 * cellSize ||
        snakeY > cellSize * 17
    ) {
        gameOver();
        return;
    }

    switch (dir) {
        case 'left':
            snakeX -= cellSize;
            break;
        case 'right':
            snakeX += cellSize;
            break;
        case 'up':
            snakeY -= cellSize;
            break;
        case 'down':
            snakeY += cellSize;
            break;
    }

    const newHead = {
        x: snakeX,
        y: snakeY,
    };

    eatTail(newHead, snake);

    snake.unshift(newHead);
}

let gameInterval = setInterval(createGame, 100);


function createGameOverMessage() {
  const gameOverMessage = document.createElement('div');
  gameOverMessage.id = 'game-over-message';
  gameOverMessage.textContent = 'Гра закінчена!';
  gameOverMessage.style.display = 'none';
  document.body.appendChild(gameOverMessage);
}

function createRestartButton() {
  const restartButton = document.createElement('button');
  restartButton.id = 'restart-button';
  restartButton.classList.add('restart-button');
  restartButton.textContent = 'Почати спочатку';
  restartButton.onclick = restartGame;
  restartButton.style.display = 'none';
  document.body.appendChild(restartButton);
}

createGameOverMessage();
createRestartButton();
