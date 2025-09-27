document.addEventListener('DOMContentLoaded', function () {
  // Загружаем цены один раз
  fetch('/data/prices.json')
    .then(response => response.json())
    .then(pricesArr => {
      // Преобразуем массив в объект для быстрого поиска
      const prices = {};
      pricesArr.forEach(item => {
        // Всегда приводим к нижнему регистру
        prices[item.filename.toLowerCase()] = item.price;
      });

      function getFilename(img) {
        // Используем src, если есть, иначе data-src
        let src = img.getAttribute('src') || '';
        if (!src || src.endsWith('placeholder.png')) {
          src = img.getAttribute('data-src') || '';
        }
        let filename = src.split('/').pop();
        // Предыдущее регулярное выражение (с двойным экранированием)
        filename = filename.replace(/_hu_.+\.(png|jpg|jpeg|webp)$/i, '.$1').toLowerCase();
        return { filename, src };
      }

      document.querySelectorAll('img').forEach(img => {
        img.addEventListener('click', function () {
          const { filename, src } = getFilename(img);
          const price = prices[filename];
          if (price !== undefined) {
            alert('Цена: ' + price + '¥\nФайл: ' + filename + '\nSRC: ' + src);
          } else {
            alert('Цена не найдена для ' + filename + '\nSRC: ' + src);
          }
        });
      });
    })
    .catch(err => {
      console.error('Ошибка загрузки prices.json', err);
    });
});