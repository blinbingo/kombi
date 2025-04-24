
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../../utils/supabaseClient";
import CartelasPremiadas from "../../../components/CartelasPremiadas";
import RankingCartelas from "../../../components/RankingCartelas";

export default function SimuladorDelay() {
  const router = useRouter();
  const { codigo } = router.query;

  const [cartelas, setCartelas] = useState([]);
  const [bolasSorteadas, setBolasSorteadas] = useState([]);
  const [etapasAlcancadas, setEtapasAlcancadas] = useState([]);
  const [premios, setPremios] = useState({ 25: [], 50: [], 75: [], 100: [] });
  const [bolasPremioDesbloqueadas, setBolasPremioDesbloqueadas] = useState({});
  const [resumoFinanceiro, setResumoFinanceiro] = useState(null);
  const [delay, setDelay] = useState(5);
  const [emAndamento, setEmAndamento] = useState(false);
  const [indexAtual, setIndexAtual] = useState(0);

  const intervaloRef = useRef(null);

  const numeros = useRef(Array.from({ length: 60 }, (_, i) => i + 1)).current;

  useEffect(() => {
    if (!codigo) return;
    async function carregarCartelas() {
      const { data, error } = await supabase
        .from("cartelas")
        .select("numeros")
        .eq("codigoSorteio", codigo);

      if (!error && data) {
        const lista = data.map((item) => item.numeros);
        setCartelas(lista);
      }
    }
    carregarCartelas();
  }, [codigo]);

  const iniciarSorteio = () => {
    if (emAndamento) return;

    const sequencia = embaralhar([...numeros]);
    setBolasSorteadas([]);
    setIndexAtual(0);
    setEtapasAlcancadas([]);
    setPremios({ 25: [], 50: [], 75: [], 100: [] });
    setBolasPremioDesbloqueadas({});
    setResumoFinanceiro(null);
    setEmAndamento(true);

    intervaloRef.current = setInterval(() => {
      setIndexAtual((prev) => {
        const proximo = prev + 1;
        const novas = sequencia.slice(0, proximo);
        setBolasSorteadas(novas);
        verificarPremios(novas);

        if (etapasAlcancadas.includes(100)) {
          clearInterval(intervaloRef.current);
          setEmAndamento(false);
        }

        return proximo;
      });
    }, delay * 1000);
  };

  const embaralhar = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const verificarPremios = (bolas) => {
    const metas = [25, 50, 75, 100];
    const novaBola = bolas[bolas.length - 1];
    const novasEtapas = [...etapasAlcancadas];
    const novosPremios = { ...premios };
    const novosDesbloqueios = { ...bolasPremioDesbloqueadas };

    metas.forEach((meta) => {
      if (!novasEtapas.includes(meta)) {
        const ganhadoras = [];
        cartelas.forEach((cartela, index) => {
          const acertos = cartela.filter((n) => bolas.includes(n));
          const porcentagem = Math.floor((acertos.length / 24) * 100);
          if (porcentagem >= meta && cartela.includes(novaBola)) {
            ganhadoras.push("C" + String(index + 1).padStart(4, "0"));
          }
        });
        if (ganhadoras.length > 0) {
          novosPremios[meta] = ganhadoras;
          novosDesbloqueios[meta] = novaBola;
          novasEtapas.push(meta);
        }
      }
    });

    setPremios(novosPremios);
    setBolasPremioDesbloqueadas(novosDesbloqueios);
    setEtapasAlcancadas(novasEtapas);

    if (novasEtapas.includes(100)) {
      const totalArrecadado = cartelas.length * 10;
      const totalPremiosPagos =
        (novosPremios[25]?.length || 0) * 10 +
        (novosPremios[50]?.length || 0) * 20 +
        (novosPremios[75]?.length || 0) * 200 +
        (novosPremios[100]?.length || 0) * 500;
      setResumoFinanceiro({ totalArrecadado, totalPremiosPagos });
    }
  };

  const reiniciarSorteio = () => {
    clearInterval(intervaloRef.current);
    setBolasSorteadas([]);
    setEtapasAlcancadas([]);
    setPremios({ 25: [], 50: [], 75: [], 100: [] });
    setBolasPremioDesbloqueadas({});
    setResumoFinanceiro(null);
    setEmAndamento(false);
    setIndexAtual(0);
  };

  return (
    <div className="body" style={{ textAlign: "center" }}>
      <div className="card">
        <h2>Sorteio com Delay</h2>
        <label>Delay entre bolas (segundos):</label>
        <input
          type="number"
          min="1"
          value={delay}
          onChange={(e) => setDelay(Math.max(1, parseInt(e.target.value) || 1))}
        />
        <br />
        <button className="generate-button" onClick={iniciarSorteio} disabled={emAndamento}>
          ▶️ Iniciar Sorteio
        </button>
        <button onClick={reiniciarSorteio} disabled={emAndamento} style={{ marginLeft: 10 }}>
          🔁 Reiniciar
        </button>
      </div>

      <div className="bingo-board">
        {numeros.map((num) => (
          <div key={num} className={`bola ${bolasSorteadas.includes(num) ? "selecionada" : ""}`}>
            {num}
          </div>
        ))}
      </div>

      <CartelasPremiadas
        premios={premios}
        bolasPremioDesbloqueadas={bolasPremioDesbloqueadas}
        resumoFinanceiro={resumoFinanceiro}
      />
      <RankingCartelas
        cartelas={cartelas}
        bolasSelecionadas={bolasSorteadas}
        etapasAlcancadas={etapasAlcancadas}
      />
    </div>
  );
}
