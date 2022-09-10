import MovieApiService from './test-api';
import renderHomeGalleryBySearchQuery from './render-by-search-query';

const element = document.querySelector('.movies__gallery');

const API = new MovieApiService();

API.searchMovie();
API.getСonfiguration();

// renderHomeGalleryBySearchQuery(element);
