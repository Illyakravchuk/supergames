'use strict';
startGame(8, 8, 15);
function startGame(width, height, bombsCount) {
  //the main function that starts all processes
  const field = document.querySelector('.field');
  //returns a page element based on an arbitrary CSS selector
  const cellCount = width * height;
  field.innerHTML = '<button></button>'.repeat(cellCount); //generating buttons
  const cells = [...field.children];
  let closeCount = cellCount;


  const bombs = [...Array(cellCount).keys()]
  //an array that transmits the coordinates of the generated bombs
    .sort(() => Math.random() - 0.5)
    .slice(0, bombsCount);

  field.addEventListener('click', event => {
    //reacts to a click in the game area
    if (event.target.tagName !== 'BUTTON') {
      return;
    }

    const  index = cells.indexOf(event.target);
    const column = index % width;
    const row = Math.floor(index / width);
    open(row, column);

  });

  function isValid(row, column) {   //checks for validity
    return row >= 0 &&
        row < height &&
        column >= 0 &&
        column < width;
  }

  function getCount(row, column) {         // counts the bombs nearby
    let count = 0;
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        if (isBomb(row + y, column + x)) {
          count++;
        }
      }

    }
    return count;
  }
  function open(row, column) {
    // opens the cell and determines whether there is a bomb in the cell
    if (!isValid(row, column)) return;

    const index = row * width + column;
    const cell = cells[index];

    if (cell.disabled === true) return;

    cell.disabled = true;

    if (isBomb(row, column)) {
      cell.innerHTML =  'X';
      alert('you lose');
      return;
    }
    const count = getCount(row, column);

    closeCount--;
    if (count !== 0) {
      cell.innerHTML =  count;
      if (closeCount <= bombsCount) {
        alert('you won');
        return;
      }

      return;

    }
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        open(row + y, column + x);
      }

    }

  }

  function isBomb(row, column) {
    // determines if there is a bomb in this cell
    if (!isValid(row, column)) return  false;

    const index = row * width + column;

    return bombs.includes(index);
  }

}
