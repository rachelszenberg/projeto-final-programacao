import React from 'react';

export const ProgressBar = ({ total, ind }) => {
  // Calcula a porcentagem do progresso
  const percentage = (ind / total) * 100;

  return (
    <div className="progress-container">
      <div className="container">
        <div className="bar" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};
