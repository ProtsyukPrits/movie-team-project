const refs = {
  loginBtn: document.querySelector('[data-lang = "log"]'),
  showSignupFormBtn: document.querySelector('.signup-show-btn'),
  loginForm: document.querySelector('.login-container'),
  signupForm: document.querySelector('.signup-container'),
  showLoginFormBtn: document.querySelector('.login-show-btn'),
  loginModal: document.querySelector('.login-modal-backdrop'),
  closeModalBtn: document.querySelector('.login-modal-close-btn'),
};

if (refs.loginBtn) {
  refs.loginBtn.addEventListener('click', openLoginModal);
}
if (refs.showSignupFormBtn) {
  refs.showSignupFormBtn.addEventListener('click', showSignupForm);
}
if (refs.showLoginFormBtn) {
  refs.showLoginFormBtn.addEventListener('click', showLoginForm);
}

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

export function closeLoginModalOnClick(e) {
  if (
    e.target.closest('.login-modal-close-btn') ||
    !e.target.closest('.login-modal')
  ) {
    closeLoginModal();
  }
}
function closeLoginModalOnEsc(e) {
  if (e.code === 'Escape') {
    closeLoginModal();
  }
}

function addDocumentClickListener() {
  document.addEventListener('click', closeLoginModalOnClick);
  document.addEventListener('keydown', closeLoginModalOnEsc);
}
export function closeLoginModal() {
  refs.loginModal.classList.add('is-hidden');
  document.removeEventListener('click', closeLoginModalOnClick);
  document.removeEventListener('keydown', closeLoginModalOnEsc);
  showLoginForm();
}
