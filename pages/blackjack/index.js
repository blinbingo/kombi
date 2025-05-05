
import React from 'react';

export default function Blackjack() {
  const jogadores = [
    'Jogador 1', 'Jogador 2', 'Jogador 3', 'Jogador 4', 'Jogador 5',
    'Jogador 6', 'Jogador 7'
  ];

  const posicoes = [
    { bottom: '-5px', left: '20%', transform: 'translateX(-50%) rotate(10deg)' },    // Jogador 1
    { top: '50%', left: '-60px', transform: 'translateY(-50%) rotate(90deg)' },      // Jogador 2
    { bottom: '-40px', left: '50%', transform: 'translateX(-50%)' },                 // Jogador 3
    { top: '50%', right: '-60px', transform: 'translateY(-50%) rotate(-90deg)' },    // Jogador 4
    { bottom: '-5px', left: '80%', transform: 'translateX(-50%) rotate(-10deg)' },   // Jogador 5

    { bottom: '20px', left: '7%', transform: 'translateX(-50%) rotate(45deg)' },     // Jogador 6 (entre 2 e 1)
    { bottom: '20px', left: '93%', transform: 'translateX(-50%) rotate(-45deg)' },   // Jogador 7 (entre 5 e 4)
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
          width: '1000px',
          height: '600px',
          backgroundColor: '#166534',
          borderRadius: '50% / 40%',
          boxShadow: '0 0 20px rgba(0,0,0,0.5)',
        }}
      >
        {/* Dealer centralizado no topo */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            color: '#facc15',
            fontWeight: 'bold',
            fontSize: '18px',
          }}
        >
          Dealer
        </div>

        {jogadores.map((nome, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              ...posicoes[index],
              color: '#bbf7d0',
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: '14px',
              width: '80px',
            }}
          >
            {nome}
          </div>
        ))}
      </div>
    </div>
  );
}
