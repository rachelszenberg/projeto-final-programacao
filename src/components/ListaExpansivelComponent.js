import React, { useState, useRef, useEffect } from 'react';
import { StarComponent } from './StarComponent';
import { useDispatch, useSelector } from 'react-redux';
import { setAvaliacaoNotas, selectNota, setRespostasSemNota, removeItemFromRespostasSemNota } from '../features/AvaliacaoSlice';

export const ListaExpansivelComponent = (props) => {
  const [openIndex, setOpenIndex] = useState(null);
  const [listIndex, setListIndex] = useState([]);
  const avaliacao = useSelector((state) => state.avaliacao);
  const notasTemp = avaliacao.notas;
  const respostasSemNota = avaliacao.respostasSemNota;
  const dispatch = useDispatch();
  const itemRefs = useRef([]);

  const getNota = (idPdf, idPergunta, idResposta) => {
    const nota = selectNota(avaliacao, { idPdf, idPergunta, idResposta });
    return nota;
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
    
    dispatch(removeItemFromRespostasSemNota({idPergunta, idResposta}));
    dispatch(setAvaliacaoNotas(updatedNotas));
  };

  const toggleItem = (index) => {
    if (openIndex >= 0 && !listIndex.includes(openIndex)) {
      let temp = listIndex;
      temp.push(openIndex);
      setListIndex(temp);
    }
    dispatch(setRespostasSemNota({ perguntas: props.perguntas, respostasDoQuestionario: props.respostasDoQuestionario, listIndex: listIndex }));

    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  useEffect(() => {
    if (openIndex !== null && itemRefs.current[openIndex]) {
      itemRefs.current[openIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [openIndex]);

  return (
    <div className="avaliacao-perguntas-view">
      {props.perguntas.map((pergunta, indexPergunta) => {
        const respostasSemNotaPorPergunta = respostasSemNota.filter(item => item.perguntaId === pergunta);

        return (
          <div
            key={indexPergunta}
            className={`div-pergunta-avaliacao ${respostasSemNotaPorPergunta.length ? 'pergunta-sem-nota' : undefined}`}
            ref={(el) => (itemRefs.current[indexPergunta] = el)} // Atribui a ref ao item correspondente
          >
            <div
              onClick={() => toggleItem(indexPergunta)}
              className='avaliacao-perguntas-title'
              id={indexPergunta}
            >
              <p>{indexPergunta + 1}. {props.perguntasAll.find(p => p.id === pergunta).pergunta}</p>
              <span style={{ transform: openIndex === indexPergunta ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s', cursor: 'pointer' }}>
                ▶
              </span>
            </div>
            <div>
              {openIndex === indexPergunta && props.respostasDoQuestionario.map((respostas, indexResposta) => {
                const temNota = respostasSemNotaPorPergunta.find(r => r.respostaId === respostas.idResposta);
                return (
                  <div key={indexResposta} className={`resposta-field ${temNota ? 'resposta-sem-nota' : undefined}`}>
                    <p>{respostas.listRespostas[indexPergunta]}</p>
                    <StarComponent
                      rating={getNota(respostas.idPdf, pergunta, respostas.idResposta)}
                      handleClick={(rate) => handleClick(rate, respostas.idPdf, pergunta, respostas.idResposta)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};