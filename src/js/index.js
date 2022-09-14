// поки що зшиваємо тут, пізніше будемо все впорядковувати

// =========____ЯКЩО КОД ЗАКРУЧЕНИЙ КОМЕНТУЄМО ВСЕ____==========

// Імпорти сюди

import {
  trendingFetch,
  getMoviesByQueryKey,
  fetchByID,
  getMoviesByGenresId,
} from './apies';

import {
  cardsMarkup,
  modalOneFilmMarkup,
  modalOneFilmMarkupQueue,
  modalOneFilmMarkupWatched,
  getUserWatchedMovies,
  LibraryCardsMarkup,
} from './movie-cards-markup';

import { prepareMovieData } from './prepare-movie-data';
import Pagination from 'tui-pagination';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import * as basicLightbox from 'basiclightbox';
import {
  addFilmToWatched,
  addFilmToQueue,
  getUserWatched,
  getUserQueue,
  getFilmById,
  addtoWatchedAndDeleteFromQueue,
  deleteMovieFromQueue,
} from './firebase/index';
// Тут додаємо ваші глобальні змінні
let queryString = '';
let yearValue = 0;
let genreValue = 0;
let votesValue = 1;
let items = [];
let page = 1;
let currentFilmData = {};
let genresArr = [];

// Наш реф по якому ми звертаємось!
const gallery = document.querySelector('.movies__gallery');
const libraryGallery = document.querySelector('.library__gallery');
const container = document.getElementById('pagination');
const pagSection = container.parentNode;
const searchForm = document.querySelector('.header__search');
const searchInput = document.querySelector('.header__search-input');
const moviesContainer = document.querySelector('.movies__container');
const searchByGenres = document.querySelector('.header__filter-genres');
const searchByYears = document.querySelector('.header__filter-years');
const searchByVotes = document.querySelector('.header__filter-votes');

// Тут додаємо слухачі подій
if (gallery) {
  gallery.addEventListener('click', onClickOneFilmCard);
}

if (searchInput) {
  searchInput.addEventListener('input', e => {
    queryString = e.target.value;
    searchForm.style.borderBottomColor = '#ffffff';
  });
  searchForm.addEventListener('submit', onSubmitSearchBtn);
  searchByGenres.addEventListener('change', onChangeByGenres);
  searchByYears.addEventListener('change', onChangeByYears);
  searchByVotes.addEventListener('change', onChangeByVotes);
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

// Отримання масиву жанрів
getMoviesByGenresId()
  .then(data => genresArr.push(...data))
  .catch(err => console.error(err.message));

// Функція редагування отриманого респонсу
function changeGenreArr(items) {
  const arr = items.map(item => {
    const { genre_ids } = item;

    let allGenres = [];
    genresArr.map(genreObj => {
      if (genre_ids.includes(genreObj.id)) {
        allGenres.push(genreObj.name);
        item.genres = allGenres;
      }
      return;
    });
    if (!item.genres) {
      item.genres = 'Other';
    } else if (item.genres.length > 2) {
      item.genres.splice(2, 10, 'Other');
    }
    return item;
  });
  return arr;
}

// Функція для виклику карток за популярним рейтингом
async function render(currentPage) {
  const data = await trendingFetch(currentPage);
  items = data.results;
  // console.log('items', items);
  // const validMovieData = prepareMovieData(items);
  const newItems = changeGenreArr(items);
  const createGAl = cardsMarkup(newItems);
  if (gallery) {
    gallery.innerHTML = createGAl;
  }
}
render(page);

// Функція пошуку фільмів
function onSubmitSearchBtn(e) {
  e.preventDefault();
  pagination.movePageTo(page);
  if (queryString === '') {
    searchForm.style.borderBottomColor = 'red';
    return Notify.info(
      'Please, type the title of the film, and click the search button'
    );
  }
  return getMoviesByQueryKey(queryString)
    .then(data => filterByGenres(data))
    .then(data => filterByYears(data))
    .then(data => filterByVotes(data))
    .then(data => renderByQuery(data))
    .catch(err => console.error(err.message));
}

// Функція для виклику карток за ключовим словом
function renderByQuery(filteredList) {
  const noResultsCard = document.querySelector('.movies__not-found');
  if (filteredList.length === 0) {
    if (noResultsCard) {
      noResultsCard.classList.add('hidden');
    }
    gallery.innerHTML = '';
    render(page);
    // pagSection.classList.add('hidden');
    return createNoResultsCard();
  }
  gallery.innerHTML = '';
  if (noResultsCard) {
    noResultsCard.classList.add('hidden');
  }

  const newGenresArr = changeGenreArr(filteredList);
  const listOfCards = cardsMarkup(newGenresArr);
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
      const findGenre = genre_ids.includes(genreValue);
      return findGenre;
    });
    return filteredDataByGenres;
  }
  return data;
}

// Function SearchByYears

function onChangeByYears(e) {
  yearValue = Number(e.target.value);
}

function filterByYears(data) {
  if (yearValue !== 0) {
    const filteredDataByYears = data.filter(film => {
      const { release_date } = film;
      return yearValue === Number(release_date.slice(0, 4));
    });
    return filteredDataByYears;
  }
  return data;
}

// Function SearchByVotes

function onChangeByVotes(e) {
  votesValue = Number(e.target.value);
}

function filterByVotes(data) {
  if (votesValue === 1) {
    const filteredDataByVotes = data.sort(
      (firstFilm, secondFilm) =>
        secondFilm.vote_average - firstFilm.vote_average
    );
    return filteredDataByVotes;
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
  currentFilmData = data;
  // Створюємо модалку
  const modalOneFilm = basicLightbox.create(modalOneFilmMarkup(data));

  // Показуємо модалку
  modalOneFilm.show();

  // Вішаємо слухачів на кнопки
  const btnToWatchedEl = document.querySelector('[data-to-watched]');
  const btnToQueueEl = document.querySelector('[data-to-queue]');

  btnToWatchedEl.addEventListener(
    'click',
    () => addFilmToWatched(currentFilmData),
    { once: true }
  );

  btnToQueueEl.addEventListener(
    'click',
    () => addFilmToQueue(currentFilmData),
    { once: true }
  );

  ///Закриваємо модалку по кнопці
  const buttonModalClose = document.querySelector('.onefilm__icon--close');
  buttonModalClose.addEventListener('click', closeByClick);
  function closeByClick() {
    modalOneFilm.close();
    window.removeEventListener('keydown', closeByKey);
  }

  ///Закриваємо модалку по 'Escape'
  window.addEventListener('keydown', closeByKey);
  function closeByKey(e) {
    modalOneFilm.close();
    window.removeEventListener('keydown', closeByKey);
  }
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
    if (item.id === currentFilmData.id) {
      // closeByClick();
      return Notify.info('This movie is already on this list');
    }
  }
  savedListQueue.push(currentFilmData);

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
    if (item.id === currentFilmData.id) {
      closeByClick();
      return Notify.info('This movie is already on this list');
    }
  }
  savedListWatched.push(currentFilmData);

  localStorage.setItem('list-watched', JSON.stringify(savedListWatched));

  // Закриваємо модалку
  closeByClick();
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

const btnQueueEl = document.querySelector('[data-library-queue]');
const btnWatchedEl = document.querySelector('[data-library-watched]');
const galleryLibraryEl = document.querySelector('.library__gallery');

if (btnQueueEl) {
  btnQueueEl.addEventListener('click', onQueueBtn);
}
if (btnWatchedEl) {
  btnWatchedEl.addEventListener('click', onWatchedBtn);
  btnWatchedEl.classList.add('button__primary-accent');
}
//onWatchedBtn
// setTimeout(renderLibraryWatched(), 3000);
if (window.location.pathname === '/movie-team-project/library.html') {
  setTimeout(onWatchedBtn, 1000);
}
// Функція створення галереї списку "Watched"

function onWatchedBtn() {
  getUserWatched().then(result => renderLibraryWatched(result));
  btnWatchedEl.classList.add('button__primary-accent');
  btnQueueEl.classList.remove('button__primary-accent');
  galleryLibraryEl.addEventListener('click', renderWatchedFilmModal);
  galleryLibraryEl.removeEventListener('click', renderQueueFilmModal);
}

// Функція створення галереї списку  "Queue"

function onQueueBtn() {
  getUserQueue().then(result => {
    renderLibraryQueue(result);
  });
  btnQueueEl.classList.add('button__primary-accent');
  btnWatchedEl.classList.remove('button__primary-accent');
  galleryLibraryEl.addEventListener('click', renderQueueFilmModal);
  galleryLibraryEl.removeEventListener('click', renderWatchedFilmModal);
}
// ========================================================================
// Функція рендеру карток за "Watched" списком

async function renderLibraryWatched(films) {
  if (films.length === 0) {
    if (galleryLibraryEl) {
      galleryLibraryEl.innerHTML =
        '<h2 style="margin-top:20px; margin-left:auto; margin-right:auto;">You have not added any films yet</h2>';
    }
  } else {
    const createGAl = LibraryCardsMarkup(films);
    if (galleryLibraryEl) {
      galleryLibraryEl.innerHTML = createGAl;
    }
  }
}

// Функція рендеру карток за "Queue" списком
async function renderLibraryQueue(films) {
  if (films.length === 0) {
    if (galleryLibraryEl) {
      galleryLibraryEl.innerHTML =
        '<h2 style="margin-top:20px; margin-left:auto; margin-right:auto;">You have not added any films yet</h2>';
    }
  } else {
    const createGAl = LibraryCardsMarkup(films);
    if (galleryLibraryEl) {
      galleryLibraryEl.innerHTML = createGAl;
    }
  }
}

async function renderWatchedFilmModal(e) {
  e.preventDefault();

  const filmCardElement = e.target.closest('.movie__card');
  if (!filmCardElement) return;
  const movieID = filmCardElement.dataset.movieid;
  // Забираємо обєкт фільму по ID
  const data = await getFilmById(movieID, 'watched');
  // currentFilmData = data;
  // // Створюємо модалку
  const modalOneFilm = basicLightbox.create(modalOneFilmMarkupWatched(data));
  modalOneFilm.show();

  ///Закриваємо модалку по кнопці
  const buttonModalClose = document.querySelector('.onefilm__icon--close');
  buttonModalClose.addEventListener('click', closeByClick);
  function closeByClick() {
    modalOneFilm.close();
    window.removeEventListener('keydown', closeByKey);
  }

  ///Закриваємо модалку по 'Escape'
  window.addEventListener('keydown', closeByKey);
  function closeByKey(e) {
    modalOneFilm.close();
    window.removeEventListener('keydown', closeByKey);
  }
}

async function renderQueueFilmModal(e) {
  e.preventDefault();
  const filmCardElement = e.target.closest('.movie__card');
  if (!filmCardElement) return;
  const movieID = filmCardElement.dataset.movieid;
  // Забираємо обєкт фільму по ID
  const data = await getFilmById(movieID, 'queue');
  // // Створюємо модалку
  const modalOneFilm = basicLightbox.create(modalOneFilmMarkupQueue(data));
  modalOneFilm.show();
  const addtoWatchedBtn = document.querySelector('[data-to-watched-library]');
  const deleteMovieBtn = document.querySelector('[data-to-delete]');

  ///Закриваємо модалку по кнопці
  const buttonModalClose = document.querySelector('.onefilm__icon--close');
  buttonModalClose.addEventListener('click', closeByClick);
  function closeByClick() {
    modalOneFilm.close();
    window.removeEventListener('keydown', closeByKey);
  }

  ///Закриваємо модалку по 'Escape'
  window.addEventListener('keydown', closeByKey);
  function closeByKey(e) {
    modalOneFilm.close();
    window.removeEventListener('keydown', closeByKey);
  }

  addtoWatchedBtn.addEventListener(
    'click',
    () => {
      addtoWatchedAndDeleteFromQueue(data);
      modalOneFilm.close();
      onQueueBtn();
    },
    { once: true }
  );

  deleteMovieBtn.addEventListener(
    'click',
    () => {
      deleteMovieFromQueue(data);
      modalOneFilm.close();
      onQueueBtn();
    },
    { once: true }
  );
}
