// поки що зшиваємо тут, пізніше будемо все впорядковувати

// =========____ЯКЩО КОД ЗАКРУЧЕНИЙ КОМЕНТУЄМО ВСЕ____==========
import { trendingFetch } from './apies';
import { cardsMarkup } from './movie-cards-markup';
import Pagination from 'tui-pagination';
// Наш реф по якому ми звертаємось!
const gallery = document.querySelector('.movies__gallery');
const container = document.getElementById('pagination');
// Тут додаємо ваші глобальні змінні
let items = [];
// Тут додаємо слухачі подій

// ========_____Пишемо сюди основні функції_____===============
var pagination = new Pagination(container, {
  totalItems: 500,
  itemsPerPage: 10,
  visiblePages: 5,
  centerAlign: true,
});

// Функція для виклику карток за популярним рейтингом
async function render() {
  const data = await trendingFetch();
  items = data.results;
  // console.log('items', items);
  const createGAl = cardsMarkup(items);
  gallery.innerHTML = createGAl;
}
render();
