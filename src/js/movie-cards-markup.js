const cardsMarkup = function (items) {
  return items
    .map(
      ({ movieImgPath, movieName, movieRating, movieYear, movieID }) => `
      <li class='movie__card' data-movie-cart-ID='${movieID}'>
        <a href='#' class='movie__card-link'>
        <picture>
            <source
            srcset="https://image.tmdb.org/t/p/w1280${movieImgPath}"
            media='(min-width: 1280px)'
            />
            <source
            srcset="https://image.tmdb.org/t/p/w780${movieImgPath}"
            media='(min-width: 768px)'
            />
            <source
            srcset="https://image.tmdb.org/t/p/w300${movieImgPath}"
            media='(min-width: 320px)'
            />
            <img
            class='movie__card-img'
            src='/src/images/card1.jpg'
            alt='${movieName}'
            loading='lazy'
            sizes="(min-width: 1280px) 33.3vw, (min-width: 768px) 50vw, 100vw"
            />
        </picture>
        <p class='movie__card-title'>${movieName}</p>
        <div class='movie__card-meta'>
            <div class='movie__card-details'>
                <p class='movie__card-genre'>Drama, Action</p>
                <p class='movie__card-year'>| ${movieYear}</p>
            </div>
            <p class='movie__card-rating'>${movieRating}</p>
        </div>
        </a>
    </li>`
    )
    .join('');
};

// Сюди додавайте ваші розмітки і незабудьте змінити ще import
export { cardsMarkup };
