// поки що зшиваємо тут, пізніше будемо все впорядковувати

// =========____ЯКЩО КОД ЗАКРУЧЕНИЙ КОМЕНТУЄМО ВСЕ____==========
import { trendingFetch } from './apies';
import { fetchByID } from './apies';

import { cardsMarkup } from './movie-cards-markup';
import { modalOneFilmMarkup } from './movie-cards-markup';



// Наш реф по якому ми звертаємось!
const gallery = document.querySelector('.movies__gallery');

// Тут додаємо ваші глобальні змінні

// Тут додаємо слухачі подій

gallery.addEventListener('click', onClickModalOpen);



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

// Функція для рендеру модального вікна ОДНОГО ФІЛЬМУ
async function renderOneFilmModal (id) {
  const data = await fetchByID(id);
  // console.log(data.genres[0].name);
  gallery.insertAdjacentHTML('afterend', modalOneFilmMarkup(data));
}

// Функція-колбек для рендеру модалки по кліку
async function onClickModalOpen(e) {
  e.preventDefault();
  const movieId = e.target.dataset.movieCartId;
  if (!movieId) return;

  await renderOneFilmModal(movieId);
  // console.log(movieId);
  const modalEl = document.querySelector('.backdrop');
  // console.log(modalEl)
  modalEl.classList.toggle("is-hidden");
}