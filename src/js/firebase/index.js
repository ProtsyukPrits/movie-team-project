import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { closeLoginModal } from '../login-signup-modal';

const firebaseConfig = {
  apiKey: 'AIzaSyDudrXO2FGaDPVdShp083y9YUh36bm-4M4',
  authDomain: 'movies-team-project.firebaseapp.com',
  projectId: 'movies-team-project',
  storageBucket: 'movies-team-project.appspot.com',
  messagingSenderId: '57710816191',
  appId: '1:57710816191:web:5f12c71d60444a14cc8f0a',
};
// init firebase
initializeApp(firebaseConfig);

// init services

export const auth = getAuth();
const db = getFirestore();

// inner references
const refs = {
  signupForm: document.querySelector('.signup-form'),
  loginModal: document.querySelector('.login-modal'),
  loginForm: document.querySelector('.login-form'),
  signUpContainer: document.querySelector('.signup-container'),
  loginContainer: document.querySelector('.login-container'),
  logoutBtn: document.querySelector('[data-lang="logoutBtn"]'),
  loginBtn: document.querySelector('[data-lang = "log"]'),
  libraryLink: document.querySelector('.lang-library'),
  libraryLogOutBtn: document.querySelector('.library-header__log-btn'),
};

if (refs.libraryLink) {
  refs.libraryLink.addEventListener('click', e => {
    if (!auth.currentUser) {
      e.preventDefault();
      Notify.warning('Please log in or sign up to get access to your library');
    }
  });
}

if (refs.libraryLogOutBtn) {
  refs.libraryLogOutBtn.addEventListener('click', () => {
    signOut(auth)
      .then(() => {
        Notify.info('you have signed out');
        window.location.href = './index';
      })
      .catch(err => {
        console.log(err.message);
      });
  });
}

// collection reference
const colRef = collection(db, 'users');
// queries
export async function getUserWatched() {
  let films = [];
  await getDocs(collection(colRef, auth.currentUser.uid, 'watched'))
    .then(snapshot => {
      snapshot.docs.forEach(doc => {
        films.push({ ...doc.data(), id: doc.id });
      });
    })
    .catch(err => console.log(err.message));
  return films;
}

export async function getUserQueue() {
  let films = [];
  await getDocs(collection(colRef, auth.currentUser.uid, 'queue'))
    .then(snapshot => {
      snapshot.docs.forEach(doc => {
        films.push({ ...doc.data(), id: doc.id });
      });
    })
    .catch(err => console.log(err.message));
  return films;
}

export async function getFilmById(id, col) {
  let film;
  await getDoc(doc(colRef, auth.currentUser.uid, col, id))
    .then(doc => {
      film = doc.data();
    })
    .catch(err => console.log(err.message));
  return film;
}

//  getDoc(doc(db, 'users', auth.currentUser.uid)).then(doc => {
//    console.log(doc.data());
//  });

// adding and deleting documents to the collection

function addUserCols() {
  setDoc(doc(colRef, auth.currentUser.uid), {});
}

export function addFilmToWatched(filmData) {
  if (!auth.currentUser) {
    Notify.failure('You must login to add films');
    return;
  }
  setDoc(
    doc(colRef, auth.currentUser.uid, 'watched', filmData.id.toString()),
    filmData
  );
}

export function addFilmToQueue(filmData) {
  if (!auth.currentUser) {
    Notify.failure('You must login to add films');
    return;
  }
  setDoc(
    doc(colRef, auth.currentUser.uid, 'queue', filmData.id.toString()),
    filmData
  );
}

export function deleteMovieFromQueue(filmData) {
  deleteDoc(doc(colRef, auth.currentUser.uid, 'queue', filmData.id.toString()));
}

export function deleteMovieFromWatched(filmData) {
  deleteDoc(
    doc(colRef, auth.currentUser.uid, 'watched', filmData.id.toString())
  );
}

export function addtoWatchedAndDeleteFromQueue(filmData) {
  setDoc(
    doc(colRef, auth.currentUser.uid, 'watched', filmData.id.toString()),
    filmData
  );
  deleteDoc(doc(colRef, auth.currentUser.uid, 'queue', filmData.id.toString()));
}

// signing users up
if (refs.signupForm) {
  refs.signupForm.addEventListener('submit', e => {
    e.preventDefault();

    const email = refs.signupForm.email.value;
    const password = refs.signupForm.password.value;
    const name = refs.signupForm.name.value;

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        sendEmailVerification(auth.currentUser);
        refs.signupForm.reset();
        addUserCols();
        updateProfile(auth.currentUser, { displayName: name }).then(() => {
          Notify.success(
            `Thank you for registration, ${auth.currentUser.displayName}. We've send you verification email. Please follow the link inside`
          );
          signOut(auth)
            .then(() => {})
            .catch(err => {
              console.log(err.message);
            });
          closeLoginModal();
        });
      })
      .catch(err => {
        refs.signUpContainer.insertAdjacentHTML(
          'afterbegin',
          `<p style="color:#FF001B">${err.message}</p>`
        );
      });
  });

  // logging in and out

  if (refs.logoutBtn) {
    refs.logoutBtn.addEventListener('click', () => {
      signOut(auth)
        .then(() => {
          Notify.info('you have signed out');
        })
        .catch(err => {
          console.log(err.message);
        });
    });
  }

  if (refs.loginForm) {
    refs.loginForm.addEventListener('submit', e => {
      e.preventDefault();

      const email = refs.loginForm.email.value;
      const password = refs.loginForm.password.value;

      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          refs.loginForm.reset();
          Notify.success(
            `Hello, ${auth.currentUser.displayName}! Have a nice time!`
          );
          closeLoginModal();
        })
        .catch(err => {
          refs.loginContainer.insertAdjacentHTML(
            'afterbegin',
            `<p style="color:#FF001B">${err.message}</p>`
          );
        });
    });
  }

  // signed-in user observer;
  onAuthStateChanged(auth, user => {
    if (user && refs.logoutBtn && refs.loginBtn) {
      refs.logoutBtn.classList.remove('is-hidden');
      refs.loginBtn.classList.add('is-hidden');

      // refs.libraryLink.classList.remove('is-hidden');
    } else if (refs.logoutBtn && refs.loginBtn) {
      document;
      refs.logoutBtn.classList.add('is-hidden');
      refs.loginBtn.classList.remove('is-hidden');
      // refs.libraryLink.classList.add('is-hidden');
    }
  });
}
