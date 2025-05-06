import React from "react";
import Image from "next/image";

export default function MesaBlackjack() {
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Image
        src="/blackjack/mesa.png"
        alt="Mesa de Blackjack"
        layout="fill"
        objectFit="cover"
        quality={100}
        priority
      />

      {/* Dealer */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 950,
          backgroundColor: "white",
          padding: "4px 8px",
          borderRadius: 8,
          fontWeight: "bold",
          color: "#f0ad00",
        }}
      >
        Dealer ♠ A ♣ 9
      </div>

      {/* Jogador 1 - nova posição e rotação refinada */}
      <div
        style={{
          position: "absolute",
          top: 180,
          left: 120,
          transform: "rotate(130deg)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "4px 8px",
            borderRadius: 8,
            fontWeight: "bold",
            marginBottom: 4,
            transform: "rotate(-130deg)",
          }}
        >
          ♥ Q ♠ 7
        </div>
        <div
          style={{
            backgroundColor: "white",
            padding: "4px 8px",
            borderRadius: 8,
            fontWeight: "bold",
            color: "#0f0f0f",
            transform: "rotate(-130deg)",
          }}
        >
          Jogador 1
        </div>
      </div>
    </div>
  );
}
