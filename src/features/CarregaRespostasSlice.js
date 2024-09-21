import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { get, ref } from "firebase/database";
import { db } from "../firebase/firebase";

export const fetchRespostas = createAsyncThunk(
    'resposta/fetchResposta',
    async () => {

        // RESPOSTAS
        // const snapshot = await get(ref(db, 'respostas'))
        // const respostas = [];
        // snapshot.forEach((childSnapShot) => {
        //     const listPdf = Object.entries(childSnapShot.val()).map(([key, value]) => ({ idPdf: key, respostasPorPdf: 
        //         Object.entries(value).map(([key, childValue]) => ({ idPessoa: key, respostasPorPessoa: 
        //             Object.entries(childValue).map(([key, grandson]) => ({ idResposta: key, respostasPorPessoa: grandson }))
        //          }))
        //      }));
        //     // const aaaaa = Object.entries(listPdf).map(([key, value]) => ({ idPdf: key, respostasPorPessoa: value }));

        //     respostas.push({
        //         idQuestionario: childSnapShot.key,
        //         listRespostas: listPdf
        //     })
        // })

        
        // FORMA 2
        // const groupedResponses = [];
        // const snapshot = await get(ref(db, 'respostas'))
        // snapshot.forEach((childSnapShot) => {
        //     const vaiQue = [[], [], [], [], [], []];
        //     Object.entries(childSnapShot.val()).forEach((pdfKey) => {
        //         const pdf = childSnapShot.val()[pdfKey[0]];
                
        //         Object.keys(pdf).forEach((personKey) => {
        //             const person = pdf[personKey];
        //             console.log(Object.keys(person).length);
                    
        //             let listTemp = []
        //             Object.keys(person).forEach((responseKey, i) => {
        //                 const response = person[responseKey];
        //                 const aux = {id: personKey, resposta: response}
        //                 listTemp.push(aux);
        //             });
        //             listTemp.forEach((l, index) => { vaiQue[index].push(l) })
        //         });
        //     });
        //     groupedResponses.push(vaiQue);
        // })

        // console.log(groupedResponses);
        // return groupedResponses;

        const snapshot = await get(ref(db, 'respostasTeste2'))
        const todasRespostas = [];
        snapshot.forEach((childSnapShot) => {
            const respostas = Object.entries(childSnapShot.val()).map(([key, value]) => ({idResposta: key, idPdf: value.idPdf, listRespostas: value.listRespostas}));
    
            todasRespostas.push({
                id: childSnapShot.key,
                respostasPorQuestionario: respostas
            })
        });
        
        return todasRespostas;
    }
);

export const carregaRespostasSlice = createSlice({
    name: 'todasRespostas',
    initialState: [],
    extraReducers: (builder) => {
        builder
            .addCase(fetchRespostas.fulfilled, (state, action) => {
                state.push(action.payload)
            })
    }
})

export const selectAllRespostas = (state) => state.todasRespostas[0];

export default carregaRespostasSlice.reducer;