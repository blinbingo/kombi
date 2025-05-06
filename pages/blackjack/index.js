import React from "react";
import Image from "next/image";
import JogadorMesa from "../../components/JogadorMesa";

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
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "white",
          padding: "4px 8px",
          borderRadius: 8,
          fontWeight: "bold",
          color: "#f0ad00",
        }}
      >
        Dealer ♠ A ♣ 9
      </div>

      {/* Jogadores com posicionamento responsivo por porcentagem */}
      <JogadorMesa top="75%" left="15%" rotate={60} nome="Jogador 1" />
      <JogadorMesa top="75%" left="25%" rotate={35} nome="Jogador 2" />
      <JogadorMesa top="75%" left="35%" rotate={15} nome="Jogador 3" />
      <JogadorMesa top="75%" left="45%" rotate={0} nome="Jogador 4" />
      <JogadorMesa top="75%" left="55%" rotate={-15} nome="Jogador 5" />
      <JogadorMesa top="75%" left="65%" rotate={-35} nome="Jogador 6" />
      <JogadorMesa top="75%" left="75%" rotate={-60} nome="Jogador 7" />
      <JogadorMesa top="75%" left="85%" rotate={-80} nome="Jogador 8" />
    </div>
  );
}
