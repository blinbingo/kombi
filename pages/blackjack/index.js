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

      {/* Jogadores reposicionados abaixo dos círculos, evitando o amarelo */}
      <JogadorMesa top={470} left={260} rotate={60} nome="Jogador 1" />
      <JogadorMesa top={500} left={440} rotate={35} nome="Jogador 2" />
      <JogadorMesa top={550} left={620} rotate={0} nome="Jogador 3" />
      <JogadorMesa top={550} left={800} rotate={0} nome="Jogador 4" />
      <JogadorMesa top={550} left={980} rotate={0} nome="Jogador 5" />
      <JogadorMesa top={550} left={1160} rotate={0} nome="Jogador 6" />
      <JogadorMesa top={450} left={1340} rotate={-60} nome="Jogador 7" />
      <JogadorMesa top={430} left={1470} rotate={-80} nome="Jogador 8" />
    </div>
  );
}
