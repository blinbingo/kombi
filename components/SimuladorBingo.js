
// SimuladorBingo.js corrigido para retornar etapasAlcancadas para a página pai

import React, { useState, useEffect, useRef } from "react";
import PainelControle from "./PainelControle";
import SimuladorBoard from "./SimuladorBoard";
import SimuladorPainelInferior from "./SimuladorPainelInferior";

export default function SimuladorBingo({
  cartelas,
  tempoDelay,
  valorCartela,
  valorPremios,
  titulo,
  setPremios,
  setResumoFinanceiro,
  setBolasSelecionadas,
  setEtapasAlcancadas
}) {
  const [bolasSelecionadas, localSetBolasSelecionadas] = useState([]);
  const [contador, setContador] = useState(null);
  const [sorteando, setSorteando] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [premiosInterno, setPremiosInterno] = useState({ 25: [], 50: [], 75: [], 100: [] });
  const [etapas, setEtapas] = useState([]);
  const [bolasPremioDesbloqueadas, setBolasPremioDesbloqueadas] = useState({});
  const [resumo, setResumo] = useState(null);
  const jaParouNo100 = useRef(false);
  const numeros = Array.from({ length: 60 }, (_, i) => i + 1);

  const sortearBola = () => {
    if (jaParouNo100.current) return;
    const disponiveis = numeros.filter(n => !bolasSelecionadas.includes(n));
    if (disponiveis.length === 0) return;
    const nova = disponiveis[Math.floor(Math.random() * disponiveis.length)];
    const novas = [...bolasSelecionadas, nova];
    localSetBolasSelecionadas(novas);
    setBolasSelecionadas(novas);
    atualizarPremios(novas);
  };

  const atualizarPremios = (bolas) => {
    const metas = [25, 50, 75, 100];
    const novaBola = bolas[bolas.length - 1];
    const novasEtapas = [...etapas];
    const novosPremios = { ...premiosInterno };
    const novosDesbloqueios = { ...bolasPremioDesbloqueadas };

    metas.forEach((meta) => {
      if (!novasEtapas.includes(meta)) {
        const ganhadoras = [];
        cartelas.forEach((cartela, index) => {
          const acertos = cartela.filter((num) => bolas.includes(num));
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

    setPremiosInterno(novosPremios);
    setPremios(novosPremios);
    setBolasPremioDesbloqueadas(novosDesbloqueios);
    setEtapas(novasEtapas);
    setEtapasAlcancadas(novasEtapas); // <-- ESSENCIAL PRA MOSTRAR O BOTÃO

    if (novasEtapas.includes(100)) {
      const totalArrecadado = cartelas.length * valorCartela;
      const totalPremiosPagos = [25, 50, 75, 100].reduce(
        (acc, p) => acc + (novosPremios[p]?.length || 0) * valorPremios[p],
        0
      );
      const resumoFinal = { totalArrecadado, totalPremiosPagos };
      setResumo(resumoFinal);
      setResumoFinanceiro(resumoFinal);
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
      <SimuladorBoard
        bolasSelecionadas={bolasSelecionadas}
        numeros={numeros}
        contador={contador}
        sorteando={sorteando}
      />

      <PainelControle
        sorteando={sorteando}
        pausado={pausado}
        sortearBola={sortearBola}
        iniciarSorteio={iniciarSorteio}
        setPausado={setPausado}
        confirmarReinicio={false}
        setConfirmarReinicio={() => {}}
        onConfirmarReinicio={() => {}}
        finalizarSorteio={() => {}}
      />

      <SimuladorPainelInferior
        premios={premiosInterno}
        bolasPremioDesbloqueadas={bolasPremioDesbloqueadas}
        resumoFinanceiro={resumo}
        cartelas={cartelas}
        bolasSelecionadas={bolasSelecionadas}
        etapasAlcancadas={etapas}
        mensagem=""
      />
    </div>
  );
}
