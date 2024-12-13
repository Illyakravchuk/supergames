function startGame(width, height, bombsCount) {
    // Отримання елементів DOM
    const field = document.querySelector('.field');
    const ratingCounter = document.getElementById('opened-count');
    const restartButton = document.getElementById('restart-button');
    const timerDisplay = document.getElementById('timer'); // елемент для відображення часу
    const startButton = document.getElementById('start-button'); // кнопка "Start Game"
  
    // Генерація клітинок
    const cellCount = width * height;
    field.innerHTML = '';  // Очищення поля перед кожною новою грою
    const cells = [];
    for (let i = 0; i < cellCount; i++) {
      const button = document.createElement('button');
      field.appendChild(button);
      cells.push(button);
    }
  
    // Ініціалізація змінних гри
    let closeCount = cellCount;
    let flaggedCount = 0; // кількість прапорців
    let openedCells = 0;  // кількість відкритих клітинок
    let timerInterval; // змінна для зберігання інтервалу таймера
    let timeElapsed = 0; // змінна для відстеження часу
    let gameStarted = false; // флаг для відстеження початку гри
  
    // Підключення аудіо для вибуху
    const explosionSound = new Audio('mine_explosion.mp3');
 
    // Додаємо фонову музику при натисканні кнопки "Start"
    document.getElementById('start-button').addEventListener('click', () => {
        const backgroundMusic = new Audio('background_music.mp3');
        backgroundMusic.loop = true; // Встановлюємо повторення
        backgroundMusic.volume = 0.1; // Задаємо гучність
        backgroundMusic.play(); // Починаємо відтворення
        
        // Ховаємо кнопку "Почати гру" і показуємо поле гри та кнопку для перезапуску
        startButton.style.display = 'none';
        field.style.display = 'grid'; // Показуємо поле гри
        restartButton.style.display = 'inline-block'; // Показуємо кнопку перезапуску
    });

    // Створення випадкових бомб
    const bombs = [...Array(cellCount).keys()]
      .sort(() => Math.random() - 0.5)
      .slice(0, bombsCount);

    // Оновлюємо рейтинг
    updateRating(0);

    // Очищаємо клітинки та скидаємо прапорці перед новою грою
    cells.forEach(cell => {
      cell.classList.remove('flag');
      cell.innerHTML = '';
      cell.disabled = false; // Забезпечуємо, щоб клітинки не були заблоковані
    });

    // Оновлюємо кількість прапорців
    flaggedCount = 0;

    // Оновлюємо відображення таймера
    function updateTimerDisplay(time) {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        timerDisplay.textContent = `Час: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }      

    // Обробка натискання на кнопку перезапуску гри
    restartButton.addEventListener('click', () => {
      clearInterval(timerInterval); // Зупиняємо таймер при перезапуску гри
      window.location.href = "./index.html";
      startGame(width, height, bombsCount); // Перезапускаємо гру
    });

    // Обробник кліків для відкриття клітинок
    field.addEventListener('click', event => {
      if (event.target.tagName !== 'BUTTON' || event.target.classList.contains('flag')) {
        return; // Ігноруємо прапорці
      }

      if (!gameStarted) {
        gameStarted = true;
        timerInterval = setInterval(() => {
          timeElapsed++;
          updateTimerDisplay(timeElapsed); // Оновлюємо таймер кожну секунду
        }, 1000);
      }

      const index = cells.indexOf(event.target);
      const column = index % width;
      const row = Math.floor(index / width);
      open(row, column);
    });

    // Обробник правого кліку для прапорців
    field.addEventListener('contextmenu', event => {
      event.preventDefault();
      event.stopPropagation();

      if (event.target.tagName !== 'BUTTON') return; // Тільки для клітинок
      const cell = event.target;

      if (cell.disabled) return; // Ігноруємо відкриті клітинки

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

    // Оновлення кількості прапорців
    function updateFlaggedCount(delta) {
      const newFlaggedCount = flaggedCount + delta;

      if (newFlaggedCount >= 0 && newFlaggedCount <= bombsCount) {
        flaggedCount = newFlaggedCount;
      } else {
        console.log('Перевищено кількість прапорців!');
      }
    }

    // Перевірка валідності клітинки
    function isValid(row, column) {
      return row >= 0 && row < height && column >= 0 && column < width;
    }

    // Підрахунок бомб навколо клітинки
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

    // Відкриття клітинки
    function open(row, column) {
      if (!isValid(row, column)) return;
    
      const index = row * width + column;
      const cell = cells[index];
    
      if (cell.disabled || cell.classList.contains('flag')) return;
    
      cell.disabled = true;
      openedCells++; // Збільшуємо кількість відкритих клітинок
      closeCount--;
      updateRating(openedCells); // Оновлюємо рейтинг
    
      if (isBomb(row, column)) {
        cell.classList.add('bomb-hit'); // Додаємо клас для вибуху
        cell.innerHTML = '💣';  
        explosionSound.play(); // Відтворення звуку вибуху
        revealAllBombs();
        clearInterval(timerInterval); // Зупиняємо таймер при програші
        setTimeout(() => {
          alert(`Ви програли! Відкрито клітинок: ${openedCells}. Час: ${formatTime(timeElapsed)}`);
          window.location.href = "./index.html"
          startGame(width, height, bombsCount); // Перезапускаємо гру
        }, 100); // Затримка перед повідомленням
    
        return;
      }
    
      const count = getCount(row, column);
      if (count !== 0) {
        cell.innerHTML = count;
        // Оновлення кольору числа
        updateCellColor(cell, count);
      } else {
        for (let x = -1; x <= 1; x++) {
          for (let y = -1; y <= 1; y++) {
            open(row + y, column + x);
          }
        }
      }
    
      if (closeCount <= bombsCount) {
        clearInterval(timerInterval); // Зупиняємо таймер при виграші
        setTimeout(() => {
          alert(`Ви виграли! Відкрито клітинок: ${openedCells}. Час: ${formatTime(timeElapsed)}`);
          window.location.href = "./index.html"
          startGame(width, height, bombsCount); // Перезапускаємо гру
        }, 100); // Затримка перед повідомленням
      }
    }
  
    // Перевірка, чи клітинка є бомбою
    function isBomb(row, column) {
      if (!isValid(row, column)) return false;
      const index = row * width + column;
      return bombs.includes(index);
    }
  
    // Відкриття всіх бомб при програші
    function revealAllBombs() {
      bombs.forEach(index => {
        const cell = cells[index];
        cell.innerHTML = '💣';
        cell.disabled = true;
      });
    }

    // Оновлення рейтингу
    function updateRating(value) {
      ratingCounter.textContent = value;
    }

    // Форматування часу
    function formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    // Оновлення кольору клітинки в залежності від числа
    function updateCellColor(cell, count) {
      const colors = ['green', 'blue', 'red', 'purple', 'brown', 'orange', 'pink', 'black'];
      cell.style.color = colors[count - 1];
    }
}

// Запуск гри після завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const field = document.querySelector('.field');
    const restartButton = document.getElementById('restart-button');
  
    startButton.addEventListener('click', () => {
      // Ховаємо кнопку "Start Game" і показуємо поле гри
      startButton.classList.add('hidden');
      field.style.display = 'grid'; // Показуємо поле гри
      restartButton.style.display = 'inline-block'; // Показуємо кнопку перезапуску
    });
    
    // Ініціалізація гри
    const width = 8;
    const height = 8;
    const bombsCount = 8;
    startGame(width, height, bombsCount);
});
