export default function ControleJogador({ podeJogar, onSortear, onParar, onDobrar }) {
  return (
    <div style={{ marginTop: 10 }}>
      <button onClick={onSortear} disabled={!podeJogar} style={{ marginRight: 10 }}>
        Pedir Carta
      </button>
      <button onClick={onParar} disabled={!podeJogar} style={{ marginRight: 10 }}>
        Parar
      </button>
      <button onClick={onDobrar} disabled={!podeJogar}>
        Dobrar
      </button>
    </div>
  );
}
