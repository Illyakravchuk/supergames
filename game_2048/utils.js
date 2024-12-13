// Функція для створення елементів і додавання їх на сторінку
const createAndAppend = function({ className, parentElement, value }, tag = 'div') {
    const element = document.createElement(tag);
    element.className = className;
    if (value) {
      element.innerHTML = value;
    }
  
    parentElement.appendChild(element);
    return element;
  };
  
  // Функція для генерації випадкових чисел в заданому діапазоні
  const randomInterval = function(from, to) {
    return Math.round(Math.random() * (to - from + 1) + from);
  };
  