'use strict';

const createAndAppend = function({ className, parentElement, value },
  tag = 'div') {
  const element = document.createElement(tag);
  element.className = className;
  if (value) {
    element.innerHTML = value;
  }

  parentElement.appendChild(element);

  return element;
};

const randomInterval = function(from, to) {
  return Math.round(Math.random() * (to - from + 1) + from);
};

const game = new Game(document.body, 4);
