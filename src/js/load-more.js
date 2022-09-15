const libraryGallery = document.querySelector('.library__gallery');
const loadMore = document.querySelector('.button__load-more');
const cardsLenght = document.querySelector('.movie__card').length;
let cards = 12;
console.log(loadMore);

loadMore.addEventListener('click', e => {
  //   cards += 12;
  const array = Array.from(
    document.querySelector('.library__gallery').children
  );

  array.forEach(el => el.classList.add('.is-visible'));
  //   const visItems = array.slice(0, cards);
  //   visItems.forEach(el => el.classList.add('.is-visible'));
});
