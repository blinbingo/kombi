
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
          padding: '6px 10px',
          borderRadius: '6px',
          backgroundColor: '#fff',
          color: '#000',
          fontWeight: 'bold',
          fontSize: '14px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        }}
      >
        {carta.naipe} {carta.valor}
      </span>
    ));

  const posicoes = [
    { bottom: '30px', left: '8%', transform: 'translateX(-50%) rotate(15deg)' },
    { bottom: '70px', left: '26%', transform: 'translateX(-50%) rotate(7deg)' },
    { bottom: '100px', left: '50%', transform: 'translateX(-50%) rotate(0deg)' },
    { bottom: '70px', left: '74%', transform: 'translateX(-50%) rotate(-7deg)' },
    { bottom: '30px', left: '92%', transform: 'translateX(-50%) rotate(-15deg)' },
  ];

  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: '#064e3b',
        minHeight: '100vh',
        padding: '0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '900px',
          height: '550px',
          backgroundColor: '#166534',
          borderRadius: '50% / 40%',
          boxShadow: '0 0 20px rgba(0,0,0,0.5)',
          paddingTop: '60px',
        }}
      >
        {/* Dealer */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            color: '#facc15',
          }}
        >
          <strong>Dealer</strong>
          <div>{renderMao(dealer)}</div>
          <div>{calcularValor(dealer)} pts</div>
        </div>

        {/* Jogadores com espaçamento maior e rotação curva mais realista */}
        {jogadores.map((mao, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              ...posicoes[index],
              color: '#bbf7d0',
              textAlign: 'center',
            }}
          >
            <div>
              <strong>Jogador {index + 1}</strong>
            </div>
            <div>{renderMao(mao)}</div>
            <div>{calcularValor(mao)} pts</div>
          </div>
        ))}
      </div>
    </div>
  );
}
