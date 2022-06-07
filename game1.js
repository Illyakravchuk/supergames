'use strict';

class Game {
    constructor(parentElement, size=4) {
        this.size = size;
        let gameFieldElement =createAndAppend({
            className: 'game',
            parentElement
        });

        let headerElement = createAndAppend({
            className: 'header',
            parentElement:gameFieldElement
        });

        this.rating = 0;

        headerElement.innerHTML = 'Rating: ' + this.rating;

        let fieldElement = createAndAppend({
            className: 'field',
            parentElement:gameFieldElement
        });

        this.field =[];

        for (let i =0 ; i < size; i++){
            this.field[i]=[]
            for (let k = 0; k < size; k++){
                this.field[i][k] = new Cell(fieldElement);
            }
        }
        console.log(this.field);
    }

    spawnUnit() {
        let emptyCells = [];

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

    moveRight() {
        let hasMoved = false;
        for ( let i = 0; i < this.size; i++ ) {
            for ( let k = this.size - 2; k >= 0; k-- ) {
                let currentCell = this.field[i][k];
                if (currentCell.isEmpty) {
                    continue;
                }

                let nextCellKey = k + 1;

                while ( nextCellKey < this.size) {

                    let nextCell = this.field[i][nextCellKey];

                    if (!nextCell.isEmpty || this.isLastKey(nextCellKey)) {
                        if ((nextCell.isEmpty && this.isLastKey(nextCellKey)) // last cell with no value
                            || (nextCell.isSameTo(currentCell))) {
                            this.field[i][nextCellKey].merge(currentCell);
                            hasMoved = true;
                        } else if (!nextCell.isEmpty && nextCellKey - 1 != k) {
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
    isLastKey(key) {
        return key == (this.size - 1);
    }
}