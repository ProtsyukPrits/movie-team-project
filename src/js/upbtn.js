const showOnPx = 100;
const backToTopButton = document.querySelector('.back-to-top-btn');
const pageProgressBar = document.querySelector('.progress-bar');

const scrollContainer = () => {
  return document.documentElement || document.body;
};

const goToTop = () => {
  document.body.scrollIntoView({
    behavior: 'smooth',
  });
};

document.addEventListener('scroll', () => {

  const scrolledPercentage =
    (scrollContainer().scrollTop /
      (scrollContainer().scrollHeight - scrollContainer().clientHeight)) *
    100;

  pageProgressBar.style.height = `${scrolledPercentage}%`;

  if (scrollContainer().scrollTop > showOnPx) {
    backToTopButton.classList.remove('is-hidden');
  } else {
    backToTopButton.classList.add('is-hidden');
  }
});

backToTopButton.addEventListener('click', goToTop);