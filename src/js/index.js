// поки що зшиваємо тут, пізніше будемо все впорядковувати

// =========____ЯКЩО КОД ЗАКРУЧЕНИЙ КОМЕНТУЄМО ВСЕ____==========

// Імпорти сюди
import loading from './spinner';

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
import { genreIdName } from './config/genre-id-name';
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
  deleteMovieFromWatched,
  auth,
} from './firebase/index';
import loading from './spinner.js';
import { doc } from 'firebase/firestore';
// Тут додаємо ваші глобальні змінні
let queryString = '';
let yearValue = 0;
let genreValue = 0;
let votesValue = 1;
let items = [];
let page = 1;
let currentPage = 1;
let currentFilmData = {};
let genresArr = [];
let totalResults = [];
let pagination;
let cards = 12;

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
const loadMore = document.querySelector('.button__load-more');
// const loadMoreBtn = document.querySelector('.container__load-more');

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

// Отримуємо номер сторінки яку обрав коистувач за допомогою (блок пагінації)
if (
  window.location.pathname === '/movie-team-project/index.html' ||
  window.location.pathname === '/movie-team-project/'

  // щоб працювало локально
  // window.location.pathname === '/movie-team-project/index.html' ||
  // window.location.pathname === '/movie-team-project/' ||
  // window.location.pathname === '/index.html'
) {
  pagination = new Pagination(container, {
    totalItems: 10000,
    itemsPerPage: 10,
    visiblePages: 5,
    page: 1,
    centerAlign: true,
  });
  pagination.on('afterMove', event => {
    currentPage = event.page;
    if (queryString) {
      getMoviesByQueryKey(queryString, currentPage)
        .then(data => filterByGenres(data))
        .then(data => filterByYears(data))
        .then(data => filterByVotes(data))
        .then(data => renderByQuery(data))
        .catch(err => console.error(err.message));
    } else {
      render(currentPage);
    }
  });
}

// Отримання масиву жанрів
// getMoviesByGenresId()
//   .then(data => genresArr.push(...data))
//   .catch(err => console.error(err.message));

// Функція редагування отриманого респонсу
function changeGenreArr(items) {
  const arr = items.map(item => {
    const { genre_ids } = item;

    let allGenres = [];
    genreIdName.map(genreObj => {
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
  totalResults.push(data.total_results);

  // console.log('items', items);
  // const validMovieData = prepareMovieData(items);
  const newItems = changeGenreArr(items);
  const createGAl = cardsMarkup(newItems);
  if (gallery) {
    gallery.innerHTML = createGAl;
  }
}
render(currentPage);

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
  return getMoviesByQueryKey(queryString, currentPage)
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
      noResultsCard.remove();
    }
    gallery.innerHTML = '';
    // render(page);
    pagSection.classList.add('visually-hidden');
    return createNoResultsCard();
  }
  gallery.innerHTML = '';
  if (noResultsCard) {
    noResultsCard.remove();
  }
  pagSection.classList.remove('visually-hidden');
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
  modalOneFilm.show();
  // console.log(currentFilmData);

  const about = document.querySelector('.about__title');
  const genre = document.querySelector('.facts__name-genre');

  if (currentFilmData.genres.length === 0) {
    genre.classList.add('zero-element');
  }
  if (currentFilmData.overview === '') {
    about.classList.add('zero-element');
  }

  // Вішаємо слухачів на кнопки
  const btnToWatchedEl = document.querySelector('[data-to-watched]');
  const btnToQueueEl = document.querySelector('[data-to-queue]');

  let isFilmInUserQueueCol;
  let isFilmInUserWatchedCol;

  if (auth.currentUser) {
    isFilmInUserQueueCol = await getFilmById(
      currentFilmData.id.toString(),
      'queue'
    );

    isFilmInUserWatchedCol = await getFilmById(
      currentFilmData.id.toString(),
      'watched'
    );
  }

  if (btnToWatchedEl) {
    if (isFilmInUserWatchedCol) {
      btnToWatchedEl.textContent = 'is already in watched';
      btnToWatchedEl.disabled = true;
      btnToWatchedEl.classList.remove('button__secondary');
      btnToWatchedEl.classList.add('disabled-btn');
    } else {
      btnToWatchedEl.addEventListener(
        'click',
        () => {
          addFilmToWatched(currentFilmData);
          modalOneFilm.close();
        },
        { once: true }
      );
    }
  }

  if (btnToQueueEl) {
    if (isFilmInUserQueueCol) {
      btnToQueueEl.textContent = 'is already in queue';
      btnToQueueEl.disabled = true;
      btnToQueueEl.classList.remove('button__secondary');
      btnToQueueEl.classList.add('disabled-btn');
    } else {
      btnToQueueEl.addEventListener(
        'click',
        () => {
          addFilmToQueue(currentFilmData);
          modalOneFilm.close();
        },
        { once: true }
      );
    }
  }

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
    if (e.code === 'Escape') {
      modalOneFilm.close();
      window.removeEventListener('keydown', closeByKey);
    }
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
  loading.show();
}

if (window.location.pathname === '/movie-team-project/library.html') {
  setTimeout(onWatchedBtn, 1000);
}

// Функція створення галереї списку "Watched"

function onWatchedBtn() {
  getUserWatched().then(result => renderLibraryWatched(result));
  loading.close();

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
  cardsLenght = films.length;
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

  // console.log(films.length);
  // if (films.length > 12) {
  //   loadMoreBtn.classList.add('show');
  // }
  loadMoreFilmOnPage(cardsLenght);
}

// Функція рендеру карток за "Queue" списком
async function renderLibraryQueue(films) {
  cardsLenght = films.length;

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
  // console.log(films.length < 12);
  // if (films.length > 12) {
  //   loadMoreBtn.classList.add('show');
  // }

  loadMoreFilmOnPage(cardsLenght);
}

// Функція load more

function loadMoreFilmOnPage(cardsLenght) {
  // const cardsLenght = document.querySelectorAll('.movie__card').length;
  console.log(cardsLenght);
  if (cardsLenght === 0 || cardsLenght <= cards) {
    loadMore.style.display = 'none';
  } else {
    loadMore.style.display = 'block';
    loadMore.addEventListener('click', e => {
      cards += 12;
      const array = Array.from(
        document.querySelector('.library__gallery').children
      );
      const visItems = array.slice(0, cards);

      visItems.forEach(el => el.classList.add('is-visible'));
      if (visItems.length === cardsLenght) {
        loadMore.style.display = 'none';
      }
    });
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
  const deleteMovieBtn = document.querySelector('[data-to-delete-watched]');

  deleteMovieBtn.addEventListener(
    'click',
    () => {
      deleteMovieFromWatched(data);
      modalOneFilm.close();
      onWatchedBtn();
    },
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
    if (e.code === 'Escape') {
      modalOneFilm.close();
      window.removeEventListener('keydown', closeByKey);
    }
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
    if (e.code === 'Escape') {
      modalOneFilm.close();
      window.removeEventListener('keydown', closeByKey);
    }
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
