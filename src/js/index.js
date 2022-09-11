// поки що зшиваємо тут, пізніше будемо все впорядковувати

// =========____ЯКЩО КОД ЗАКРУЧЕНИЙ КОМЕНТУЄМО ВСЕ____==========

// Імпорти сюди
import { trendingFetch } from './apies';
import { cardsMarkup } from './movie-cards-markup';



// Тут додаємо ваші глобальні змінні
let items = [];

// Наш реф по якому ми звертаємось!
const gallery = document.querySelector('.movies__gallery');


// Тут додаємо слухачі подій



// ========_____Пишемо сюди основні функції_____===============

// Функція для виклику карток за популярним рейтингом
async function render() {
  const data = await trendingFetch();
  items = data.results;
  // console.log('items', items);
  const createGAl = cardsMarkup(items);
  gallery.innerHTML = createGAl;
}
render();
