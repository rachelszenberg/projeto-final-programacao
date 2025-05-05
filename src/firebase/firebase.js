import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBHl6UIpDKIVKB-_wBYub-x_9_1tOyj3-g",
  authDomain: "projeto-final-programaca-4b979.firebaseapp.com",
  databaseURL: "https://projeto-final-programaca-4b979-default-rtdb.firebaseio.com",
  projectId: "projeto-final-programaca-4b979",
  storageBucket: "projeto-final-programaca-4b979.firebasestorage.app",
  messagingSenderId: "876935214006",
  appId: "1:876935214006:web:6c3d94f4c8b44b95a64717",
  measurementId: "G-JHTCNB908X"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);