'use strict';

function startGame(width, height, bombsCount) {
  const field = document.querySelector('.field');
  const ratingCounter = document.getElementById('opened-count');
  const restartButton = document.getElementById('restart-button');

  const cellCount = width * height;
  field.innerHTML = '<button></button>'.repeat(cellCount); // генеруємо кнопки
  const cells = [...field.children];
  let closeCount = cellCount;
  let flaggedCount = 0; // кількість прапорців
  let openedCells = 0;  // кількість відкритих клітинок

  // Підключаємо аудіо для вибуху
  const explosionSound = new Audio('medium-explosion-40472.mp3');

  const bombs = [...Array(cellCount).keys()]
    .sort(() => Math.random() - 0.5)
    .slice(0, bombsCount);

  // Скидання рейтингу
  updateRating(0);

  // Слухаємо кліки для відкриття клітинок
  field.addEventListener('click', event => {
    if (event.target.tagName !== 'BUTTON' || event.target.classList.contains('flag')) {
      return;
    }
    const index = cells.indexOf(event.target);
    const column = index % width;
    const row = Math.floor(index / width);
    open(row, column);
  });

  // Слухаємо правий клік для прапорців
  field.addEventListener('contextmenu', event => {
    event.preventDefault();
    if (event.target.tagName !== 'BUTTON') {
      return;
    }
    const cell = event.target;

    // Дозволяємо ставити прапорці навіть на ще не відкритих клітинках
    if (!cell.disabled) {
      if (cell.classList.contains('flag')) {
        cell.classList.remove('flag');
        cell.innerHTML = '';
        flaggedCount--;
      } else {
        cell.classList.add('flag');
        cell.innerHTML = '🚩';
        flaggedCount++;
      }
    }
  });

  // Кнопка "Грати заново"
  restartButton.addEventListener('click', () => {
    startGame(width, height, bombsCount);
  });

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

function open(row, column) {
  if (!isValid(row, column)) return;

  const index = row * width + column;
  const cell = cells[index];

  if (cell.disabled || cell.classList.contains('flag')) return;

  cell.disabled = true;
  openedCells++; // збільшуємо кількість відкритих клітинок
  closeCount--;
  updateRating(openedCells); // Оновлюємо рейтинг

  if (isBomb(row, column)) {
    cell.classList.add('bomb-hit'); // Додаємо клас 'bomb-hit' для зміни фону
    cell.innerHTML = '💣';  
    explosionSound.play(); // Відтворення звуку вибуху
    revealAllBombs();
    setTimeout(() => {
      alert(`Ви програли! Відкрито клітинок: ${openedCells}`);
      startGame(width, height, bombsCount);
    }, 100); // Затримка перед показом повідомлення

    return;
  }

  const count = getCount(row, column);
  if (count !== 0) {
    cell.innerHTML = count;
  } else {
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        open(row + y, column + x);
      }
    }
  }

  if (closeCount <= bombsCount) {
    alert(`Ви виграли! Відкрито клітинок: ${openedCells}`);
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
}

// Запуск гри
document.addEventListener('DOMContentLoaded', () => {
  const width = 8;
  const height = 8;
  const bombsCount = 8;
  startGame(width, height, bombsCount);
});
