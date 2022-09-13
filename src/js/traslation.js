import { languageBase } from './language-base';
const select = document.querySelector('.header__lang-select');
const formEl = document.querySelector('.header__search');
const registerFormSignUp = document.querySelector('.register-form__sign-up');
const registerFormSignIn = document.querySelector('.register-form__sign-in');

const LOCALSTORAGE_KEY3 = 'select_lang';
select.addEventListener('change', changeLocStLanguage);

export function changeLocStLanguage() {
  if (localStorage.getItem(LOCALSTORAGE_KEY3)) {
    localStorage.removeItem(LOCALSTORAGE_KEY3);
  }
  let chooseLang = select.value;
  localStorage.setItem(LOCALSTORAGE_KEY3, chooseLang);
  location.reload();
}



export default function hashValue() {
  if (localStorage.getItem('select_lang')) {
    return localStorage.getItem('select_lang');
  } else {
    return 'en';
  }
}

export function changeLanguage() {
  let hash = hashValue();
  select.value = hash;
  for (let key in languageBase) {
    let elem = document.querySelector('.lang-' + key);
    if (elem) {
      elem.innerHTML = languageBase[key][hash];
    }
    if (!hash) {
      elem.innerHTML = '';
    }
  }
}

changeLanguage();


export function chooseLanguageApi() {
  let hash = hashValue();
  if (hash === 'ua') {
    return 'uk';
  } else {
    return 'en-US';
  }
}