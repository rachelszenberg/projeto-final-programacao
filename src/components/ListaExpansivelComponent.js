import React, { useState } from 'react';
import { StarComponent } from './StarComponent';
import { useDispatch, useSelector } from 'react-redux';
import { setAvaliacaoNotas } from '../features/AvaliacaoSlice';

export const ListaExpansivelComponent = (props) => {
  const [openIndex, setOpenIndex] = useState(null);
  const notasTemp = useSelector((state) => state.avaliacao);
  const dispatch = useDispatch();

  const getNota = (idPdf, idPergunta, idResposta) => {
    const pdf = notasTemp.find(p => p.idPdf === idPdf);
    if (pdf) {
      const pergunta = pdf.listNotasPorPdf.find(p => p.idPergunta === idPergunta);
      if (pergunta) {
        const resposta = pergunta.listNotasPorPerguntas.find(p => p.idResposta === idResposta);
        if (resposta) {
          return resposta.nota;
        }
      }
    }
    return 0;
  };

  const handleClick = (rate, idPdf, idPergunta, idResposta) => {
    const updatedNotas = [...notasTemp.map(pdf => ({
      ...pdf,
      listNotasPorPdf: pdf.listNotasPorPdf.map(pergunta => ({
        ...pergunta,
        listNotasPorPerguntas: [...pergunta.listNotasPorPerguntas]
      }))
    }))];
    let pdf = updatedNotas.find(p => p.idPdf === idPdf);
    if (!pdf) {
      pdf = { idPdf, listNotasPorPdf: [] };
      updatedNotas.push(pdf);
    }

    let pergunta = pdf.listNotasPorPdf.find(p => p.idPergunta === idPergunta);
    if (!pergunta) {
      pergunta = { idPergunta, listNotasPorPerguntas: [] };
      pdf.listNotasPorPdf.push(pergunta);
    }

    let respostaIndex = pergunta.listNotasPorPerguntas.findIndex(p => p.idResposta === idResposta);
    if (respostaIndex === -1) {
      pergunta.listNotasPorPerguntas = [...pergunta.listNotasPorPerguntas, { idResposta, nota: rate + 1 }];
    } else {
      const updatedResposta = { ...pergunta.listNotasPorPerguntas[respostaIndex], nota: rate + 1 };
      pergunta.listNotasPorPerguntas = [
        ...pergunta.listNotasPorPerguntas.slice(0, respostaIndex),
        updatedResposta,
        ...pergunta.listNotasPorPerguntas.slice(respostaIndex + 1)
      ];
    }
    dispatch(setAvaliacaoNotas(updatedNotas));
  };

  const toggleItem = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <div className="avaliacao-perguntas-view">
      {props.perguntas.map((pergunta, indexPergunta) => (
        <div key={indexPergunta} className='div-pergunta-avaliacao'>
          <div
            onClick={() => toggleItem(indexPergunta)}
            className='avaliacao-perguntas-title'
          >
            <p>{indexPergunta + 1}. {props.perguntasAll.find(p => p.id === pergunta).pergunta}</p>
            <span style={{ transform: openIndex === indexPergunta ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s', cursor: 'pointer' }}>
              ▶
            </span>
          </div>
          <div>
            {openIndex === indexPergunta && props.respostasDoQuestionario.map((respostas, indexResposta) => (
              <div key={indexResposta} className='resposta-field'>
                <p>{respostas.listRespostas[indexPergunta]}</p>
                <StarComponent
                  rating={getNota(respostas.idPdf, pergunta, respostas.idResposta)}
                  handleClick={(rate) => handleClick(rate, respostas.idPdf, pergunta, respostas.idResposta)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};