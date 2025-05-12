// components/blackjack/ControleJogador.js
export default function ControleJogador({ podeJogar, onSortear, onParar, onDobrar, onSplit }) {
  return (
    <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
      <button
        onClick={onSortear}
        disabled={!podeJogar}
        title="Pedir"
        style={{
          backgroundColor: '#6aff6a',
          borderRadius: 6,
          border: 'none',
          padding: '4px 8px',
          fontWeight: 'bold',
          fontSize: 16,
        }}
      >
        +
      </button>
      <button
        onClick={onParar}
        disabled={!podeJogar}
        title="Parar"
        style={{
          backgroundColor: '#ff6a6a',
          borderRadius: 6,
          border: 'none',
          padding: '4px 8px',
          fontWeight: 'bold',
          fontSize: 16,
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
          padding: '4px 8px',
          fontWeight: 'bold',
          fontSize: 16,
        }}
      >
        x2
      </button>
      {onSplit && (
        <button
          onClick={onSplit}
          disabled={!podeJogar}
          title="Separar"
          style={{
            backgroundColor: '#ffb347',
            borderRadius: 6,
            border: 'none',
            padding: '4px 8px',
            fontWeight: 'bold',
            fontSize: 16,
          }}
        >
          ⇄
        </button>
      )}
    </div>
  );
}
