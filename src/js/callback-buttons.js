import { fetchByID } from './apies';

export { onToQueueBtn, onToWatchedBtn };

// function onToQueueBtn(e) {
//   e.preventDefault();

//   // const currentdata = e.target.dataset.movieid;

//   let savedListQueue = localStorage.getItem('list-queue');

//   if (savedListQueue) {
//     savedListQueue = JSON.parse(savedListQueue);
//   } else {
//     savedListQueue = [];
//   }

//   for (const item of savedListQueue) {
//     if (item.id === data.id) {
//       return alert('You have this movie in the list');
//     }
//   }
//   savedListQueue.push(currentdata);

//   localStorage.setItem('list-queue', JSON.stringify(savedListQueue));

//   // Зробити закриття модалки
// }

// async function onToWatchedBtn(e) {
//   e.preventDefault();

//   const data = await fetchByID(e.target.dataset.movieid);

//   let savedListWatched = localStorage.getItem('list-watched');
//   if (savedListWatched) {
//     savedListWatched = JSON.parse(savedListWatched);
//   } else {
//     savedListWatched = [];
//   }

//   for (const item of savedListWatched) {
//     if (item.id === data.id) {
//       return alert('You have this movie in the list');
//     }
//   }
//   savedListWatched.push(data);

//   localStorage.setItem('list-watched', JSON.stringify(savedListWatched));

//   // Зробити закриття модалки
// }

// async function onToDeletedBtn(e) {
//   const data = await fetchByID(e.target.dataset.movieid);

//   let savedListQueue = localStorage.getItem('list-queue');

//   if (savedListQueue) {
//     savedListQueue = JSON.parse(savedListQueue);
//   } else {
//     savedListQueue = [];
//   }

//   for (let i = 0; i <= savedListQueue.length; i += 1) {
//     if (savedListQueue[i].id === data.id) {
//       const deletedItem = savedListQueue.indexOf(i);

//       savedListQueue.splice(deletedItem, 1);
//       console.log(savedListQueue);
//     }
//   }
//   localStorage.setItem('list-queue', JSON.stringify(savedListQueue));
// }
