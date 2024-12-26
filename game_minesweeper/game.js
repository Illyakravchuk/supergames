function startGame(width, height, bombsCount) {
    const field = document.querySelector('.field');
    const ratingCounter = document.getElementById('opened-count');
    const restartButton = document.getElementById('restart-button');
    const timerDisplay = document.getElementById('timer');
    const startButton = document.getElementById('start-button');
  
    const cellCount = width * height;
    field.innerHTML = '';
    const cells = [];
    for (let i = 0; i < cellCount; i++) {
      const button = document.createElement('button');
      field.appendChild(button);
      cells.push(button);
    }
  
    let closeCount = cellCount;
    let flaggedCount = 0;
    let openedCells = 0;
    let timerInterval;
    let timeElapsed = 0;
    let gameStarted = false;
  
    const explosionSound = new Audio('mine_explosion.mp3');
 
    document.getElementById('start-button').addEventListener('click', () => {
        const backgroundMusic = new Audio('background_music.mp3');
        backgroundMusic.loop = true;
        backgroundMusic.volume = 0.1;
        backgroundMusic.play();
        
        startButton.style.display = 'none';
        field.style.display = 'grid';
        restartButton.style.display = 'inline-block';
    });

    const bombs = [...Array(cellCount).keys()]
      .sort(() => Math.random() - 0.5)
      .slice(0, bombsCount);

    updateRating(0);

    cells.forEach(cell => {
      cell.classList.remove('flag');
      cell.innerHTML = '';
      cell.disabled = false;
    });

    flaggedCount = 0;

    function updateTimerDisplay(time) {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        timerDisplay.textContent = `Час: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }      

    restartButton.addEventListener('click', () => {
      clearInterval(timerInterval);
      window.location.href = "./index.html";
      startGame(width, height, bombsCount);
    });

    field.addEventListener('click', event => {
      if (event.target.tagName !== 'BUTTON' || event.target.classList.contains('flag')) {
        return;
      }

      if (!gameStarted) {
        gameStarted = true;
        timerInterval = setInterval(() => {
          timeElapsed++;
          updateTimerDisplay(timeElapsed);
        }, 1000);
      }

      const index = cells.indexOf(event.target);
      const column = index % width;
      const row = Math.floor(index / width);
      open(row, column);
    });

    field.addEventListener('contextmenu', event => {
      event.preventDefault();
      event.stopPropagation();

      if (event.target.tagName !== 'BUTTON') return;
      const cell = event.target;

      if (cell.disabled) return;

      if (cell.classList.contains('flag')) {
        cell.classList.remove('flag');
        cell.innerHTML = '';
        updateFlaggedCount(-1);
      } else if (flaggedCount < bombsCount) {
        cell.classList.add('flag');
        cell.innerHTML = '🚩';
        updateFlaggedCount(1);
      } else {
        alert(`Максимальна кількість прапорців досягнута! Прапорців: ${flaggedCount}, Максимум: ${bombsCount}.`);
      }
    });

    function updateFlaggedCount(delta) {
      const newFlaggedCount = flaggedCount + delta;

      if (newFlaggedCount >= 0 && newFlaggedCount <= bombsCount) {
        flaggedCount = newFlaggedCount;
      } else {
        console.log('Перевищено кількість прапорців!');
      }
    }

    function isValid(row, column) {
      return row >= 0 && row < height && column >= 0 && column < width;
    }

    function getCount(row, column) {
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

    function showGameOverMessage(message) {
      const gameOverMessage = document.getElementById('game-over-message');
      const gameOverText = document.getElementById('game-over-text');
      gameOverText.textContent = message;
      gameOverMessage.style.display = 'block';
    
      const restartButtonOver = document.getElementById('restart-button-over');
      restartButtonOver.addEventListener('click', () => {
        gameOverMessage.style.display = 'none'; 
        window.location.href = "./index.html";
        startGame(width, height, bombsCount);
      });
    }
    

    function open(row, column) {
      if (!isValid(row, column)) return;
    
      const index = row * width + column;
      const cell = cells[index];
    
      if (cell.disabled || cell.classList.contains('flag')) return;
    
      cell.disabled = true;
      openedCells++;
      closeCount--;
      updateRating(openedCells);
    
      if (isBomb(row, column)) {
        cell.classList.add('bomb-hit');
        cell.innerHTML = '💣';  
        explosionSound.play();
        revealAllBombs();
        clearInterval(timerInterval);
        showGameOverMessage(`Ви програли! Відкрито клітинок: ${openedCells}. Час: ${formatTime(timeElapsed)}`);
        return;
      }
    
      const count = getCount(row, column);
      if (count !== 0) {
        cell.innerHTML = count;
        updateCellColor(cell, count);
      } else {
        for (let x = -1; x <= 1; x++) {
          for (let y = -1; y <= 1; y++) {
            open(row + y, column + x);
          }
        }
      }
    
      if (closeCount <= bombsCount) {
        clearInterval(timerInterval);
        showGameOverMessage(`Ви виграли! Відкрито клітинок: ${openedCells}. Час: ${formatTime(timeElapsed)}`);
      }
    }
  
    function isBomb(row, column) {
      if (!isValid(row, column)) return false;
      const index = row * width + column;
      return bombs.includes(index);
    }
  
    function revealAllBombs() {
      bombs.forEach(index => {
        const cell = cells[index];
        cell.innerHTML = '💣';
        cell.disabled = true;
      });
    }

    function updateRating(value) {
      ratingCounter.textContent = value;
    }

    function formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    function updateCellColor(cell, count) {
      const colors = ['green', 'blue', 'red', 'purple', 'brown', 'orange', 'pink', 'black'];
      cell.style.color = colors[count - 1];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const field = document.querySelector('.field');
    const restartButton = document.getElementById('restart-button');
  
    startButton.addEventListener('click', () => {
      startButton.classList.add('hidden');
      field.style.display = 'grid';
      restartButton.style.display = 'inline-block';
    });
    
    const width = 8;
    const height = 8;
    const bombsCount = 8;
    startGame(width, height, bombsCount);
});
