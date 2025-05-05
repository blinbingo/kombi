
import React, { useEffect, useState } from 'react';

const cartas = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const naipes = ['♠', '♥', '♦', '♣'];

const embaralharBaralho = () => {
  const baralho = [];
  for (let i = 0; i < 6; i++) {
    for (const carta of cartas) {
      for (const naipe of naipes) {
        baralho.push({ valor: carta, naipe });
      }
    }
  }
  return baralho.sort(() => Math.random() - 0.5);
};

const calcularValor = (mao) => {
  let total = 0;
  let ases = 0;
  for (const carta of mao) {
    if (['J', 'Q', 'K'].includes(carta.valor)) {
      total += 10;
    } else if (carta.valor === 'A') {
      total += 11;
      ases += 1;
    } else {
      total += parseInt(carta.valor);
    }
  }
  while (total > 21 && ases > 0) {
    total -= 10;
    ases -= 1;
  }
  return total;
};

export default function Blackjack() {
  const [baralho, setBaralho] = useState([]);
  const [jogadores, setJogadores] = useState([]);
  const [dealer, setDealer] = useState([]);
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    iniciarJogo();
  }, []);

  const iniciarJogo = () => {
    const novoBaralho = embaralharBaralho();
    const novaMaoJogadores = [];
    for (let i = 0; i < 5; i++) {
      novaMaoJogadores.push([novoBaralho.pop(), novoBaralho.pop()]);
    }
    const novaMaoDealer = [novoBaralho.pop(), novoBaralho.pop()];
    const novosResultados = [];

    novaMaoJogadores.forEach((mao, index) => {
      while (calcularValor(mao) < 17) {
        mao.push(novoBaralho.pop());
      }
      novosResultados.push({ jogador: index + 1, mao });
    });

    while (calcularValor(novaMaoDealer) < 17) {
      novaMaoDealer.push(novoBaralho.pop());
    }

    setBaralho(novoBaralho);
    setJogadores(novaMaoJogadores);
    setDealer(novaMaoDealer);
    setResultados(novosResultados);
  };

  const renderMao = (mao) =>
    mao.map((carta, i) => (
      <span key={i}>
        {carta.naipe} {carta.valor}{' '}
      </span>
    ));

  return (
    <div style={{ padding: 20 }}>
      <h1>Blackjack - Mesa Automática</h1>
      <h2>Dealer: {calcularValor(dealer)} pontos</h2>
      <div>{renderMao(dealer)}</div>
      <hr />
      {jogadores.map((mao, index) => (
        <div key={index} style={{ marginBottom: 10 }}>
          <strong>Jogador {index + 1}:</strong> {calcularValor(mao)} pontos
          <div>{renderMao(mao)}</div>
        </div>
      ))}
    </div>
  );
}
