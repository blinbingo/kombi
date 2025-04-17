
import React from 'react';

const HistoricoBolas = ({ bolas }) => {
  return (
    <div className="historico-bolas-container">
      <h3>Histórico</h3>
      <div className="bolinhas-grid">
        {bolas.map((bola, index) => (
          <div key={index} className="bolinha">{bola}</div>
        ))}
      </div>
    </div>
  );
};

export default HistoricoBolas;
