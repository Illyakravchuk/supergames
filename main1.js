'use strict'

let createAndAppend = function ({ className, parentElement, value},tag ='div') {
    let element = document.createElement(tag);
    element.className = className;
    if (value) {
        element.innerHTML = value;
    }

    parentElement.appendChild(element);

    return element;
}

let randomInterval = function(from, to) {
    return Math.round(Math.random() * (to - from + 1) + from);
}

let game = new Game(document.body, 4);