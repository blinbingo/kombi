import React, { useState } from "react";

export default function PainelControle2({ onReiniciar }) {
  const [confirmar, setConfirmar] = useState(false);

  return (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginBottom: "20px" }}>
      {!confirmar ? (
        <button
          onClick={() => setConfirmar(true)}
          style={{
            padding: "8px 16px",
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
      ) : (
        <>
          <button
            onClick={onReiniciar}
            style={{
              padding: "8px 16px",
              border: "2px solid red",
              backgroundColor: "transparent",
              color: "red",
              fontWeight: "bold",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Confirmar Reinício
          </button>
          <button
            onClick={() => setConfirmar(false)}
            style={{
              padding: "8px 16px",
              border: "2px solid gray",
              backgroundColor: "transparent",
              color: "gray",
              fontWeight: "bold",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Cancelar
          </button>
        </>
      )}
    </div>
  );
}
