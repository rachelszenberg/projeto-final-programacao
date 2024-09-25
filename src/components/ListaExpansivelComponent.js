import React, { useState } from 'react';
import { StarComponent } from './StarComponent';

export const ListaExpansivelComponent = (props) => {
  const [openIndex, setOpenIndex] = useState(null);
  const [rating, setRating] = useState(0);

  const handleClick = (index) => {
    setRating(index + 1);
    console.log(`Estrela clicada: ${index + 1}`);
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
      {props.perguntas.map((item, index) => (
        <div key={index} className='div-pergunta-avaliacao'>
          <div
            onClick={() => toggleItem(index)}
            className='avaliacao-perguntas-title'
          >
            <p>{index + 1}. {props.perguntasAll.find(p => p.id === item).pergunta}</p>
            <span style={{ transform: openIndex === index ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s', cursor: 'pointer' }}>
              ▶
            </span>
          </div>
          <div>
            {openIndex === index && props.respostasDoQuestionario.map((respostas) => (
              <div className='resposta-field'>
                <p>
                  {respostas.listRespostas[index]}
                </p>
                  <StarComponent
                    rating={rating}
                    handleClick={(index) => handleClick(index)}
                  />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};