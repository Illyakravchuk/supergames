'use strict';

class Game {
  constructor(parentElement, size = 4) {
    this.size = size;
    const gameFieldElement = createAndAppend({
      className: 'game',
      parentElement,
    });

    this.headerElement = createAndAppend({
      className: 'header',
      parentElement: gameFieldElement
    });

    this.rating = 0;

    const fieldElement = createAndAppend({
      className: 'field',
      parentElement: gameFieldElement
    });

    this.field = [];

    for (let i = 0; i < size; i++) {
      this.field[i] = [];
      for (let k = 0; k < size; k++) {
        this.field[i][k] = new Cell(fieldElement, this);
      }
    }

    window.onkeyup = function(e) {
      switch (e.keyCode) {
      case 37:
        this.moveLeft();
        break;
      case 38:
        this.moveTop();
        break;
      case 39:
        this.moveRight();
        break;
      case 40:
        this.moveDown();
        break;

      }
    }.bind(this);

    console.log(this.field);
  }

  spawnUnit() {
    const emptyCells = [];

    for (let i = 0; i < this.field.length; i++) {
      for (let p = 0; p < this.field[i].length; p++) {
        if (!this.field[i][p].value) {
          emptyCells.push(this.field[i][p]);
        }
      }
    }

    if (emptyCells.length) {
      emptyCells[randomInterval(0, emptyCells.length - 1)].spawn();
    } else {
      alert('You lose!');
    }
    // check if you have no empty cells left, then you lost
  }

  set rating(value) {
    this._rating = value;
    this.headerElement.innerHTML = 'Rating: ' + value;
  }

  get rating() {
    return this._rating;
  }

  addRating(value) {
    this.rating += value;
  }

  moveRight() {
    let hasMoved = false;
    for (let i = 0; i < this.size; i++) {
      for (let k = this.size - 2; k >= 0; k--) {
        const currentCell = this.field[i][k];
        if (currentCell.isEmpty) {
          continue;
        }

        let nextCellKey = k + 1;

        while (nextCellKey < this.size) {

          let nextCell = this.field[i][nextCellKey];

          if (!nextCell.isEmpty || this.isLastKey(nextCellKey)) {
            if ((nextCell.isEmpty && this.isLastKey(nextCellKey)) ||
                            (nextCell.isSameTo(currentCell))) {
              this.field[i][nextCellKey].merge(currentCell);
              hasMoved = true;
            } else if (!nextCell.isEmpty && nextCellKey - 1 !== k) {
              this.field[i][nextCellKey - 1].merge(currentCell);
              hasMoved = true;
            }
            break;
          }
          nextCellKey++;
          nextCell = this.field[i][nextCellKey];
        }
      }
    }
    if (hasMoved) {
      this.spawnUnit();
    }
  }

  moveLeft() {
    let hasMoved = false;
    for (let i = 0; i < this.size; i++) {
      for (let k = 1; k < this.size; k++) {
        const currentCell = this.field[i][k];
        if (currentCell.isEmpty) {
          continue;
        }

        let nextCellKey = k - 1;

        while (nextCellKey >= 0) {

          let nextCell = this.field[i][nextCellKey];

          if (!nextCell.isEmpty || this.isFirstKey(nextCellKey)) {
            if ((nextCell.isEmpty && this.isFirstKey(nextCellKey)) ||
                            (nextCell.isSameTo(currentCell))) {
              this.field[i][nextCellKey].merge(currentCell);
              hasMoved = true;
            } else if (!nextCell.isEmpty && nextCellKey + 1 !== k) {
              this.field[i][nextCellKey + 1].merge(currentCell);
              hasMoved = true;
            }
            break;
          }
          nextCellKey--;
          nextCell = this.field[i][nextCellKey];
        }
      }
    }
    if (hasMoved) {
      this.spawnUnit();
    }
  }

  isFirstKey(key) {
    return key === 0;
  }

  isLastKey(key) {
    return key === (this.size - 1);
  }

  moveDown() {
    let hasMoved = false;
    for (let k = 0; k < this.size; k++) {
      for (let i = this.size - 2; i >= 0; i--) {
        const currentCell = this.field[i][k];
        if (currentCell.isEmpty) {
          continue;
        }

        let nextCellKey = i + 1;

        while (nextCellKey < this.size) {

          let nextCell = this.field[nextCellKey][k];

          if (!nextCell.isEmpty || this.isLastKey(nextCellKey)) {
            if ((nextCell.isEmpty && this.isLastKey(nextCellKey)) ||
                            (nextCell.isSameTo(currentCell))) {
              this.field[nextCellKey][k].merge(currentCell);
              hasMoved = true;
            } else if (!nextCell.isEmpty && nextCellKey - 1 !== i) {
              this.field[nextCellKey - 1][k].merge(currentCell);
              hasMoved = true;
            }
            break;
          }
          nextCellKey++;
          nextCell = this.field[nextCellKey][k];
        }
      }
    }
    if (hasMoved) {
      this.spawnUnit();
    }
  }

  moveTop() {
    let hasMoved = false;
    for (let k = 0; k < this.size; k++) {
      for (let i = 1; i < this.size; i++) {
        const currentCell = this.field[i][k];
        if (currentCell.isEmpty) {
          continue;
        }

        let nextCellKey = i - 1;

        while (nextCellKey < this.size) {

          let nextCell = this.field[nextCellKey][k];

          if (!nextCell.isEmpty || this.isFirstKey(nextCellKey)) {
            if ((nextCell.isEmpty && this.isFirstKey(nextCellKey)) ||
                            (nextCell.isSameTo(currentCell))) {
              this.field[nextCellKey][k].merge(currentCell);
              hasMoved = true;
            } else if (!nextCell.isEmpty && nextCellKey + 1 !== i) {
              this.field[nextCellKey + 1][k].merge(currentCell);
              hasMoved = true;
            }
            break;
          }
          nextCellKey--;
          nextCell = this.field[nextCellKey][k];
        }
      }
    }
    if (hasMoved) {
      this.spawnUnit();
    }
  }
}
