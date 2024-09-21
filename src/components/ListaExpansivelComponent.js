import React, { useState } from 'react';

export const ListaExpansivelComponent = (props) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleItem = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <div className="avaliacao-perguntas-view">
      {props.perguntas.map((item, index) => (
        <div key={index}>
          <div
            onClick={() => toggleItem(index)}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <span style={{ transform: openIndex === index ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
              ▶
            </span>
            <h3>{index + 1}. {props.perguntasAll.find(p => p.id === item).pergunta}</h3>
          </div>
          {openIndex === index && props.respostasDoQuestionario.map((respostas) => (
            <p className='resposta-field'>{respostas.listRespostas[index]}</p>
          ))}
        </div>
      ))}
    </div>
  );
};