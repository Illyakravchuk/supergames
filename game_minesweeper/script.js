startGame(8,8,15);
function startGame(width, height ,bombsCount){
    const field = document.querySelector('.field');
    const cellCount = width * height;
    field.innerHTML='<button></button>'.repeat(cellCount)
}