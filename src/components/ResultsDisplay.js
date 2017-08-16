import React from 'react';


const ResultsDisplay = ({ score, stillfetching }) => {
  const scoreToShow = stillfetching ? "" : score.toString();
  return (
    <div>
      <h1>
        {"Final score: N/S " + scoreToShow}
      </h1>
    </div>
  );
};

export default ResultsDisplay;
