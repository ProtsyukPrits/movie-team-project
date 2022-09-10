import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3/search/movie';
const apiKey = '68dd2d07f1b8d9799366e4d9411e689b';
let page = 1;
let queryString = '';

const getMoviesByQueryKey = queryString => {
  return axios
    .get(
      ` ${BASE_URL}?api_key=${apiKey}&query=${queryString}&language=en-US&include_adult=false&page=${page}`
    )
    .then(response => {
      // console.log(response.data.results);
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.data.results;
    });
};

const searchForm = document.querySelector('.header__search');
const searchInput = document.querySelector('.header__search-input');

const onInputChange = e => {
  queryString = e.target.value;
};

searchInput.addEventListener('input', onInputChange);

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  console.log(getMoviesByQueryKey());
  getMoviesByQueryKey(queryString).then(response => {
    console.log(response);
    // return renderFunction(response);
  });
});
