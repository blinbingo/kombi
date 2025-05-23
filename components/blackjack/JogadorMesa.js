// components/blackjack/JogadorComVisual.js
export default function JogadorComVisual({ top, left, rotate, dados, isAtual, onSortear, onParar, onDobrar, onSplit }) {
  const { nome, cartas, estourado, parou } = dados;

  const calcularPontuacao = (cartas) => {
    let total = 0;
    let ases = 0;
    for (let { valor } of cartas) {
      if (["J", "Q", "K"].includes(valor)) total += 10;
      else if (valor === "A") {
        total += 11;
        ases++;
      } else total += parseInt(valor);
    }
    while (total > 21 && ases > 0) {
      total -= 10;
      ases--;
    }
    return total;
  };

  const pontuacao = calcularPontuacao(cartas);

  const podeSeparar =
    cartas.length === 2 && cartas[0].valor === cartas[1].valor;

  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 5,
      }}
    >
      <div
        style={{
          transform: `rotate(${-rotate}deg)`,
          backgroundColor: 'white',
          padding: '4px 8px',
          borderRadius: 8,
          fontWeight: 'bold',
          color: 'black',
          minWidth: 80,
          textAlign: 'center',
        }}
      >
        {nome}
      </div>

      <div
        style={{
          marginTop: 4,
          transform: `rotate(${-rotate}deg)`,
          color: 'white',
          fontSize: 12,
          textAlign: 'center',
        }}
      >
        {cartas.map((c, i) => (
          <span key={i}>{c.valor}{c.naipe} </span>
        ))}<br />
        {pontuacao > 0 && `Pontos: ${pontuacao}`} {estourado && '(Estourou!)'}
      </div>

      {isAtual && !parou && !estourado && (
        <div
          style={{
            marginTop: 6,
            display: 'flex',
            gap: 6,
            transform: `rotate(${-rotate}deg)`
          }}
        >
          <button
            onClick={onSortear}
            style={{ backgroundColor: '#6aff6a', borderRadius: 6, border: 'none', padding: '6px 10px', fontWeight: 'bold' }}
          >
            +
          </button>
          <button
            onClick={onParar}
            style={{ backgroundColor: '#ff6a6a', borderRadius: 6, border: 'none', padding: '6px 10px', fontWeight: 'bold' }}
          >
            −
          </button>
          <button
            onClick={onDobrar}
            style={{ backgroundColor: '#6aa8ff', borderRadius: 6, border: 'none', padding: '6px 10px', fontWeight: 'bold' }}
          >
            x2
          </button>
          {podeSeparar && (
            <button
              onClick={onSplit}
              style={{ backgroundColor: '#ffb347', borderRadius: 6, border: 'none', padding: '6px 10px', fontWeight: 'bold' }}
            >
              ⇄
            </button>
          )}
        </div>
      )}
    </div>
  );
}
