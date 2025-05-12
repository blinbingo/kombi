// components/blackjack/ControleJogador.js
export default function ControleJogador({ podeJogar, onSortear, onParar, onDobrar, onSplit }) {
  return (
    <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
      <button
        onClick={onSortear}
        disabled={!podeJogar}
        title="Pedir"
        style={{
          backgroundColor: '#ff00ff',
          borderRadius: 0,
          border: '4px solid yellow',
          padding: '20px',
          fontWeight: 'bold',
          fontSize: 24,
        }}
      >
        TESTE
      </button>
      <button
        onClick={onParar}
        disabled={!podeJogar}
        title="Parar"
        style={{
          backgroundColor: '#ff6a6a',
          borderRadius: 6,
          border: 'none',
          padding: 8,
          fontWeight: 'bold',
        }}
      >
        −
      </button>
      <button
        onClick={onDobrar}
        disabled={!podeJogar}
        title="Dobrar"
        style={{
          backgroundColor: '#6aa8ff',
          borderRadius: 6,
          border: 'none',
          padding: 8,
          fontWeight: 'bold',
        }}
      >
        x2
      </button>
      <button
        onClick={onSplit}
        disabled={!podeJogar}
        title="Separar"
        style={{
          backgroundColor: '#ffb347',
          borderRadius: 6,
          border: 'none',
          padding: 8,
          fontWeight: 'bold',
        }}
      >
        ⇄
      </button>
    </div>
  );
}
