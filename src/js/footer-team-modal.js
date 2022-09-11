// import Swiper JS
import Swiper from 'swiper';
import Swiper, { Navigation, Pagination } from 'swiper';
Swiper.use([Navigation, Pagination]);

const refsFooter = {
  modal: document.querySelector('.begdrop'),
  link: document.querySelector('.footer__link'),
  modalContent: document.querySelector('.modal__content'),
  footerButtonNext: document.querySelector('.swiper-button-next'),

  modals: document.querySelector('.modal'),
};

refsFooter.link.addEventListener('click', () => {
  refsFooter.modal.classList.add('position');
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    refsFooter.modal.classList.remove('position');
  }
});

refsFooter.modal.addEventListener('click', el => {
  console.log(el.target);

  if (el.target === refsFooter.modal) {
    refsFooter.modal.classList.remove('position');
  }
});

refsFooter.footerButtonNext.addEventListener('click', () => {
  timerId = setInterval(() => {}, 1000);
});

const swiper = new Swiper('.swiper', {
  slidesPerView: 3,
  spaceBetween: 11,
  loop: true,

  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },

  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    767: {
      slidesPerView: 2,
    },
    1200: {
      slidesPerView: 3,
    },
  },
});
