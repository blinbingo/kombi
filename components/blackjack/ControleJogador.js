import { Plus, Minus, MoveRight, Divide } from 'lucide-react';

export default function ControleJogador({ podeJogar, onSortear, onParar, onDobrar, onSplit }) {
  return (
    <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
      <button
        onClick={onSortear}
        disabled={!podeJogar}
        title="Pedir"
        style={{
          backgroundColor: '#6aff6a',
          borderRadius: 6,
          border: 'none',
          padding: 8,
        }}
      >
        <Plus size={16} />
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
        }}
      >
        <Minus size={16} />
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
        }}
      >
        <MoveRight size={16} />
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
        }}
      >
        <Divide size={16} />
      </button>
    </div>
  );
}
