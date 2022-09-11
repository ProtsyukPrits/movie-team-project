import MovieApiService from './testAPI';

const movieApiService = new MovieApiService();

function prepareApiData(data) {
  console.log('movieData', data);
  const moviesArr = [];

  const isDataArray = Array.isArray(data);

  if (!isDataArray) {
    console.log('prepareApiData HERE data is array', data);
    const bufferData = data;
    data = [];
    data.push(bufferData);
    console.log('prepareApiData', data);
  }

  data.forEach(movie => {
    const movieObj = new Object();

    movieObj.movieID = movie.id;
    movieObj.movieName = movie.title || movie.name;
    movieObj.movieYear = (movie.release_date || movie.first_air_date).slice(0, 4);
    movieObj.movieRating = movie.vote_average.toFixed(1);
    movieObj.movieVotes = movie.vote_count;
    movieObj.moviePopularity = movie.popularity.toFixed(1);
    movieObj.movieAbout = movie.overview;
    movieObj.movieImgPath = movie.poster_path;

    // const genreIds = movie.genre_ids;
    // if (genreIds.length > 2) {
    //   console.log('genreIds', genreIds);
    // }

    movieObj.movieGenres = movie.genre_ids || movie.genres;

    moviesArr.push(movieObj);
  });

  console.log('movieArr', moviesArr);
  return moviesArr;
}

movieApiService.getСonfiguration();
// movieApiService.getMovieDetails();

export { prepareApiData };
