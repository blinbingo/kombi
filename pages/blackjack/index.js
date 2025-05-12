// pages/blackjack/index.js
import Image from "next/image";
import JogadorComVisual from "@/components/blackjack/JogadorComVisual";
import { useState } from "react";
import DeckManager from "@/components/blackjack/DeckManager";

export default function BlackjackPage() {
  const [dadosJogadores, setDadosJogadores] = useState(
    Array.from({ length: 8 }, (_, i) => ({
      nome: `Jogador ${i + 1}`,
      cartas: [],
      estourado: false,
      parou: false,
      maoExtra: null,
      jogandoMaoExtra: false,
    }))
  );
  const [jogadorAtual, setJogadorAtual] = useState(null);
  const [dealer, setDealer] = useState({ cartas: [] });
  const [jogoIniciado, setJogoIniciado] = useState(false);
  const [jogoFinalizado, setJogoFinalizado] = useState(false);
  const deck = new DeckManager();

const posicoes = [
    { top: "75%", left: "15%", rotate: 0 },
    { top: "75%", left: "25%", rotate: 0 },
    { top: "75%", left: "35%", rotate: 0 },
    { top: "75%", left: "45%", rotate: 0 },
    { top: "75%", left: "55%", rotate: 0 },
    { top: "75%", left: "65%", rotate: 0 },
    { top: "75%", left: "75%", rotate: 0 },
    { top: "75%", left: "85%", rotate: 0 },
  ];

  const iniciarJogo = () => {
    setJogoIniciado(true);
    distribuirCartasIniciais();
  };

  const distribuirCartasIniciais = async () => {
    const novos = [...dadosJogadores];
    for (let i = 7; i >= 0; i--) {
      await delay();
      novos[i].cartas.push(deck.sortearCarta());
      setDadosJogadores([...novos]);
    }
    await delay();
    setDealer({ cartas: [deck.sortearCarta()] });
    for (let i = 7; i >= 0; i--) {
      await delay();
      novos[i].cartas.push(deck.sortearCarta());
      setDadosJogadores([...novos]);
    }
    await delay();
    setDealer((d) => ({ cartas: [...d.cartas, deck.sortearCarta()] }));
    setJogadorAtual(7);
  };

  const delay = () => new Promise((res) => setTimeout(res, 200));

  const sortearCarta = () => {
    const novos = [...dadosJogadores];
    const atual = novos[jogadorAtual];
    const target = atual.jogandoMaoExtra ? atual.maoExtra : atual;
    target.cartas.push(deck.sortearCarta());

    const pontos = calcularPontuacao(target.cartas);
    target.estourado = pontos > 21;
    if (pontos >= 21) target.parou = true;

    setDadosJogadores(novos);
    if (target.parou || target.estourado) passar();
  };

  const parar = () => {
    const novos = [...dadosJogadores];
    const atual = novos[jogadorAtual];
    const target = atual.jogandoMaoExtra ? atual.maoExtra : atual;
    target.parou = true;
    setDadosJogadores(novos);
    passar();
  };

  const dobrar = () => {
    sortearCarta();
    parar();
  };

  const separar = () => {
    const novos = [...dadosJogadores];
    const atual = novos[jogadorAtual];
    const novaCarta1 = atual.cartas[0];
    const novaCarta2 = atual.cartas[1];
    atual.cartas = [novaCarta1];
    atual.maoExtra = {
      cartas: [novaCarta2],
      parou: false,
      estourado: false,
    };
    atual.jogandoMaoExtra = false;
    setDadosJogadores(novos);
    sortearCarta();
  };

  const passar = () => {
    const novos = [...dadosJogadores];
    const atual = novos[jogadorAtual];

    if (atual.maoExtra && !atual.jogandoMaoExtra) {
      atual.jogandoMaoExtra = true;
      setDadosJogadores(novos);
      sortearCarta();
      return;
    }

    let i = jogadorAtual - 1;
    while (i >= 0 && (novos[i].parou && !novos[i].maoExtra)) i--;
    if (i < 0) {
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
            onSplit={separar}
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
            onClick={iniciarJogo}
            style={{ padding: 12, fontSize: 18 }}
          >
            Iniciar Rodada
          </button>
        </div>
      )}
    </div>
  );
}
