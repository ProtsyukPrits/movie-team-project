refs = {
  loginBtn: document.querySelector('[data-lang = "log"]'),
  showSignupFormBtn: document.querySelector('.signup-show-btn'),
  loginForm: document.querySelector('.login-form'),
  signupForm: document.querySelector('.signup-form'),
  showLoginFormBtn: document.querySelector('.login-show-btn'),
  loginModal: document.querySelector('.login-modal-backdrop'),
  closeModalBtn: document.querySelector('.login-modal-close-btn'),
};

refs.loginBtn.addEventListener('click', openLoginModal);
refs.showSignupFormBtn.addEventListener('click', showSignupForm);
refs.showLoginFormBtn.addEventListener('click', showLoginForm);

function openLoginModal() {
  refs.loginModal.classList.remove('is-hidden');

  setTimeout(addDocumentClickListener, 200);
}
function showSignupForm() {
  refs.loginForm.style.display = 'none';
  refs.signupForm.style.display = 'block';
}
function showLoginForm() {
  refs.loginForm.style.display = 'block';
  refs.signupForm.style.display = 'none';
}

function closeLoginModal(e) {
  if (
    e.target.closest('.login-modal-close-btn') ||
    !e.target.closest('.login-modal')
  ) {
    refs.loginModal.classList.add('is-hidden');
    document.removeEventListener('click', closeLoginModal);
    document.removeEventListener('keydown', closeLoginModal);
    showLoginForm();
  }
}
function closeLoginModalOnEsc(e) {
  if (e.code === 'Escape') {
    refs.loginModal.classList.add('is-hidden');
    document.removeEventListener('click', closeLoginModal);
    document.removeEventListener('keydown', closeLoginModal);
    showLoginForm();
  }
}

function addDocumentClickListener() {
  document.addEventListener('click', closeLoginModal);
  document.addEventListener('keydown', closeLoginModalOnEsc);
}
