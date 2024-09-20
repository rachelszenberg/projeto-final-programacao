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

// set(ref(db, 'avaliacoes/-O7157lV0k3um_Zecaz2/-O7B6ikebbmk6mFhUhIo/-O7Fr337x3F8gDbMzf_R/0'),
//   [[ 2, 4, 2, 1, 5 ], [ 2, 5, 3, 2, 5 ], [ 4, 2, 3, 3, 3 ]],
// );

// push(ref(db, 'questionarios/-O71T95HcomD_tVRwVxN/pdf'),
// "https://www.gov.br/mme/pt-br/acesso-a-informacao/entidades/chesf/poli_corp/PoliticadeCelebraodeAcordosJudiciaiseExtrajudiciaisdasEmpresasEletrobras.pdf"
// )
// push(ref(db, 'questionarios/-O71T95HcomD_tVRwVxN/pdf'),
// "https://www.tjmg.jus.br/data/files/8D/20/B5/1A/87D67710AAE827676ECB08A8/Minuta%20versao%20final.pdf.pdf"
// )
// push(ref(db, 'questionarios/-O71T95HcomD_tVRwVxN/pdf'),
// "https://www.tjmg.jus.br/data/files/8D/20/B5/1A/87D67710AAE827676ECB08A8/Minuta%20versao%20final.pdf.pdf"
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