const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");  // Game format

const gameField = new Image ();
gameField.src = "gameField.png";   // Picture of the playing field

const cherry = new Image ();  // Picture of food
cherry.src = "food.png";

let cellSize = 32;  //  image size food.png

let rating = 0;  //initial rating

function createGame() {    //generates a field
    ctx.drawImage(gameField,0 ,0);
}

let game = setInterval(createGame,100); //display field