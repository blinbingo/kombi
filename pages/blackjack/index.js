
import React from 'react';

export default function Blackjack() {
  const jogadores = [
    'Jogador 1', 'Jogador 2', 'Jogador 3', 'Jogador 4', 'Jogador 5',
    'Jogador 6', 'Jogador 7', 'Jogador 8', 'Jogador 9', 'Jogador 10'
  ];

  const posicoes = [
    { bottom: '-5px', left: '20%', transform: 'translateX(-50%) rotate(10deg)' },     // Jogador 1
    { bottom: '-20px', left: '40%', transform: 'translateX(-50%)' },                  // Jogador 2
    { bottom: '-5px', left: '60%', transform: 'translateX(-50%) rotate(-10deg)' },    // Jogador 3
    { bottom: '40%', right: '-55px', transform: 'translateY(50%) rotate(-90deg)' },   // Jogador 4
    { top: '40%', right: '-55px', transform: 'translateY(-50%) rotate(-90deg)' },     // Jogador 5
    { top: '-5px', left: '60%', transform: 'translateX(-50%) rotate(10deg)' },        // Jogador 6
    { top: '-20px', left: '40%', transform: 'translateX(-50%)' },                     // Jogador 7
    { top: '-5px', left: '20%', transform: 'translateX(-50%) rotate(-10deg)' },       // Jogador 8
    { top: '40%', left: '-55px', transform: 'translateY(-50%) rotate(90deg)' },       // Jogador 9
    { bottom: '40%', left: '-55px', transform: 'translateY(50%) rotate(90deg)' },     // Jogador 10
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
