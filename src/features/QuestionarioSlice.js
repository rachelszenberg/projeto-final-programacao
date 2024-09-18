import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { get, ref } from "firebase/database";
import { db } from "../firebase/firebase";

// const initialState = {
//     questionarioIndex: 0,
//     questionario: [
//         {
//             pdf: 'https://jucisrs.rs.gov.br/upload/arquivos/201710/30150625-criacao-de-pdf-a.pdf',
//             perguntas: [
//                 "Qual é o objetivo principal desta cláusula no acordo?",
//                 "Que aspectos específicos a cláusula cobre?",
//                 "Quais são os direitos e obrigações estabelecidos pela cláusula para cada parte envolvida?",
//                 "Como as responsabilidades são distribuídas entre as partes de acordo com esta cláusula?",
//                 "Quais são os prazos ou condições estabelecidos nesta cláusula?"
//             ],
//             respostas: ['a', 'b', 'c', 'd', 'e']
//         },
//         {
//             pdf: 'https://static.poder360.com.br/2022/06/REBECA-MELLO-4.pdf',
//             perguntas: [
//                 "Pergunta 1",
//                 "Pergunta 2",
//                 "Pergunta 3",
//                 "Pergunta 4",
//                 "Pergunta 5"
//             ],
//             respostas: ['a', 'b', 'c', 'd', 'e']
//         },
//         {
//             pdf: 'https://www.tjmg.jus.br/data/files/8D/20/B5/1A/87D67710AAE827676ECB08A8/Minuta%20versao%20final.pdf.pdf',
//             perguntas: [
//                 "Qual é o objetivo principal desta cláusula no acordo?",
//                 "Que aspectos específicos a cláusula cobre?",
//                 "Quais são os direitos e obrigações estabelecidos pela cláusula para cada parte envolvida?",
//                 "Como as responsabilidades são distribuídas entre as partes de acordo com esta cláusula?",
//                 "Quais são os prazos ou condições estabelecidos nesta cláusula?"
//             ],
//             respostas: ['a', 'b', 'c', 'd', 'e']
//         }
//     ]
// }

export const fetchQuestionarios = createAsyncThunk(
    'questionario/fetchQuestionario',
    async () => {
        const snapshot = await get(ref(db, 'questionarios'))
        const questionarios = [];
        snapshot.forEach((childSnapShot) => {            
            questionarios.push({
                id: childSnapShot.key,
                ...childSnapShot.val()
            })
        })
        return questionarios;
    }
);

export const avaliacaoSlice = createSlice({
    name: 'questionarios',
    initialState: [],
    extraReducers: (builder) => {
        builder
        .addCase(fetchQuestionarios.fulfilled, (state, action) => {
            state.push(action.payload)
        })
    }
})

export const selectAllQuestionarios = (state) => state.questionario[0];

export default avaliacaoSlice.reducer;