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
    const atual = novos[jogador
