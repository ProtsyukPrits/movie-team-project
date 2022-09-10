import axios from "axios";

const API_KEY = '68dd2d07f1b8d9799366e4d9411e689b';
const BASE_URL = 'https://api.themoviedb.org/3/';
const page = 1;


async function trendingFetch() {
  const { data }  = await axios.get(`${BASE_URL}trending/all/day?api_key=${API_KEY}`)
    return data
}


// Сюди додавайте ваші функції і незабудьте змінити ще import
export { trendingFetch }
