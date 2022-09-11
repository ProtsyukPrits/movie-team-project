const API_KEY = '68dd2d07f1b8d9799366e4d9411e689b';

const BASE_URL = 'https://api.themoviedb.org/3';
const TRENDING_URL = `${BASE_URL}/trending/all/day?api_key=${API_KEY}`;
const PREVIEW_URL = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=матриця&language=en-US&page=1`;
const DETAILS_URL = `${BASE_URL}/movie/616037?api_key=${API_KEY}&language=en-US`;

// TRENDING
// https://api.themoviedb.org/3/trending/all/day?api_key=68dd2d07f1b8d9799366e4d9411e689b
// PREVIEW
// https://api.themoviedb.org/3/search/movie?api_key=68dd2d07f1b8d9799366e4d9411e689b&query=матриця&language=en-US&page=1&include_adult=false
// DETAILS
// https://api.themoviedb.org/3/movie/616037?api_key=68dd2d07f1b8d9799366e4d9411e689b&language=en-US

export default class MovieApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 40;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newSearchQuery) {
    this.searchQuery = newSearchQuery;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  async getTrendingMovie() {
    return await fetch(TRENDING_URL)
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log(data);
      });
  }

  async searchMovie() {
    return await fetch(PREVIEW_URL)
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log(data);
      });
  }

  async getMovieDetails() {
    return await fetch(DETAILS_URL)
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log('getMovieDetails', data);
        const a = [];
        a.push(data);

        if (Array.isArray(a)) {
          console.log('getMovieDetails data is array');
        } else console.log('getMovieDetails data is NOTNOTNOTNOTNOTNOTNOT array');
        return data;
      });
  }

  async getСonfiguration() {
    return await fetch(
      //   'https://api.themoviedb.org/3/configuration?api_key=68dd2d07f1b8d9799366e4d9411e689b'
      'https://api.themoviedb.org/3/genre/movie/list?api_key=68dd2d07f1b8d9799366e4d9411e689b&language=en-US'
    )
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log('getСonfiguration', data);
      });
  }
}
