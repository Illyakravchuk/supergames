class Game {
    constructor(parentElement, size = 4) {
      this.size = size;
      const gameFieldElement = createAndAppend({
        className: 'game',
        parentElement,
      });
  
      this.headerElement = document.querySelector('.header');
      this.ratingElement = document.querySelector('#rating');
      this.timerElement = document.querySelector('#timer');
      this.fieldElement = document.querySelector('.field');
      this.restartButton = document.querySelector('#restartButton');
      
      this.rating = 0;
      this.startTime = Date.now();
      this.field = [];
  
      this.fieldElement.style.display = 'none';
      this.restartButton.style.display = 'none';
      this.timerInterval = null;

  
      for (let i = 0; i < size; i++) {
        this.field[i] = [];
        for (let k = 0; k < size; k++) {
          this.field[i][k] = new Cell(this.fieldElement, this);
        }
      }
  
      this.startButton = document.querySelector('#startButton');
      this.startButton.addEventListener('click', this.startGame.bind(this));
  
      this.restartButton.addEventListener('click', this.restartGame.bind(this));
  
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
  
      this.swipeSound = new Audio('swipe.mp3');
      this.backgroundMusic = new Audio('background_music.mp3');
      this.backgroundMusic.loop = true;
      this.backgroundMusic.volume = 0.1;
    }

    showMessage(message) {
      const messageElement = document.getElementById('gameMessages');
      messageElement.textContent = message;
      messageElement.style.display = 'block';
      messageElement.classList.add('show');
      
      this.gameOver = true;
      this.updateGameControls();
    }
    

    updateGameControls() {
      if (this.gameOver) {
        const restartButton = document.getElementById('restartButton');
        restartButton.style.display = 'block';
      }
    }
    
    
  
    startGame() {
      this.fieldElement.style.display = 'grid';
      this.restartButton.style.display = 'inline-block';
  
      this.startButton.style.display = 'none';
  
      this.backgroundMusic.play();
  
      this.restartGame();
  
      this.startTime = Date.now();
      this.updateTimer();
    }
  
    restartGame() {
      this.rating = 0;
      this.startTime = Date.now();
      this.ratingElement.innerHTML = 'Рейтинг: 0';
      this.timerElement.innerHTML = 'Час: 0:00';
      
      for (let i = 0; i < this.size; i++) {
        for (let k = 0; k < this.size; k++) {
          this.field[i][k].clear();
        }
      }
      
      this.spawnUnit();
      
      const messageElement = document.getElementById('gameMessages');
      messageElement.style.display = 'none';
      
      this.gameOver = false;
      this.updateGameControls();
    }
    
  
    updateTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }
    
      this.timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;
        this.timerElement.innerHTML = `Час: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      }, 1000);
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
        this.checkGameOver();
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
          }
        }
      }
      if (hasMoved) {
        this.spawnUnit();
        this.checkAndPlaySwipeSound();
      }
      this.checkGameOver();
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
          }
        }
      }
      if (hasMoved) {
        this.spawnUnit();
        this.checkAndPlaySwipeSound();
      }
      this.checkGameOver();
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
          }
        }
      }
      if (hasMoved) {
        this.spawnUnit();
        this.checkAndPlaySwipeSound();
      }
      this.checkGameOver();
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
  
          while (nextCellKey >= 0) {
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
          }
        }
      }
      if (hasMoved) {
        this.spawnUnit();
        this.checkAndPlaySwipeSound();
      }
      this.checkGameOver();
    }
  
    checkAndPlaySwipeSound() {
      if (this.rating > 0 || this.hasMoved) {
        this.swipeSound.play();
      }
    }
  
    checkGameOver() {
      let isGameOver = true;
    
      for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
          const currentCell = this.field[i][j];
    
          if (currentCell.value === 2048) {
            this.showMessage('Ви перемогли!');
            clearInterval(this.timerInterval);
            return;
          }
    
          if (currentCell.isEmpty) {
            isGameOver = false;
            break;
          }
    
          const neighbors = [
            { x: i - 1, y: j },
            { x: i + 1, y: j },
            { x: i, y: j - 1 },
            { x: i, y: j + 1 } 
          ];
    
          for (let neighbor of neighbors) {
            const { x, y } = neighbor;
            if (x >= 0 && y >= 0 && x < this.size && y < this.size) {
              const nextCell = this.field[x][y];
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
    
      if (isGameOver) {
        this.showMessage('Гра закінчена! Спробуйте знову.');
        clearInterval(this.timerInterval);
      }
    }
    
  
    getTime() {
      const elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
      const minutes = Math.floor(elapsedTime / 60);
      const seconds = elapsedTime % 60;
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; 
    }
  }
  
  const game = new Game(document.body);
  