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

// Сюди додавайте ваші розмітки і незабудьте змінити ще import
export { cardsMarkup };
