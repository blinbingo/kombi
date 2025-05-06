// pages/blackjack/index.js
import Image from "next/image";
import dynamic from "next/dynamic";
import JogadorMesa from "@/components/blackjack/JogadorMesa";

// Carrega a lógica do jogo apenas no navegador
const MesaJogo = dynamic(() => import("@/components/blackjack/MesaJogo"), {
  ssr: false,
});

export default function BlackjackPage() {
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Fundo da mesa */}
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
        Dealer ♠ ?
      </div>

      {/* Jogadores posicionados responsivamente */}
      <JogadorMesa top="75%" left="15%" rotate={0} nome="Jogador 1" />
      <JogadorMesa top="75%" left="25%" rotate={0} nome="Jogador 2" />
      <JogadorMesa top="75%" left="35%" rotate={0} nome="Jogador 3" />
      <JogadorMesa top="75%" left="45%" rotate={0} nome="Jogador 4" />
      <JogadorMesa top="75%" left="55%" rotate={0} nome="Jogador 5" />
      <JogadorMesa top="75%" left="65%" rotate={0} nome="Jogador 6" />
      <JogadorMesa top="75%" left="75%" rotate={0} nome="Jogador 7" />
      <JogadorMesa top="75%" left="85%" rotate={0} nome="Jogador 8" />

      {/* Componente principal do jogo */}
      <MesaJogo />
    </div>
  );
}
