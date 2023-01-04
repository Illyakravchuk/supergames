'use strict'
startGame(8,8,15);
function startGame(width, height ,bombsCount){         //the main function that starts all processes
    const field = document.querySelector('.field'); //returns a page element based on an arbitrary CSS selector
    const cellCount = width * height;
    field.innerHTML='<button></button>'.repeat(cellCount); //generating buttons
    const cells = [...field.children];


    const bombs = [...Array(cellCount).keys()]   //an array that transmits the coordinates of the generated bombs
        .sort(()=>Math.random() - 0.5)
        .slice(0,bombsCount);

    field.addEventListener('click', (event)=> {     //reacts to a click in the game area
        if (event.target.tagName !== 'BUTTON') {
            return;
        }

        const  index = cells.indexOf(event.target);
        const column = index % width;
        const row = Math.floor(index /width);
        open(row, column)

    });

    function getCount(row, column){         // counts the bombs nearby
        let count = 0;
        for(let x = -1; x <= 1; x++){
            for(let y = -1; y <= 1; y++){
                if( isBomb(row + y,column + x)) {
                    count++;
                }
            }

        }
        return count;
    }
    function open(row, column){      // opens the cell and determines whether there is a bomb in the cell
        const index = row * width + column;
        const cell = cells[index];
        cell.innerHTML = isBomb(row, column) ? 'X' : getCount(row, column);
        cell.disabled = true;
    }

    function isBomb(row, column) {     // determines if there is a bomb in this cell
        const index = row * width + column;

        return bombs.includes(index);
    }

}