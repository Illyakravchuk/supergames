// Клас для клітинки гри
class Cell {
    constructor(fieldElement, game) {
      this.game = game;  // Посилання на гру
      this.element = createAndAppend({
        className: 'cell',  // Створення елементу клітинки з класом 'cell'
        parentElement: fieldElement  // Додавання елементу до ігрового поля
      });
  
      // Ініціалізація клітинки (запуск плитки зі значенням 2 або 4)
      if (Math.random() > 0.8) {
        this.spawn();
      }
    }
  
    // Отримуємо значення клітинки
    get value() {
      return this._value || 0;
    }
  
    // Встановлюємо нове значення клітинки
    set value(value) {
      const oldValue = this._value;  // Зберігаємо старе значення
      this._value = value;  // Оновлюємо значення плитки
      this.element.innerHTML = value === 0 ? '' : value;  // Оновлюємо відображення значення плитки
  
      // Оновлюємо колір плитки в залежності від її значення
      this.updateTileColor();
  
      // Якщо значення змінилось, перевіряємо та відтворюємо звук
      if (oldValue !== value) {
        this.game.checkAndPlaySwipeSound();
      }
    }
  
    // Спавнінг плитки з випадковим значенням (2 або 4)
    spawn() {
      this.value = Math.random() > 0.5 ? 4 : 2;
    }
  
    // Очищення плитки
    clear() {
      this.value = '';  // Очищаємо значення плитки
    }
  
    // Об'єднання плиток (якщо вони мають однакові значення)
    merge(cell) {
      if (this.value) {
        // Збільшення рейтингу гри після об'єднання плиток
        this.game.addRating(this.value + cell.value);
      }
  
      // Додаємо значення плитки та очищаємо другу плитку
      this.value += cell.value;
      cell.clear();
  
      // Перевірка та відтворення звуку після злиття плиток
      this.game.checkAndPlaySwipeSound();
    }
  
    // Перевірка чи мають плитки однакові значення
    isSameTo(cell) {
      return this.value === cell.value;
    }
  
    // Перевірка чи є плитка порожньою
    get isEmpty() {
      return this.value === 0;
    }
  
    // Оновлення кольору плитки залежно від її значення
    updateTileColor() {
      // Видаляємо старі класи з елементу
      this.element.classList.remove(...this.element.classList);
  
      // Додаємо новий клас відповідно до значення плитки
      this.element.classList.add('cell', 'value-' + this.value);
    }
  }
  