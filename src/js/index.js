// поки що зшиваємо тут, пізніше будемо все впорядковувати

// =========____ЯКЩО КОД ЗАКРУЧЕНИЙ КОМЕНТУЄМО ВСЕ____==========

import { trendingFetch, getMoviesByQueryKey } from './apies';
import { cardsMarkup } from './movie-cards-markup';

// Тут додаємо ваші глобальні змінні
let queryString = '';

// Наш реф по якому ми звертаємось!
const gallery = document.querySelector('.movies__gallery');

const searchForm = document.querySelector('.header__search');
const searchInput = document.querySelector('.header__search-input');

// Тут додаємо слухачі подій

searchInput.addEventListener('input', e => {
  queryString = e.target.value;
  console.log(queryString);
});

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  console.log(getMoviesByQueryKey(queryString));
  return getMoviesByQueryKey(queryString);
});

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
