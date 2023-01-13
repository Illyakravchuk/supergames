const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");  // Game format

const gameField = new Image ();
gameField.src = "gameField.png";   // Picture of the playing field

const cherry = new Image ();  // Picture of food
cherry.src = "food.png";

let cellSize = 32;  //  image size food.png

let rating = 0;  //initial rating

let food = {              //generates a random cherry spawn
    x: Math.floor(Math.random() * 17 + 1) * cellSize,
    y: Math.floor(Math.random() * 15 + 3) * cellSize,
};

let snake = [];
snake[0] = {               //spawn snake
    x: 9 * cellSize,
    y: 10 * cellSize,
};


document.addEventListener("keydown",direction); // event handler

let dir; //the current movement of the snake
function direction (event) {                    // handling of keyboard presses
    if(event.keyCode == 37 && dir != "right")
        dir = "left";
    else if (event.keyCode == 38 && dir != "down")
        dir ="up";
    else if (event.keyCode == 39 && dir != "left")
        dir ="right";
    else if (event.keyCode == 40 && dir != "up")
        dir ="down";
}

function eatTail (head, arr) {
    for (let i = 0 ; i < arr.length; i++){
        if(head.x == arr[i].x && head.y == arr[i].y) {
            clearInterval(game);
          return   alert('you lose');
        }
    }
}

function createGame() {    //generates a field
    ctx.drawImage(gameField, 0, 0);

    ctx.drawImage(cherry, food.x, food.y);  //spawn cherry

    for (let i = 0; i < snake.length; i++) { // display snake
        ctx.fillStyle = i == 0 ? "green" : "red";
        ctx.fillRect(snake[i].x, snake[i].y, cellSize, cellSize);
    }
    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.fillText(rating, cellSize * 2.5, cellSize * 1.7) //rating demonstration

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if(snakeX == food.x && snakeY == food.y) {
        rating++;
        food = {
            x: Math.floor(Math.random() * 17 + 1) * cellSize,
            y: Math.floor(Math.random() * 15 + 3) * cellSize,
        };
    } else {
        snake.pop();
    };
    if(snakeX <  cellSize || snakeX > cellSize * 17   //the instruction prohibits going beyond the field
        || snakeY < 3 * cellSize || snakeY > cellSize * 17) {
        clearInterval(game);
        return alert('you lose');
    }
    switch (dir) {     //changing the position of the snake's head
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
    };

    let newHead = {
        x: snakeX,
        y: snakeY,
    };

    eatTail(newHead, snake);

    snake.unshift(newHead);
};



let game = setInterval(createGame,100); //display field
