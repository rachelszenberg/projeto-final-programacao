import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, get, set } from 'firebase/database'
// import { getDatabase } from 'firebase/database'

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

// set(ref(db), {
//   name: 'Rachel',
//   age: 22,
//   location: {
//     city: 'Rio de Janeiro',
//     country: 'Brasil'
//   }
// }).then(() => {
//   console.log('data is saved')
// }).catch((e) => {
//   console.log('Error: ',e)
// })

// set(ref(db, 'questionarios/-O7157lV0k3um_Zecaz2/perguntas'), 
// [
//                   "Qual é o objetivo principal desta cláusula no acordo?",
//                   "Que aspectos específicos a cláusula cobre?",
//                   "Quais são os direitos e obrigações estabelecidos pela cláusula para cada parte envolvida?",
//                   "Como as responsabilidades são distribuídas entre as partes de acordo com esta cláusula?",
//                   "Quais são os prazos ou condições estabelecidos nesta cláusula?"
//               ],
// );

// push(ref(db, 'respostas/-O7157lV0k3um_Zecaz2'), 
// [
//   "a", "b"
// ],
// )

// get(ref(db, 'questionarios'))
// .then((snapshot) => {
//   const aaa = [];
//   if (snapshot.exists) {
//     snapshot.forEach((childSnapshot) => {
//       aaa.push({
//         id: childSnapshot.key,
//         ...childSnapshot.val()
//       })
//     })
//     console.log(aaa);
//   }
// })