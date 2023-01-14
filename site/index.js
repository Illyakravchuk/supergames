'use strict';
const links = document.querySelectorAll('.menu a');
const ind = document.querySelector('.indicator');

links.forEach(item => {
  item.addEventListener('click', e => {
    moveInd(e.target);
  });
});

function moveInd(el) {
  ind.style.width = `${el.offsetWidth}px`;
  ind.style.left = `${el.offsetLeft}px`;
}
