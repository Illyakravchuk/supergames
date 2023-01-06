import Ball from "./ball.js";
import Paddle from "./paddle";

const ball = new Ball(document.getElementById("ball"));
const playerPaddle = new Paddle(document.getElementById("player-paddle"));
const computerPaddle = new Paddle(document.getElementById("computer-paddle"))


let lastTime;

document.addEventListener("mousemove", e => {
    playerPaddle.position = (e.y / window.innerHeight) * 100;
})
function update(time) {
    if (lastTime != null) {
        const delta = time - lastTime;
        ball.update(delta);
    }

    lastTime = time;
    window.requestAnimationFrame(update);
}

window.requestAnimationFrame(update);



