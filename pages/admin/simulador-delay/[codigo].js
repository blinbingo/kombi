
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../../utils/supabaseClient";
import CartelasPremiadas from "../../../components/CartelasPremiadas";
import RankingCartelas from "../../../components/RankingCartelas";

export default function SimuladorDelay({ cartelas, tempoDelay }) {
  const [bolasSelecionadas, setBolasSelecionadas] = useState([]);
  const [contador, setContador] = useState(null);
  const [sorteando, setSorteando] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [premios, setPremios] = useState({ 25: [], 50: [], 75: [], 100: [] });
  const [etapasAlcancadas, setEtapasAlcancadas] = useState([]);
  const [bolasPremioDesbloqueadas, setBolasPremioDesbloqueadas] = useState({});
  const [resumoFinanceiro, setResumoFinanceiro] = useState(null);
  const jaParouNo100 = useRef(false);
  const numeros = Array.from({ length: 60 }, (_, i) => i + 1);

  const sortearBola = () => {
    if (jaParouNo100.current) return;
    const disponiveis = numeros.filter((n) => !bolasSelecionadas.includes(n));
    if (disponiveis.length === 0) return;
    const nova = disponiveis[Math.floor(Math.random() * disponiveis.length)];
    const novas = [...bolasSelecionadas, nova];
    setBolasSelecionadas(novas);
    atualizarPremios(novas);
  };

  const atualizarPremios = (bolas) => {
    const metas = [25, 50, 75, 100];
    const novaBola = bolas[bolas.length - 1];
    const novasEtapas = [...etapasAlcancadas];
    const novosPremios = { ...premios };
    const novosDesbloqueios = { ...bolasPremioDesbloqueadas };

    metas.forEach((meta) => {
      if (!novasEtapas.includes(meta)) {
        const ganhadoras = [];
        if (Array.isArray(cartelas)) {
          cartelas.forEach((cartela, index) => {
            const acertos = cartela.filter((num) => bolas.includes(num));
            const porcentagem = Math.floor((acertos.length / 24) * 100);
            if (porcentagem >= meta && cartela.includes(novaBola)) {
              ganhadoras.push("C" + String(index + 1).padStart(4, "0"));
            }
          });
        }
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

    if (novasEtapas.includes(100) && !jaParouNo100.current) {
      const totalArrecadado = cartelas.length * 10;
      const totalPremiosPagos =
        (novosPremios[25]?.length || 0) * 10 +
        (novosPremios[50]?.length || 0) * 20 +
        (novosPremios[75]?.length || 0) * 200 +
        (novosPremios[100]?.length || 0) * 500;
      setResumoFinanceiro({ totalArrecadado, totalPremiosPagos });
      jaParouNo100.current = true;
      setSorteando(false);
      setContador(null);
    }
  };

  useEffect(() => {
    let timer;
    if (sorteando && contador !== null && !pausado && !jaParouNo100.current) {
      if (contador > 0) {
        timer = setTimeout(() => setContador((prev) => prev - 1), 1000);
      } else {
        sortearBola();
        if (!jaParouNo100.current) {
          setContador(tempoDelay);
        }
      }
    }
    return () => clearTimeout(timer);
  }, [contador, sorteando, pausado]);

  const iniciarSorteio = () => {
    if (!sorteando) {
      setSorteando(true);
      setContador(tempoDelay);
    }
  };

  return (
    <div className="body" style={{ textAlign: "center" }}>
      <div className="bingo-board">
        {numeros.map((num) => (
          <div key={num} className={`bola ${bolasSelecionadas.includes(num) ? "selecionada" : ""}`}>
            {num}
          </div>
        ))}
      </div>

      <p className="cronometro-digital">Próxima bola em: {contador}s</p>

      <CartelasPremiadas
        premios={premios}
        bolasPremioDesbloqueadas={bolasPremioDesbloqueadas}
        resumoFinanceiro={resumoFinanceiro}
      />

      <RankingCartelas
        cartelas={cartelas}
        bolasSelecionadas={bolasSelecionadas}
        etapasAlcancadas={etapasAlcancadas}
      />
    </div>
  );
}
