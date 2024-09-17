import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    questionarioIndex: 0,
    questionarios: [
        {
            pdf: 'https://jucisrs.rs.gov.br/upload/arquivos/201710/30150625-criacao-de-pdf-a.pdf',
            perguntas: [
                "Qual é o objetivo principal desta cláusula no acordo?",
                "Que aspectos específicos a cláusula cobre?",
                "Quais são os direitos e obrigações estabelecidos pela cláusula para cada parte envolvida?",
                "Como as responsabilidades são distribuídas entre as partes de acordo com esta cláusula?",
                "Quais são os prazos ou condições estabelecidos nesta cláusula?"
            ],
            respostas: ['a', 'b', 'c', 'd', 'e']
        },
        {
            pdf: 'https://static.poder360.com.br/2022/06/REBECA-MELLO-4.pdf',
            perguntas: [
                "Pergunta 1",
                "Pergunta 2",
                "Pergunta 3",
                "Pergunta 4",
                "Pergunta 5"
            ],
            respostas: ['a', 'b', 'c', 'd', 'e']
        },
        {
            pdf: 'https://www.tjmg.jus.br/data/files/8D/20/B5/1A/87D67710AAE827676ECB08A8/Minuta%20versao%20final.pdf.pdf',
            perguntas: [
                "Qual é o objetivo principal desta cláusula no acordo?",
                "Que aspectos específicos a cláusula cobre?",
                "Quais são os direitos e obrigações estabelecidos pela cláusula para cada parte envolvida?",
                "Como as responsabilidades são distribuídas entre as partes de acordo com esta cláusula?",
                "Quais são os prazos ou condições estabelecidos nesta cláusula?"
            ],
            respostas: ['a', 'b', 'c', 'd', 'e']
        }
    ]
}

// export const fetchAvaliacoes = createAsyncThunk(
//     'avaliacoes/fetchAvaliacoes',
//     async () => {
//         const snapshot = await get(ref(db, 'avaliacoes'))
//         const adresses = [];
//         snapshot.forEach((childSnapShot) => {
//             adresses.push({
//                 id: childSnapShot.key,
//                 ...childSnapShot.val()
//             })
//         })
//         return avaliacoes;
//     }
// );

export const avaliacaoSlice = createSlice({
    name: 'avaliacao',
    initialState,
    reducers: {
        incrementIndex: (state) => {
            state.questionarioIndex += 1;
        },
        decrementIndex: (state) => {
            state.questionarioIndex -= 1;
        },
        setAvaliacaoRespostas: (state, action) => {
            state.questionarios[state.questionarioIndex].respostas = action.payload;
        },
    }
})

export const selectAllAvaliacoes = (state) => state.avaliacao

export const { decrementIndex, incrementIndex, setAvaliacaoRespostas } = avaliacaoSlice.actions;

export default avaliacaoSlice.reducer;