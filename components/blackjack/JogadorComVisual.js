// components/blackjack/JogadorComVisual.js
import ControleJogador from './ControleJogador';

export default function JogadorComVisual({ top, left, rotate, dados, isAtual, onSortear, onParar, onDobrar, onSplit }) {
  const { nome, cartas, estourado, parou, maoExtra, jogandoMaoExtra } = dados;

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

  const podeSeparar = cartas.length === 2 && cartas[0].valor === cartas[1].valor;

  const renderMao = (mao, label, isAtiva) => {
    const pontuacao = calcularPontuacao(mao.cartas);

    return (
      <div
        style={{
          marginTop: 6,
          transform: `rotate(${-rotate}deg)`,
          textAlign: 'center',
          color: 'white',
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 12 }}>
          {mao.cartas.map((c, i) => (
            <span key={i}>{c.valor}{c.naipe} </span>
          ))}<br />
          Pontos: {pontuacao} {mao.estourado && '(Estourou!)'}
        </div>
        {isAtiva && !mao.parou && !mao.estourado && (
          <ControleJogador
            podeJogar={true}
            onSortear={onSortear}
            onParar={onParar}
            onDobrar={onDobrar}
            onSplit={podeSeparar ? onSplit : undefined}
            podeSeparar={podeSeparar}
          />
        )}
      </div>
    );
  };

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

      {maoExtra ? (
        <>
          {renderMao(dados, 'Mão 1', isAtual && !jogandoMaoExtra)}
          {renderMao(maoExtra, 'Mão 2', isAtual && jogandoMaoExtra)}
        </>
      ) : (
        renderMao(dados, '', isAtual)
      )}
    </div>
  );
}
