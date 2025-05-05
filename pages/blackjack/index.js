
import React from 'react';

export default function Blackjack() {
  const jogadores = [
    'Jogador 1', 'Jogador 2', 'Jogador 3', 'Jogador 4', 'Jogador 5',
    'Jogador 6', 'Jogador 7', 'Jogador 8', 'Jogador 9', 'Jogador 10'
  ];

  const posicoes = [
    { bottom: '-5px', left: '10%', transform: 'translateX(-50%) rotate(12deg)' },
    { bottom: '-10px', left: '22%', transform: 'translateX(-50%) rotate(6deg)' },
    { bottom: '-40px', left: '35%', transform: 'translateX(-50%)' },
    { bottom: '-10px', left: '48%', transform: 'translateX(-50%) rotate(-6deg)' },
    { bottom: '-5px', left: '60%', transform: 'translateX(-50%) rotate(-12deg)' },

    { top: '-5px', left: '60%', transform: 'translateX(-50%) rotate(12deg)' },
    { top: '-10px', left: '48%', transform: 'translateX(-50%) rotate(6deg)' },
    { top: '-40px', left: '35%', transform: 'translateX(-50%)' },
    { top: '-10px', left: '22%', transform: 'translateX(-50%) rotate(-6deg)' },
    { top: '-5px', left: '10%', transform: 'translateX(-50%) rotate(-12deg)' }
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
          width: '1100px',
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
            }}
          >
            {nome}
          </div>
        ))}
      </div>
    </div>
  );
}
