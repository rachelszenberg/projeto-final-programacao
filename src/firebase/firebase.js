import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBcImJEVyHo_Q8j4IsvxYcMxS3s4te_oaI",
  authDomain: "projetomestrado-3c73a.firebaseapp.com",
  databaseURL: "https://projetomestrado-3c73a-default-rtdb.firebaseio.com",
  projectId: "projetomestrado-3c73a",
  storageBucket: "projetomestrado-3c73a.appspot.com",
  messagingSenderId: "70780884869",
  appId: "1:70780884869:web:9f6c611a86c82f8a4116ec",
  measurementId: "G-82HM61NQ67"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);