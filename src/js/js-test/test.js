import MovieApiService from './test-api';
// import renderHomeGalleryBySearchQuery from './render-by-search-query';

// const element = document.querySelector('.movies__gallery');

const API = new MovieApiService();

// API.searchMovie();
API.getСonfiguration();

// renderHomeGalleryBySearchQuery(element);

import axios from 'axios';

const API_KEY = '68dd2d07f1b8d9799366e4d9411e689b';
const BASE_URL = 'https://api.themoviedb.org/3/';
const page = 1;
const perPage = 40;
let items = [];

async function trendingFetch() {
  const { data } = await axios.get(`${BASE_URL}trending/all/day?api_key=${API_KEY}&${page}`);
  return data;
}

const gallery = document.querySelector('.movies__gallery');
async function render() {
  const data = await trendingFetch();
  items = data.results;
  console.log('items', items);
  const createGAl = cardsMarkup(items);
  gallery.innerHTML = createGAl;
}

render();

const cardsMarkup = function (items) {
  return items
    .map(
      ({ backdrop_path, title, vote_average, release_date, id }) => `
      <li class='movie__card' data-movie-cart-ID='${id}'>
        <a href='#' class='movie__card-link'>
        <picture>
            <source
            srcset="https://image.tmdb.org/t/p/w1280${backdrop_path}"
            media='(min-width: 1280px)'
            />
            <source
            srcset="https://image.tmdb.org/t/p/w780${backdrop_path}"
            media='(min-width: 768px)'
            />
            <source
            srcset="https://image.tmdb.org/t/p/w300${backdrop_path}"
            media='(min-width: 320px)'
            />
            <img
            class='movie__card-img'
            src='/src/images/card1.jpg'
            alt='description'
            loading='lazy'
            sizes="(min-width: 1280px) 33.3vw, (min-width: 768px) 50vw, 100vw"
            />
        </picture>
        <p class='movie__card-title'>${title}</p>
        <div class='movie__card-meta'>
            <div class='movie__card-details'>
                <p class='movie__card-genre'>Drama, Action</p>
                <p class='movie__card-year'>| ${release_date}</p>
            </div>
            <p class='movie__card-rating'>${vote_average}</p>
        </div>
        </a>
    </li>`
    )
    .join('');
};
