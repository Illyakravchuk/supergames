class Game {
    constructor(parentElement, size = 4) {
      this.size = size;
      // Створення елемента для поля гри
      const gameFieldElement = createAndAppend({
        className: 'game',
        parentElement,
      });
  
      // Вибір елементів для заголовка, рейтингу, таймера та поля гри
      this.headerElement = document.querySelector('.header');
      this.ratingElement = document.querySelector('#rating');
      this.timerElement = document.querySelector('#timer');
      this.fieldElement = document.querySelector('.field');
      this.restartButton = document.querySelector('#restartButton');
      
      this.rating = 0; // Початковий рейтинг
      this.startTime = Date.now(); // Початковий час для таймера
      this.field = []; // Масив для зберігання клітинок поля
  
      // Спочатку приховуємо поле гри та кнопку перезапуску
      this.fieldElement.style.display = 'none';
      this.restartButton.style.display = 'none';
  
      // Створення поля гри: заповнюємо масив клітинок
      for (let i = 0; i < size; i++) {
        this.field[i] = [];
        for (let k = 0; k < size; k++) {
          this.field[i][k] = new Cell(this.fieldElement, this);
        }
      }
  
      // Додаємо слухача подій для кнопки старту
      this.startButton = document.querySelector('#startButton');
      this.startButton.addEventListener('click', this.startGame.bind(this));
  
      // Слухач події для кнопки перезапуску
      this.restartButton.addEventListener('click', this.restartGame.bind(this));
  
      // Слухач подій для натискання клавіш
      window.onkeyup = function (e) {
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
  
      // Аудіо для руху плиток та фонова музика
      this.swipeSound = new Audio('swipe.mp3');
      this.backgroundMusic = new Audio('background_music.mp3');
      this.backgroundMusic.loop = true; // Багатократне відтворення фонової музики
      this.backgroundMusic.volume = 0.1; // Низька гучність фонової музики
    }
  
    startGame() {
      // Показуємо поле гри та кнопку перезапуску, коли гра починається
      this.fieldElement.style.display = 'grid'; // Робимо поле видимим
      this.restartButton.style.display = 'inline-block'; // Показуємо кнопку перезапуску
  
      // Приховуємо кнопку старту
      this.startButton.style.display = 'none'; // Ховаємо кнопку старту
  
      // Запускаємо фонову музику
      this.backgroundMusic.play();
  
      // Перезапускаємо гру
      this.restartGame();
  
      // Починаємо таймер
      this.startTime = Date.now(); // Скидаємо час початку
      this.updateTimer(); // Починаємо оновлення таймера
    }
  
    restartGame() {
      // Скидаємо рейтинг та таймер
      this.rating = 0;
      this.startTime = Date.now();
      this.ratingElement.innerHTML = 'Рейтинг: 0';
      this.timerElement.innerHTML = 'Час: 0:00';
  
      // Очищаємо поле гри
      for (let i = 0; i < this.size; i++) {
        for (let k = 0; k < this.size; k++) {
          this.field[i][k].clear(); // Очищаємо кожну клітинку
        }
      }
  
      // Відроджуємо одиниці
      this.spawnUnit();
    }
  
    updateTimer() {
      setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - this.startTime) / 1000); // Обчислюємо час
        const minutes = Math.floor(elapsedTime / 60); // Хвилини
        const seconds = elapsedTime % 60; // Секунди
        this.timerElement.innerHTML = `Час: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; // Оновлюємо таймер
      }, 1000);
    }
  
    spawnUnit() {
      const emptyCells = [];
  
      // Збираємо всі порожні клітинки
      for (let i = 0; i < this.field.length; i++) {
        for (let p = 0; p < this.field[i].length; p++) {
          if (!this.field[i][p].value) {
            emptyCells.push(this.field[i][p]); // Додаємо порожні клітинки в масив
          }
        }
      }
  
      // Якщо є порожні клітинки, спавнимо нову плитку
      if (emptyCells.length) {
        emptyCells[randomInterval(0, emptyCells.length - 1)].spawn();
      } else {
        this.checkGameOver(); // Перевірка на кінець гри
      }
    }
  
    set rating(value) {
      this._rating = value;
      this.ratingElement.innerHTML = 'Рейтинг: ' + value;
    }
  
    get rating() {
      return this._rating;
    }
  
    addRating(value) {
      this.rating += value; // Додаємо очки до рейтингу
    }
  
    moveRight() {
      let hasMoved = false;
      // Рух плиток вправо
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
                this.field[i][nextCellKey].merge(currentCell); // Злиття плиток
                hasMoved = true;
              } else if (!nextCell.isEmpty && nextCellKey - 1 !== k) {
                this.field[i][nextCellKey - 1].merge(currentCell); // Злиття плиток
                hasMoved = true;
              }
              break;
            }
            nextCellKey++;
          }
        }
      }
      if (hasMoved) {
        this.spawnUnit(); // Спавнимо нову плитку
        this.checkAndPlaySwipeSound(); // Відтворюємо звук руху плиток
      }
      this.checkGameOver(); // Перевірка на кінець гри
    }
  
    moveLeft() {
      let hasMoved = false;
      // Рух плиток вліво
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
                this.field[i][nextCellKey].merge(currentCell); // Злиття плиток
                hasMoved = true;
              } else if (!nextCell.isEmpty && nextCellKey + 1 !== k) {
                this.field[i][nextCellKey + 1].merge(currentCell); // Злиття плиток
                hasMoved = true;
              }
              break;
            }
            nextCellKey--;
          }
        }
      }
      if (hasMoved) {
        this.spawnUnit(); // Спавнимо нову плитку
        this.checkAndPlaySwipeSound(); // Відтворюємо звук руху плиток
      }
      this.checkGameOver(); // Перевірка на кінець гри
    }
  
    isFirstKey(key) {
      return key === 0;
    }
  
    isLastKey(key) {
      return key === (this.size - 1);
    }
  
    moveDown() {
      let hasMoved = false;
      // Рух плиток вниз
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
                this.field[nextCellKey][k].merge(currentCell); // Злиття плиток
                hasMoved = true;
              } else if (!nextCell.isEmpty && nextCellKey - 1 !== i) {
                this.field[nextCellKey - 1][k].merge(currentCell); // Злиття плиток
                hasMoved = true;
              }
              break;
            }
            nextCellKey++;
          }
        }
      }
      if (hasMoved) {
        this.spawnUnit(); // Спавнимо нову плитку
        this.checkAndPlaySwipeSound(); // Відтворюємо звук руху плиток
      }
      this.checkGameOver(); // Перевірка на кінець гри
    }
  
    moveTop() {
      let hasMoved = false;
      // Рух плиток вгору
      for (let k = 0; k < this.size; k++) {
        for (let i = 1; i < this.size; i++) {
          const currentCell = this.field[i][k];
          if (currentCell.isEmpty) {
            continue;
          }
  
          let nextCellKey = i - 1;
  
          while (nextCellKey >= 0) {
            let nextCell = this.field[nextCellKey][k];
  
            if (!nextCell.isEmpty || this.isFirstKey(nextCellKey)) {
              if ((nextCell.isEmpty && this.isFirstKey(nextCellKey)) ||
                  (nextCell.isSameTo(currentCell))) {
                this.field[nextCellKey][k].merge(currentCell); // Злиття плиток
                hasMoved = true;
              } else if (!nextCell.isEmpty && nextCellKey + 1 !== i) {
                this.field[nextCellKey + 1][k].merge(currentCell); // Злиття плиток
                hasMoved = true;
              }
              break;
            }
            nextCellKey--;
          }
        }
      }
      if (hasMoved) {
        this.spawnUnit(); // Спавнимо нову плитку
        this.checkAndPlaySwipeSound(); // Відтворюємо звук руху плиток
      }
      this.checkGameOver(); // Перевірка на кінець гри
    }
  
    checkAndPlaySwipeSound() {
      // Перевірка, чи змінився рейтинг або відбувся рух плиток
      if (this.rating > 0 || this.hasMoved) {
        this.swipeSound.play(); // Відтворюємо звук
      }
    }
  
    checkGameOver() {
      let isGameOver = true;
  
      // Перевірка наявності плитки зі значенням 2048
      for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
          const currentCell = this.field[i][j];
  
          // Перевірка умови виграшу
          if (currentCell.value === 2048) {
            alert(`Ви виграли! Час: ${this.getTime()}`);
            this.restartGame(); // Перезапуск гри після перемоги
            return;
          }
  
          // Якщо клітинка порожня, гра ще не завершена
          if (currentCell.isEmpty) {
            isGameOver = false;
            break;
          }
  
          // Перевірка можливості злиття з сусідніми клітинками
          const neighbors = [
            { x: i - 1, y: j }, // Вверх
            { x: i + 1, y: j }, // Вниз
            { x: i, y: j - 1 }, // Ліворуч
            { x: i, y: j + 1 }  // Праворуч
          ];
  
          for (let neighbor of neighbors) {
            const { x, y } = neighbor;
            if (x >= 0 && y >= 0 && x < this.size && y < this.size) {
              const nextCell = this.field[x][y];
              // Якщо є можливість злиття або переміщення
              if (nextCell.isEmpty || currentCell.isSameTo(nextCell)) {
                isGameOver = false;
                break;
              }
            }
          }
  
          if (!isGameOver) break;
        }
  
        if (!isGameOver) break;
      }
  
      // Якщо гра завершена, відображаємо повідомлення
      if (isGameOver) {
        alert(`Гра закінчена! Час: ${this.getTime()}`);
        this.restartGame();  // Автоматичний перезапуск гри після поразки
      }
    }
  
    getTime() {
      const elapsedTime = Math.floor((Date.now() - this.startTime) / 1000); // Обчислення часу
      const minutes = Math.floor(elapsedTime / 60); // Хвилини
      const seconds = elapsedTime % 60; // Секунди
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; // Форматування часу
    }
  }
  
  const game = new Game(document.body);
  