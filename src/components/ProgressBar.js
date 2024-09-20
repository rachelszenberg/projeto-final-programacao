import React from 'react';

export const ProgressBar = (props) => {
  const percentage = (props.ind / props.total) * 100;

  return (
    <div className="progress-container">
      <div className="container">
        <div className="bar" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};
