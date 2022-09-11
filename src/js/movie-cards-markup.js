const cardsMarkup = function (items) {
  return items
    .map(
      ({ poster_path, title, vote_average, release_date, id }) => `
      <li class='movie__card' data-movieID='${id}'>
        <a href='#' class='movie__card-link'>
        <picture>
            <source
            srcset="https://image.tmdb.org/t/p/w1280${poster_path}"
            media='(min-width: 1280px)'
            />
            <source
            srcset="https://image.tmdb.org/t/p/w780${poster_path}"
            media='(min-width: 768px)'
            />
            <source
            srcset="https://image.tmdb.org/t/p/w300${poster_path}"
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

function modalOneFilmMarkup ({ poster_path, original_title, title, vote_average, vote_count, popularity, genres, overview }) {
    return `<div class="backdrop is-hidden">
                <div class="modal__onefilm">
                <button class="onefilm__icon--close" data-modal-close>
                    <svg width="30" height="30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 8L22 22" stroke="black" stroke-width="2"/>
                    <path d="M8 22L22 8" stroke="black" stroke-width="2"/>
                    </svg>
                </button>
                    <div class="onefilm__poster">
                        <img src="https://image.tmdb.org/t/p/w500/${poster_path}" alt="${original_title}">
                    </div>
                    <div class="onefilm__info">
                        <h1 class="onefilm__title">${title}</h1>
                        <div class="onefilm__facts">
                            <div class="onefilm__facts-name">
                                <p class="facts__name">Vote / Votes</p>
                                <p class="facts__name">Popularity</p>
                                <p class="facts__name">Original Title</p>
                                <p class="facts__name">Genre</p>
                            </div>
                            <div class="onefilm__facts-value">
                                <p class="facts__value"><span class="facts__value-vote">${vote_average}</span>${vote_count}</p>
                                <p class="facts__value">${popularity}</p>
                                <p class="facts__value">${original_title}</p>
                                <p class="facts__value">${genres.map((genr) => genr.name).join(', ')}</p>
                            </div>
                        </div>                
                        <div class="onefilm__about">
                            <h2 class="about__title">About</h2>
                            <p class="about__text">${overview}</p>
                        </div>
                        <div class="actions">
                            <button type="button" class="wached">add to Watched</button>
                            <button type="button" class="wachlist">add to queue</button>
                        </div>
                    </div>
                </div>
            </div>`
};


// Сюди додавайте ваші розмітки і незабудьте змінити ще import
export { cardsMarkup, modalOneFilmMarkup };

