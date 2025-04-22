import React from "react";

export default function PainelControle2({ onReiniciar }) {
  return (
    <div style={{ marginTop: "20px" }}>
      <button
        onClick={onReiniciar}
        style={{
          padding: "10px 20px",
          border: "2px solid #00ff00",
          backgroundColor: "transparent",
          color: "#00ff00",
          fontWeight: "bold",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        🔁 Reiniciar
      </button>
    </div>
  );
}
