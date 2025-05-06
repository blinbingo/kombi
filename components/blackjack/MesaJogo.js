import { useEffect, useState } from "react";
import DeckManager from "@/components/blackjack/DeckManager";

const deck = new DeckManager();

const jogadoresIniciais = Array.from({ length: 8 }, (_, i) => ({
  nome: `Jogador ${i + 1}`,
  cartas: [],
  parou: false,
  estourado: false,
}));

export default function MesaJogo() {
  const [jogadores, setJogadores] = useState(jogadoresIniciais);
  const [dealer, setDealer] = useState({ cartas: [] });
  const [jogadorAtual, setJogadorAtual] = useState(0);
  const [jogoFinalizado, setJogoFinalizado] = useState(false);

  const sortearCarta = () => {
    const novaCarta = deck.sortearCarta();
    const atual = jogadores[jogadorAtual];
    const novaMao = [...atual.cartas, novaCarta];

    const novaPontuacao = calcularPontuacao(novaMao);
    const estourado = novaPontuacao > 21;
    const fez21 = novaPontuacao === 21;

    const atualAtualizado = {
      ...atual,
      cartas: novaMao,
      estourado,
      parou: fez21 || estourado,
    };

    const novosJogadores = [...jogadores];
    novosJogadores[jogadorAtual] = atualAtualizado;
    setJogadores(novosJogadores);

    if (atualAtualizado.parou) {
      passarParaProximo();
    }
  };

  const passarParaProximo = () => {
    let proximo = jogadorAtual + 1;
    while (proximo < jogadores.length && jogadores[proximo].parou) {
      proximo++;
    }
    if (proximo >= jogadores.length) {
      setJogoFinalizado(true);
      jogarDealer();
    } else {
      setJogadorAtual(proximo);
    }
  };

  const jogarDealer = () => {
    let cartas = [];
    while (calcularPontuacao(cartas) < 17) {
      cartas.push(deck.sortearCarta());
    }
    setDealer({ cartas });
  };

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

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h2>Dealer: {dealer.cartas.map((c) => `${c.valor}${c.naipe}`).join(" ")}</h2>

      {jogadores.map((j, index) => (
        <div
          key={index}
          style={{
            margin: "10px auto",
            padding: 10,
            background: jogadorAtual === index ? "#d4f1ff" : "#f0f0f0",
            borderRadius: 8,
            width: 300,
          }}
        >
          <strong>{j.nome}</strong>
          <div>Cartas: {j.cartas.map((c) => `${c.valor}${c.naipe}`).join(" ")}</div>
          <div>
            Pontuação: {calcularPontuacao(j.cartas)} {j.estourado && "(Estourou!)"}
          </div>
        </div>
      ))}

      {!jogoFinalizado && (
        <button onClick={sortearCarta} style={{ marginTop: 20, padding: 10 }}>
          Sortear
        </button>
      )}
    </div>
  );
}
