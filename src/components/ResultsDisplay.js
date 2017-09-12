import React from 'react';


const ResultsDisplay = ({ allPass, score, stillfetching }) => {
  const scoreToShow = stillfetching ? "" : score.toString();
  return (
    <div>
      <h1>
        {allPass ? "PASSED" : "Final score: N/S " + scoreToShow}
      </h1>
    </div>
  );
};

export default ResultsDisplay;
