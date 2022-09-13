import { genreIdName } from './config/genre-id-name';

const OTHER_GENRES = 'Other';

function prepareMovieData(data) {
  const moviesArr = [];

  const isDataArray = Array.isArray(data);

  if (!isDataArray) {
    const bufferData = data;
    data = [];
    data.push(bufferData);
  }

  data.forEach(movie => {
    const movieObj = new Object();

    const movieGenreIds = movie.genre_ids || movie.genres;
    const movieGenreNamesArr = makeMovieGenres(movieGenreIds);

    if (movieGenreNamesArr.length >= 3) {
      movieGenreNamesArr.splice(2, movieGenreNamesArr.length - 2, OTHER_GENRES);
    }

    const movieGenres = movieGenreNamesArr.join(', ');

    movieObj.movieID = movie.id;
    movieObj.movieName = movie.title || movie.name;
    movieObj.movieYear = (movie.release_date || movie.first_air_date).slice(0, 4);
    movieObj.movieRating = movie.vote_average.toFixed(1);
    movieObj.movieVotes = movie.vote_count;
    movieObj.moviePopularity = movie.popularity.toFixed(1);
    movieObj.movieAbout = movie.overview;
    movieObj.movieImgPath = movie.poster_path;
    movieObj.movieGenres = movieGenres;

    moviesArr.push(movieObj);
  });

  return moviesArr;
}

function makeMovieGenres(movieGenreIds) {
  const movieGenreNamesArr = [];

  for (const movieGenreID of movieGenreIds) {
    for (let i = 0; i < genreIdName.length; i += 1) {
      if (movieGenreID === genreIdName[i].id) {
        const movieGenre = genreIdName[i].name;
        movieGenreNamesArr.push(movieGenre);
      }
    }
  }

  return movieGenreNamesArr;
}

export { prepareMovieData };

