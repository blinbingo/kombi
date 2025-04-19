import React from "react";

export default function SorteioCard({ horario, valorCartela, premios }) {
  return (
    <div style={{
      border: "2px solid #00ff00",
      borderRadius: "10px",
      padding: "12px",
      margin: "10px",
      minWidth: "250px",
      backgroundColor: "#111827",
      color: "white",
      boxShadow: "0 0 12px #00ff00"
    }}>
      <h3 style={{ marginBottom: "6px", fontSize: "18px", color: "#00ff00" }}>
        BINGO - {horario}
      </h3>
      <p style={{ margin: "6px 0" }}>
        <strong>PREMIAÇÃO:</strong><br />
        25%: R$ {premios[25]} | 50%: R$ {premios[50]} | 75%: R$ {premios[75]} | 100%: R$ {premios[100]}
      </p>
      <p style={{ margin: "6px 0" }}>
        <strong>VALOR DA CARTELA:</strong> R$ {valorCartela}
      </p>
      <button
        style={{
          backgroundColor: "transparent",
          border: "2px solid #00ff00",
          color: "#00ff00",
          padding: "6px 12px",
          borderRadius: "6px",
          fontWeight: "bold",
          cursor: "pointer"
        }}
        disabled
      >
        COMPRAR
      </button>
    </div>
  );
}
