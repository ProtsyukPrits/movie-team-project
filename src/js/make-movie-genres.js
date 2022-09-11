import { genreIdName } from './config/genre-id-name';

export default function makeMovieGenres(movieGenreIds) {
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
