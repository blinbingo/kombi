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

      {/* Jogadores - posições estimadas e rotacionadas de forma razoável */}
      <JogadorMesa top={370} left={275} rotate={45} nome="Jogador 1" />
      <JogadorMesa top={400} left={450} rotate={30} nome="Jogador 2" />
      <JogadorMesa top={430} left={625} rotate={15} nome="Jogador 3" />
      <JogadorMesa top={440} left={800} rotate={0} nome="Jogador 4" />
      <JogadorMesa top={430} left={975} rotate={-15} nome="Jogador 5" />
      <JogadorMesa top={400} left={1150} rotate={-30} nome="Jogador 6" />
      <JogadorMesa top={370} left={1325} rotate={-45} nome="Jogador 7" />
      <JogadorMesa top={325} left={1450} rotate={-60} nome="Jogador 8" />
    </div>
  );
}
