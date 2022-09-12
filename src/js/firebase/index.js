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
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
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

const auth = getAuth();
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
  //   libraryLink: document.querySelector('.mylibrary-link'),
};
// collection reference
const colRef = collection(db, 'users');
let docRef;
// queries
getDocs(colRef)
  .then(snapshot => {
    let users = [];
    snapshot.docs.forEach(doc => {
      users.push({ ...doc.data(), id: doc.id });
    });
    console.log(users);
  })
  .catch(err => console.log(err.message));

//  getDoc(doc(db, 'users', auth.currentUser.uid)).then(doc => {
//    console.log(doc.data());
//  });

// adding documents to the collection

function addUserCols() {
  setDoc(doc(colRef, auth.currentUser.uid), { watched: {}, queue: {} }).then();
}

// signing users up
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
          .then(() => {
            console.log('user signed out');
          })
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

refs.logoutBtn.addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      console.log('user signed out');
      docRef = null;
    })
    .catch(err => {
      console.log(err.message);
    });
});

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
      docRef = doc(colRef, auth.currentUser.uid);
    })
    .catch(err => {
      refs.loginContainer.insertAdjacentHTML(
        'afterbegin',
        `<p style="color:#FF001B">${err.message}</p>`
      );
    });
});
// signed-in user observer;
onAuthStateChanged(auth, user => {
  if (user) {
    refs.logoutBtn.classList.remove('is-hidden');
    refs.loginBtn.classList.add('is-hidden');

    // refs.libraryLink.classList.remove('is-hidden');
  } else {
    document;
    refs.logoutBtn.classList.add('is-hidden');
    refs.loginBtn.classList.remove('is-hidden');
    // refs.libraryLink.classList.add('is-hidden');
  }
});
