
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

    novaMaoJogadores.forEach((mao) => {
      while (calcularValor(mao) < 17) {
        mao.push(novoBaralho.pop());
      }
    });

    while (calcularValor(novaMaoDealer) < 17) {
      novaMaoDealer.push(novoBaralho.pop());
    }

    setBaralho(novoBaralho);
    setJogadores(novaMaoJogadores);
    setDealer(novaMaoDealer);
  };

  const renderMao = (mao) =>
    mao.map((carta, i) => (
      <span
        key={i}
        style={{
          display: 'inline-block',
          margin: '4px',
          padding: '8px 12px',
          borderRadius: '6px',
          backgroundColor: '#fff',
          color: '#000',
          fontWeight: 'bold',
          fontSize: '16px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        }}
      >
        {carta.naipe} {carta.valor}
      </span>
    ));

  return (
    <div
      style={{
        backgroundColor: '#14532d',
        minHeight: '100vh',
        padding: '40px',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '20px' }}>🃏 Mesa de Blackjack</h1>

      <div
        style={{
          backgroundColor: '#166534',
          padding: '20px',
          borderRadius: '12px',
          maxWidth: '800px',
          margin: '0 auto 40px auto',
          boxShadow: '0 0 12px rgba(0,0,0,0.5)',
        }}
      >
        <h2 style={{ textAlign: 'center', color: '#facc15' }}>Dealer: {calcularValor(dealer)} pontos</h2>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>{renderMao(dealer)}</div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        {jogadores.map((mao, index) => (
          <div
            key={index}
            style={{
              backgroundColor: '#15803d',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 0 8px rgba(0,0,0,0.4)',
            }}
          >
            <h3 style={{ color: '#bbf7d0' }}>Jogador {index + 1} - {calcularValor(mao)} pontos</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>{renderMao(mao)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
