
import React from 'react';

export default function Blackjack() {
  const jogadores = ['Jogador 1', 'Jogador 2', 'Jogador 3', 'Jogador 4', 'Jogador 5'];

  const posicoes = [
    { bottom: '-40px', left: '15%', transform: 'translateX(-50%)' },
    { top: '50%', left: '-60px', transform: 'translateY(-50%) rotate(-90deg)' },
    { bottom: '-40px', left: '50%', transform: 'translateX(-50%)' },
    { top: '50%', right: '-60px', transform: 'translateY(-50%) rotate(90deg)' },
    { bottom: '-40px', left: '85%', transform: 'translateX(-50%)' },
  ];

  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: '#064e3b',
        minHeight: '100vh',
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
        }}
      >
        {jogadores.map((nome, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              ...posicoes[index],
              color: '#bbf7d0',
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: '16px',
            }}
          >
            {nome}
          </div>
        ))}
      </div>
    </div>
  );
}
