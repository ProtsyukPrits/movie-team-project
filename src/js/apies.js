import axios from 'axios';
// Базові дані
const API_KEY = '68dd2d07f1b8d9799366e4d9411e689b';
const BASE_URL = 'https://api.themoviedb.org/3/';
const page = 1;

async function trendingFetch() {
  const { data } = await axios.get(
    `${BASE_URL}trending/all/day?api_key=${API_KEY}&page=${page}`
  );
  return data;
}

//
const getMoviesByQueryKey = queryString => {
  return axios
    .get(
      ` ${BASE_URL}search/movie?api_key=${API_KEY}&query=${queryString}&language=en-US&include_adult=false&page=${page}`
    )
    .then(response => {
      return response.data.results;
    });
};

//
async function fetchByID(movie_id) {
  const { data } = await axios.get(
    `${BASE_URL}movie/${movie_id}?api_key=${API_KEY}`
  );
  return data;
}

// Сюди додавайте ваші функції і незабудьте змінити ще import
export { trendingFetch, fetchByID, getMoviesByQueryKey };
