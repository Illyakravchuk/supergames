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
    y: Math.floor(Math.random() * 15 + 1) * cellSize,
};

let snake = [];
snake[0] = {               //spawn snake
    x: 9 * cellSize,
    y: 10 * cellSize,
};


function createGame() {    //generates a field
    ctx.drawImage(gameField,0 ,0);

    ctx.drawImage(cherry, food.x, food.y);  //spawn cherry

    for(let i = 0; i < snake.length; i++) { // display snake
        ctx.fillStyle = "green";
        ctx.fillRect(snake[i].x, snake[i].y, cellSize, cellSize);
    }

};

let game = setInterval(createGame,100); //display field
