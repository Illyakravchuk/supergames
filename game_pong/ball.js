export default class Ball {
    constructor(ballElem) {
        this.ballElem = ballElem;
    }

    get x() {
        return parseFloat(getCompusedStyle(this.ballElem).getPropertyValue("--x"));
    }

    set x(value) {
        this.ballElem.style.setProperty("--x", value);
    }

    get y() {
        return parseFloat(getCompusedStyle(this.ballElem).getPropertyValue("--y"));
    }

    set y(value) {
        this.ballElem.style.setProperty("--y", value);
    }
    update(delta) {
        this.x = 6;
        this.y= 9;
    }
}