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
let yearValue = 0;
let genreValue = 0;
let votesValue = 1;
let items = [];
let page = 1;
let currentFilmData = {};

// Наш реф по якому ми звертаємось!
const gallery = document.querySelector('.movies__gallery');
const container = document.getElementById('pagination');
const searchForm = document.querySelector('.header__search');
const searchInput = document.querySelector('.header__search-input');
const moviesContainer = document.querySelector('.movies__container');
const searchByGenres = document.querySelector('.header__filter-genres');
const searchByYears = document.querySelector('.header__filter-years');
const searchByVotes = document.querySelector('.header__filter-votes');

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
      .then(data => filterByYears(data))
      .then(data => filterByVotes(data))
      .then(data => renderByQuery(data));
  });

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

  btnToWatchedEl.addEventListener('click', onToWatchedBtn);
  btnToQueueEl.addEventListener('click', onToQueueBtn);

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
  // closeByClick();
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
      // closeByClick();
      return Notify.info('This movie is already on this list');
    }
  }
  savedListWatched.push(currentFilmData);

  localStorage.setItem('list-watched', JSON.stringify(savedListWatched));

  // Закриваємо модалку
  // closeByClick();
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

// const btnQueueEl = document.querySelector('[data-library-queue]');
// const btnWatchedEl = document.querySelector('[data-library-watched]');
// const galleryLibraryEl = document.querySelector('.library__gallery');
// console.log(galleryLibraryEl);

// btnQueueEl.addEventListener('click', onQueueBtn);
// btnWatchedEl.addEventListener('click', onWatchedBtn);
// console.log(btnQueueEl);

// btnWatchedEl.classList.add('button__primary-accent');

// // Функція створення галереї списку "Watched"

// function onWatchedBtn(e) {
//   e.preventDefault();
//   galleryLibraryEl.innerHTML = '';

//   btnWatchedEl.classList.add('button__primary-accent');
//   btnQueueEl.classList.remove('button__primary-accent');

//   renderLibraryWatched();
//   console.log();
// }

// // Функція створення галереї списку  "Queue"

// function onQueueBtn(e) {
//   e.preventDefault();
//   galleryLibraryEl.innerHTML = '';

//   btnWatchedEl.classList.remove('button__primary-accent');
//   btnQueueEl.classList.add('button__primary-accent');

//   renderLibraryQueue();
//   console.log();
// }
// // ========================================================================
// // Функція рендеру карток за "Watched" списком

// function renderLibraryWatched() {
//   // буде заміна фукції забору
//   let savedListWatched = localStorage.getItem('list-watched');
//   // console.log(savedListWatched);
//   console.log(1);
//   let parsedListWatched = JSON.parse(savedListWatched);
//   console.log(savedListWatched);

//   // console.log('items', items);
//   const createGAl = cardsMarkup(parsedListWatched);
//   galleryLibraryEl.innerHTML = createGAl;
// }
// renderLibraryWatched();

// // Функція рендеру карток за "Queue" списком
// async function renderLibraryQueue() {
//   let savedListQueue = localStorage.getItem('list-queue');
//   let parsedListQueue = JSON.parse(savedListQueue);
//   // console.log('items', items);
//   const createGAl = await cardsMarkupLibrary(parsedListQueue);
//   galleryLibraryEl.innerHTML = createGAl;
// }
