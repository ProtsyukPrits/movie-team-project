const showOnPx = 300;

const scrollContainer = () => {
    return document.documentElement || document.body;
};

const goToTop = () => {
    document.body.scrollIntoView({
        behavior: 'smooth'
    });
};

export const onScrollFunction = () => {
    const scrolledPercentage = (scrollContainer().scrollTop / (scrollContainer().scrollHeight - scrollContainer().clientHeight)) * 100;

    refs.pageProgressBar.style.height = `${scrolledPercentage}%`;

    if (scrollContainer().scrollTop > showOnPx) {
        refs.backToTopBtn.classList.remove('is-hidden');
    } else {
        refs.backToTopBtn.classList.add('is-hidden');
    };
};

document.onscroll = onScrollFunction;
refs.backToTopBtn.addEventListener('click', goToTop);
refs.paginationWatched.addEventListener('click', goToTop);
refs.paginationQueue.addEventListener('click', goToTop);

