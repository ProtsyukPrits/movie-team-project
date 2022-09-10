refs = {
  loginBtn: document.querySelector('[data-lang = "log"]'),
  showSignupFormBtn: document.querySelector('.signup-show-btn'),
  loginForm: document.querySelector('.login-form'),
  signupForm: document.querySelector('.signup-form'),
  showLoginFormBtn: document.querySelector('.login-show-btn'),
  loginModal: document.querySelector('.login-modal-backdrop'),
};

refs.loginBtn.addEventListener('click', openLoginModal);
refs.showSignupFormBtn.addEventListener('click', showSignupForm);
refs.showLoginFormBtn.addEventListener('click', showLoginForm);

function openLoginModal() {
  refs.loginModal.classList.remove('is-hidden');
}
function showSignupForm() {
  refs.loginForm.style.display = 'none';
  refs.signupForm.style.display = 'block';
}
function showLoginForm() {
  refs.loginForm.style.display = 'block';
  refs.signupForm.style.display = 'none';
}
