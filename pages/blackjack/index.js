// pages/blackjack/index.js
import Image from "next/image";
import dynamic from "next/dynamic";
import JogadorComVisual from "@/components/blackjack/JogadorComVisual";
import { useState } from "react";

const MesaJogo = dynamic(() => import("@/components/blackjack/MesaJogo"), {
  ssr: false,
});

export default function BlackjackPage() {
  const [dadosJogadores, setDadosJogadores] = useState(
    Array.from({ length: 8 }, (_, i) => ({
      nome: `Jogador ${i + 1}`,
      cartas: [],
      estourado: false,
      parou: false,
    }))
  );
  const [jogadorAtual, setJogadorAtual] = useState(0);
  const [dealer, setDealer] = useState({ cartas: [] });
  const [jogoIniciado, setJogoIniciado] = useState(false);
  const [jogoFinalizado, setJogoFinalizado] = useState(false);
  const deck = new (require("@/components/blackjack/DeckManager").default)();

  const posicoes = [
    { top: "62%", left: "14%", rotate: 60 },
    { top: "68%", left: "29%", rotate: 35 },
    { top: "73%", left: "44%", rotate: 15 },
    { top: "75%", left: "59%", rotate: 0 },
    { top: "73%", left: "74%", rotate: -15 },
    { top: "68%", left: "89%", rotate: -35 },
    { top: "62%", left: "97%", rotate: -60 },
    { top: "55%", left: "99%", rotate: -80 },
  ];

  const sortearCarta = () => {
    const novaCarta = deck.sortearCarta();
    const novos = [...dadosJogadores];
    const atual = novos[jogadorAtual];
    atual.cartas.push(novaCarta);
    const pontos = calcularPontuacao(atual.cartas);
    atual.estourado = pontos > 21;
    if (pontos >= 21) atual.parou = true;
    setDadosJogadores(novos);
    if (atual.parou || atual.estourado) passar();
  };

  const parar = () => {
    const novos = [...dadosJogadores];
    novos[jogadorAtual].parou = true;
    setDadosJogadores(novos);
    passar();
  };

  const dobrar = () => {
    sortearCarta();
    parar();
  };

  const passar = () => {
    let i = jogadorAtual + 1;
    while (i < 8 && (dadosJogadores[i].parou || dadosJogadores[i].estourado)) i++;
    if (i >= 8) {
      setJogoFinalizado(true);
      jogarDealer();
    } else {
      setJogadorAtual(i);
    }
  };

  const jogarDealer = () => {
    const cartas = [];
    while (calcularPontuacao(cartas) < 17) {
      cartas.push(deck.sortearCarta());
    }
    setDealer({ cartas });
  };

  const calcularPontuacao = (cartas) => {
    let total = 0;
    let ases = 0;
    for (let { valor } of cartas) {
      if (["J", "Q", "K"].includes(valor)) total += 10;
      else if (valor === "A") {
        total += 11;
        ases++;
      } else total += parseInt(valor);
    }
    while (total > 21 && ases > 0) {
      total -= 10;
      ases--;
    }
    return total;
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#000",
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
          zIndex: 5,
        }}
      >
        Dealer: {dealer.cartas.map((c) => `${c.valor}${c.naipe}`).join(" ") || "?"}
      </div>

      {jogoIniciado ? (
        posicoes.map((pos, i) => (
          <JogadorComVisual
            key={i}
            top={pos.top}
            left={pos.left}
            rotate={pos.rotate}
            dados={dadosJogadores[i]}
            isAtual={jogadorAtual === i && !jogoFinalizado}
            onSortear={sortearCarta}
            onParar={parar}
            onDobrar={dobrar}
          />
        ))
      ) : (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
          }}
        >
          <button
            onClick={() => setJogoIniciado(true)}
            style={{ padding: 12, fontSize: 18 }}
          >
            Iniciar Rodada
          </button>
        </div>
      )}
    </div>
  );
}
