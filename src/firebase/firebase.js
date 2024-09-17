// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBcImJEVyHo_Q8j4IsvxYcMxS3s4te_oaI",
  authDomain: "projetomestrado-3c73a.firebaseapp.com",
  projectId: "projetomestrado-3c73a",
  storageBucket: "projetomestrado-3c73a.appspot.com",
  messagingSenderId: "70780884869",
  appId: "1:70780884869:web:9f6c611a86c82f8a4116ec",
  measurementId: "G-82HM61NQ67"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

set(ref(db), {
  name: 'Rachel',
  age: 22,
  location: {
    city: 'Rio de Janeiro',
    country: 'Brasil'
  }
}).then(() => {
  console.log('data is saved')
}).catch((e) => {
  console.log('Error: ',e)
})