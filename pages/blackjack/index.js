
import React from "react";
import Image from "next/image";

export default function Blackjack() {
  const jogadores = [
    "Jogador 1", "Jogador 2", "Jogador 3", "Jogador 4",
    "Jogador 5", "Jogador 6", "Jogador 7", "Jogador 8"
  ];

  const posicoes = [
    { top: "82.74%", left: "15.12%" },
    { top: "87.47%", left: "27.63%" },
    { top: "91.02%", left: "40.15%" },
    { top: "92.20%", left: "50.05%" },
    { top: "91.02%", left: "59.96%" },
    { top: "87.47%", left: "72.47%" },
    { top: "82.74%", left: "84.46%" },
    { top: "75.65%", left: "91.24%" }
  ];

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#000",
        overflow: "hidden"
      }}
    >
      <Image
        src="/blackjack/mesa.png"
        alt="Mesa de Blackjack"
        fill
        style={{
          objectFit: "cover"
        }}
        priority
      />

      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          color: "#facc15",
          fontWeight: "bold",
          textAlign: "center",
          fontSize: "18px"
        }}
      >
        Dealer
        <div
          style={{
            marginTop: "8px",
            backgroundColor: "#fff",
            padding: "6px 10px",
            borderRadius: "6px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
            display: "inline-block",
            color: "#000"
          }}
        >
          ♠ A ♣ 9
        </div>
      </div>

      {jogadores.map((nome, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: posicoes[i].top,
            left: posicoes[i].left,
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "#bbf7d0",
            fontWeight: "bold",
            fontSize: "13px",
            width: "80px"
          }}
        >
          {nome}
          <div
            style={{
              marginTop: "6px",
              backgroundColor: "#fff",
              padding: "4px 8px",
              borderRadius: "6px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
              color: "#000"
            }}
          >
            ♥ Q ♠ 7
          </div>
        </div>
      ))}
    </div>
  );
}
