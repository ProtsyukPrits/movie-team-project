// поки що зшиваємо тут, пізніше будемо все впорядковувати

// =========____ЯКЩО КОД ЗАКРУЧЕНИЙ КОМЕНТУЄМО ВСЕ____==========

// Імпорти сюди

import { trendingFetch, getMoviesByQueryKey, fetchByID } from './apies';
import { cardsMarkup, modalOneFilmMarkup } from './movie-cards-markup';
import { prepareMovieData } from './prepare-movie-data';
import Pagination from 'tui-pagination';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import * as basicLightbox from 'basiclightbox';

// Тут додаємо ваші глобальні змінні
let queryString = '';
let genreValue = 0;
let items = [];
let page = 1;

// Наш реф по якому ми звертаємось!
const gallery = document.querySelector('.movies__gallery');
const container = document.getElementById('pagination');
const searchForm = document.querySelector('.header__search');
const searchInput = document.querySelector('.header__search-input');
const moviesContainer = document.querySelector('.movies__container');
const searchByGenres = document.querySelector('.header__filter-genres');

// Тут додаємо слухачі подій
gallery.addEventListener('click', onClickOneFilmCard);

if (searchInput) {
  searchInput.addEventListener('input', e => {
    queryString = e.target.value;
    searchForm.style.borderBottomColor = '#ffffff';
  });

  searchForm.addEventListener('submit', e => {
    e.preventDefault();

    if (queryString === '') {
      searchForm.style.borderBottomColor = 'red';
      return Notify.info(
        'Please, type the title of the film, and click the search button'
      );
    }
    return getMoviesByQueryKey(queryString)
      .then(data => filterByGenres(data))
      .then(data => renderByQuery(data));
  });

  searchByGenres.addEventListener('change', onChangeByGenres);
}

// ========_____Пишемо сюди основні функції_____===============

// Pagination
// ==============================================================
// створюємо pagination event на  основі коструктора, та додаємо опції
const pagination = new Pagination(container, {
  totalItems: 1000,
  itemsPerPage: 10,
  visiblePages: 5,
  page: 1,
  centerAlign: true,
});

// Отримуємо номер сторінки яку обрав коистувач за допомогою (блок пагінації)
pagination.on('afterMove', event => {
  const currentPage = event.page;
  // console.log(currentPage);
  render(currentPage);
});

// ==================================================================

// Функція для виклику карток за популярним рейтингом
async function render(currentPage) {
  const data = await trendingFetch(currentPage);
  items = data.results;
  // console.log('items', items);
  // const validMovieData = prepareMovieData(items);
  const createGAl = cardsMarkup(items);
  gallery.innerHTML = createGAl;
}
render(page);

// Функція для виклику карток за ключовим словом
function renderByQuery(filteredList) {
  const noResultsCard = document.querySelector('.movies__not-found');
  if (filteredList.length === 0) {
    if (noResultsCard) {
      noResultsCard.classList.add('hidden');
    }
    gallery.innerHTML = '';
    render(page);
    return createNoResultsCard();
  }
  gallery.innerHTML = '';
  if (noResultsCard) {
    noResultsCard.classList.add('hidden');
  }
  // const validFilteredList = prepareMovieData(filteredList);
  const listOfCards = cardsMarkup(filteredList);
  return gallery.insertAdjacentHTML('afterbegin', listOfCards);
}

// Function searchByGenres

function onChangeByGenres(e) {
  genreValue = Number(e.target.value);
}

function filterByGenres(data) {
  if (genreValue !== 0) {
    const filteredDataByGenres = data.filter(film => {
      const { genre_ids } = film;
      return (findGenre = genre_ids.includes(genreValue));
    });
    return filteredDataByGenres;
  }
  return data;
}

// Функція створення noResults вікна
function createNoResultsCard() {
  const noResults =
    '<div class="movies__not-found"> <h3 class="not-found-title">We have searched, but could not find it</h3 ><p class="not-found-text">Try to change your request, or choose something interesting from our selections</p></div>';
  return moviesContainer.insertAdjacentHTML('afterbegin', noResults);
}

// Функція-колбек для рендеру модалки по кліку
async function onClickOneFilmCard(e) {
  e.preventDefault();

  const filmCardElement = e.target.closest('.movie__card');
  if (!filmCardElement) return;
  const movieID = filmCardElement.dataset.movieid;
  // Забираємо обєкт фільму по ID
  const data = await fetchByID(movieID);
  // Створюємо модалку
  const modalOneFilm = basicLightbox.create(modalOneFilmMarkup(data));

  // Показуємо модалку
  modalOneFilm.show();

  // Вішаємо слухачів на кнопки
  const btnToWatchedEl = document.querySelector('[data-to-watched]');
  const btnToQueueEl = document.querySelector('[data-to-queue]');

  btnToWatchedEl.addEventListener('click', onToWatchedBtn);
  btnToQueueEl.addEventListener('click', onToQueueBtn);
  // console.log(btnToWatchedEl);
  // console.log(btnToQueueEl);

  ///Закриваємо модалку по кнопці
  const buttonModalClose = document.querySelector('.onefilm__icon--close');
  buttonModalClose.addEventListener('click', closeByClick);
  function closeByClick() {
    modalOneFilm.close();
    window.removeEventListener('keydown', closeByKey);
    btnToWatchedEl.removeEventListener('click', onToWatchedBtn);
    btnToQueueEl.removeEventListener('click', onToQueueBtn);
  }

  ///Закриваємо модалку по 'Escape'
  window.addEventListener('keydown', closeByKey);
  function closeByKey(e) {
    modalOneFilm.close();
    window.removeEventListener('keydown', closeByKey);
    btnToWatchedEl.removeEventListener('click', onToWatchedBtn);
    btnToQueueEl.removeEventListener('click', onToQueueBtn);
  }

  function onToQueueBtn(e) {
    e.preventDefault();

    let savedListQueue = localStorage.getItem('list-queue');

    if (savedListQueue) {
      savedListQueue = JSON.parse(savedListQueue);
    } else {
      savedListQueue = [];
    }

    for (const item of savedListQueue) {
      if (item.id === data.id) {
        closeByClick();
        return Notify.info('This movie is already on this list');
      }
    }
    savedListQueue.push(data);

    localStorage.setItem('list-queue', JSON.stringify(savedListQueue));

    // Закриваємо модалку
    closeByClick();
  }

  async function onToWatchedBtn(e) {
    e.preventDefault();

    let savedListWatched = localStorage.getItem('list-watched');
    if (savedListWatched) {
      savedListWatched = JSON.parse(savedListWatched);
    } else {
      savedListWatched = [];
    }

    for (const item of savedListWatched) {
      if (item.id === data.id) {
        closeByClick();
        return Notify.info('This movie is already on this list');
      }
    }
    savedListWatched.push(data);

    localStorage.setItem('list-watched', JSON.stringify(savedListWatched));

    // Закриваємо модалку
    closeByClick();
  }
}
// function onClickOneFilmCard(e) {
//   e.preventDefault();
//   const oneFilmCard = e.target.closest('.movie__card')
//   if (!oneFilmCard) return;

//   fetchByID(oneFilmCard.dataset.movieid)

//   console.log(fetchByID(oneFilmCard.dataset.movieid));
// }

// Функція для рендеру модального вікна ОДНОГО ФІЛЬМУ
// async function renderOneFilmModal(id) {
//   const data = await fetchByID(id);
//   console.log(data);
//   // gallery.insertAdjacentHTML('afterend', modalOneFilmMarkup(data));
//   const instance = basicLightbox.create(modalOneFilmMarkup(data));
// }
//
// =============================== LIBRARY ==============================================

// Функція-колбек на кнопку

// async function onToQueueBtn(e) {
//   e.preventDefault();

//   const currentObjectData = await fetchByID(e.target.dataset.movieid);
//   console.log(currentObjectData);

//   let savedListQueue = localStorage.getItem('list-queue');

//   if (savedListQueue) {
//     savedListQueue = JSON.parse(savedListQueue);
//   } else {
//     savedListQueue = [];
//   }

//   for (const item of savedListQueue) {
//     if (item.id === currentObjectData.id) {
//       return alert('You have this movie in the list');
//     }
//   }
//   savedListQueue.push(currentObjectData);

//   localStorage.setItem('list-queue', JSON.stringify(savedListQueue));

//   // Зробити закриття модалки
// }
