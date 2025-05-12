// components/blackjack/ControleJogador.js
export default function ControleJogador({ podeJogar, onSortear, onParar, onDobrar, onSplit }) {
  return (
    <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
      <button
        onClick={onSortear}
        disabled={!podeJogar}
        style={{
          backgroundColor: '#6aff6a',
          borderRadius: 6,
          border: 'none',
          padding: '6px 10px',
          fontWeight: 'bold',
        }}
        title="Pedir Carta"
      >
        +
      </button>
      <button
        onClick={onParar}
        disabled={!podeJogar}
        style={{
          backgroundColor: '#ff6a6a',
          borderRadius: 6,
          border: 'none',
          padding: '6px 10px',
          fontWeight: 'bold',
        }}
        title="Parar"
      >
        −
      </button>
      <button
        onClick={onDobrar}
        disabled={!podeJogar}
        style={{
          backgroundColor: '#6aa8ff',
          borderRadius: 6,
          border: 'none',
          padding: '6px 10px',
          fontWeight: 'bold',
        }}
        title="Dobrar"
      >
        x2
      </button>
      <button
        onClick={onSplit}
        disabled={!podeJogar}
        style={{
          backgroundColor: '#ffb347',
          borderRadius: 6,
          border: 'none',
          padding: '6px 10px',
          fontWeight: 'bold',
        }}
        title="Separar"
      >
        ⇄
      </button>
    </div>
  );
}
