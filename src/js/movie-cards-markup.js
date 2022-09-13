// import { genreIdName } from './config/genre-id-name'
// function createGenres() {
//     return genreIdName.filter(arr => arr.id).map(arr => arr.name).join(', ')
// }

const cardsMarkup = function (items) {
  return items
    .map(
      ({
        poster_path,
        title,
        vote_average,
        first_air_date,
        release_date,
        id,
        name
      }) => `
        <li class='movie__card' data-movieID='${id}'>
        <a href='#' class='movie__card-link'>
        <img
            class='movie__card-img'
            src="https://image.tmdb.org/t/p/w500/${poster_path}" 
            onerror="this.onerror=null;this.src='https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';"
            alt='${title ? title : name}'
            loading="lazy"
            width='500'
        />       
        <h2 class='movie__card-title'>${title ? title : name}</h2>
        <div class='movie__card-meta'>
            <div class='movie__card-details'>
                <p class='movie__card-genre'></p>
                <p class='movie__card-year'>| ${(release_date
                  ? release_date
                  : first_air_date && first_air_date
                  ? first_air_date
                  : ''
                ).slice(0, 4)}</p>
            </div>
            <p class='movie__card-rating'>${vote_average.toFixed(1)}</p>
        </div>
        </a>
    </li>`
    )
    .join('');
};

function modalOneFilmMarkup({
  poster_path,
  original_title,
  title,
  vote_average,
  vote_count,
  popularity,
  genres,
  overview,
  id,
}) {
  return `     <div class="modal__onefilm">
                <button class="onefilm__icon--close">
                    <svg class="icon--close" width="30" height="30" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 8L22 22"  stroke-width="2"/>
                    <path d="M8 22L22 8"  stroke-width="2"/>
                    </svg>
                </button>
                <div class ="onefilm__all">
                    <div class="onefilm__poster">
                        <img class="img__poster" src="https://image.tmdb.org/t/p/w500/${poster_path}" alt="${original_title}">
                    </div>
                    <div class="onefilm__info">
                        <h1 class="onefilm__title">${title}</h1>
                        <div class="onefilm__facts">
                            <div class="onefilm__facts-name">
                                <p class="facts__name">Vote/Votes</p>
                                <p class="facts__name">Popularity</p>
                                <p class="facts__name">Original Title</p>
                                <p class="facts__name">Genre</p>
                            </div>
                            <div class="onefilm__facts-value">
                                <p class="facts__value"><span class="facts__value-vote">${vote_average}</span> / ${vote_count}</p>
                                <p class="facts__value facts__value-vot">${popularity}</p>
                                <p class="facts__value facts__value-vo">${original_title}</p>
                                <p class="facts__value facts__value-v">${genres
                                  .map(genr => genr.name)
                                  .join(', ')}</p>
                            </div>
                        </div>                
                        <div class="onefilm__about">
                            <h2 class="about__title">About</h2>
                            <p class="about__text">${overview}</p>
                        </div>
                        <div class="actions">
                        <ul class="card__button-wrap">
                            <li class="card__button">
                                <button type="button" class="button__secondary lang-to-watched" id="to-watched" data-to-watched data-movieID='${id}'>add to watched</button>
                            </li>
                            <li class="card__button">
                                <button type="button" class="button__secondary lang-to-queue" id="to-queue" data-to-queue data-movieID='${id}'>add to queue</button>
                            </li>
                        </ul>
                        </div>
                    </div>
                </div>
                
            `;
}

function modalOneFilmMarkupQueue({
  poster_path,
  original_title,
  title,
  vote_average,
  vote_count,
  popularity,
  genres,
  overview,
  id,
}) {
  return `<div class="backdrop active">
                <div class="modal__onefilm">
                <button class="onefilm__icon--close">
                    <svg class="icon--close" width="30" height="30" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 8L22 22"  stroke-width="2"/>
                    <path d="M8 22L22 8"  stroke-width="2"/>
                    </svg>
                </button>
                <div class ="onefilm__all">
                    <div class="onefilm__poster">
                        <img class="img__poster" src="https://image.tmdb.org/t/p/w500/${poster_path}" alt="${original_title}">
                    </div>
                    <div class="onefilm__info">
                        <h1 class="onefilm__title">${title}</h1>
                        <div class="onefilm__facts">
                            <div class="onefilm__facts-name">
                                <p class="facts__name">Vote/Votes</p>
                                <p class="facts__name">Popularity</p>
                                <p class="facts__name">Original Title</p>
                                <p class="facts__name">Genre</p>
                            </div>
                            <div class="onefilm__facts-value">
                                <p class="facts__value"><span class="facts__value-vote">${vote_average}</span> / ${vote_count}</p>
                                <p class="facts__value facts__value-vot">${popularity}</p>
                                <p class="facts__value facts__value-vo">${original_title}</p>
                                <p class="facts__value facts__value-v">
                                  </p>
                            </div>
                        </div>
                        <div class="onefilm__about">
                            <h2 class="about__title">About</h2>
                            <p class="about__text">${overview}</p>
                        </div>
                        <div class="actions">
                        <ul class="card__button-wrap">
                            <li class="card__button">
                                <button type="button" class="button__secondary lang-to-watched" id="to-watched" data-to-watched-library data-movieID='${id}'>add to watched</button>
                            </li>
                            <li class="card__button">
                                <button type="button" class="button__secondary lang-to-delete" id="to-delete" data-to-delete data-movieID='${id}'>delete</button>
                            </li>
                        </ul>
                        </div>
                    </div>
                    </div>
                </div>
            `;
}
// for future use
// ${genres
//                                   .map(genr => genr.name)
//       .join(', ')}

function modalOneFilmMarkupWatched({
  poster_path,
  original_title,
  title,
  vote_average,
  vote_count,
  popularity,
  genres,
  overview,
  id,
}) {
  return `<div class="backdrop active">
                <div class="modal__onefilm">
                <button class="onefilm__icon--close">
                    <svg class="icon--close" width="30" height="30" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 8L22 22"  stroke-width="2"/>
                    <path d="M8 22L22 8"  stroke-width="2"/>
                    </svg>
                </button>
                <div class ="onefilm__all">
                    <div class="onefilm__poster">
                        <img class="img__poster" src="https://image.tmdb.org/t/p/w500/${poster_path}" alt="${original_title}">
                    </div>
                    <div class="onefilm__info">
                        <h1 class="onefilm__title">${title}</h1>
                        <div class="onefilm__facts">
                            <div class="onefilm__facts-name">
                                <p class="facts__name">Vote/Votes</p>
                                <p class="facts__name">Popularity</p>
                                <p class="facts__name">Original Title</p>
                                <p class="facts__name">Genre</p>
                            </div>
                            <div class="onefilm__facts-value">
                                <p class="facts__value"><span class="facts__value-vote">${vote_average}</span> / ${vote_count}</p>
                                <p class="facts__value facts__value-vot">${popularity}</p>
                                <p class="facts__value facts__value-vo">${original_title}</p>
                                <p class="facts__value facts__value-v">
                            </div>
                        </div>
                        <div class="onefilm__about">
                            <h2 class="about__title">About</h2>
                            <p class="about__text">${overview}</p>
                        </div>
                        <div class="actions">
                    
                        </div>
                    </div>
                    </div>
                </div>
            `;
}

// Сюди додавайте ваші розмітки і незабудьте змінити ще import
export { cardsMarkup, modalOneFilmMarkup, modalOneFilmMarkupQueue, modalOneFilmMarkupWatched };
