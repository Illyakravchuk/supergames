startGame(8,8,15);
function startGame(width, height ,bombsCount){
    const field = document.querySelector('.field');
    const cellCount = width * height;
    field.innerHTML='<button></button>'.repeat(cellCount);
    const cells = [...field.children];


   const bombs = [...Array(cellCount).keys()]
        .sort(()=>Math.random() - 0.5)
        .slice(0,bombsCount);

    field.addEventListener('click', (event)=> {
       if (event.target.tagName !== 'BUTTON') {
           return;
       }

       const  index = cells.indexOf(event.target);
       const column = index % width;
       const row = Math.floor(index /width);

       event.target.innerHTML = isBomb(row, column) ? 'X' : ' ';

       function isBomb(row, column) {
           const index = row * width + column;

           return bombs.includes(index);
       }
    })

}