import React from "react";

export default function SimuladorBoard({ bolasSelecionadas, numeros, contador, sorteando }) {
  return (
    <>
      <div className="bingo-board">
        {numeros.map((num) => (
          <div
            key={num}
            className={`bola ${bolasSelecionadas.includes(num) ? "selecionada" : ""}`}
          >
            {num}
          </div>
        ))}
      </div>

      {sorteando && contador !== null && (
        <p className="cronometro-digital">Próxima bola em: {contador}s</p>
      )}

      <h3>Histórico</h3>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "6px",
          marginTop: "10px",
        }}
      >
        {bolasSelecionadas.map((bola, i) => (
          <div
            key={i}
            className="bola"
            style={{ width: "32px", height: "32px", fontSize: "0.85rem" }}
          >
            {bola}
          </div>
        ))}
      </div>
    </>
  );
}
