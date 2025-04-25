
import React, { useState, useEffect, useRef } from "react";
import PainelControle from "./PainelControle";
import SimuladorBoard from "./SimuladorBoard";
import SimuladorPainelInferior from "./SimuladorPainelInferior";
import { supabase } from "../utils/supabaseClient";

export default function SimuladorBingo({
  cartelas,
  tempoDelay,
  valorCartela,
  valorPremios,
  titulo
}) {
  const [bolasSelecionadas, setBolasSelecionadas] = useState([]);
  const [contador, setContador] = useState(null);
  const [sorteando, setSorteando] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [premios, setPremios] = useState({ 25: [], 50: [], 75: [], 100: [] });
  const [etapasAlcancadas, setEtapasAlcancadas] = useState([]);
  const [bolasPremioDesbloqueadas, setBolasPremioDesbloqueadas] = useState({});
  const [resumoFinanceiro, setResumoFinanceiro] = useState(null);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const jaParouNo100 = useRef(false);
  const numeros = Array.from({ length: 60 }, (_, i) => i + 1);

  const sortearBola = () => {
    if (jaParouNo100.current) return;
    const disponiveis = numeros.filter(n => !bolasSelecionadas.includes(n));
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

    setPremios(novosPremios);
    setBolasPremioDesbloqueadas(novosDesbloqueios);
    setEtapasAlcancadas(novasEtapas);

    if (novasEtapas.includes(100) && !jaParouNo100.current) {
      const totalArrecadado = cartelas.length * valorCartela;
      const totalPremiosPagos = [25, 50, 75, 100].reduce(
        (acc, p) => acc + (novosPremios[p]?.length || 0) * valorPremios[p],
        0
      );
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

  const finalizarSorteio = () => {
    if (!sorteando || !pausado) return;
    let bolas = [...bolasSelecionadas];
    let etapas = [...etapasAlcancadas];
    let premiadas = { ...premios };
    let desbloqueios = { ...bolasPremioDesbloqueadas };
    while (!etapas.includes(100)) {
      const disponiveis = numeros.filter(n => !bolas.includes(n));
      if (disponiveis.length === 0) break;
      const nova = disponiveis[Math.floor(Math.random() * disponiveis.length)];
      bolas.push(nova);
      [25, 50, 75, 100].forEach(meta => {
        if (!etapas.includes(meta)) {
          const ganhadoras = [];
          cartelas.forEach((cartela, index) => {
            const acertos = cartela.filter(num => bolas.includes(num));
            const porcentagem = Math.floor((acertos.length / 24) * 100);
            if (porcentagem >= meta && cartela.includes(nova)) {
              ganhadoras.push("C" + String(index + 1).padStart(4, "0"));
            }
          });
          if (ganhadoras.length > 0) {
            premiadas[meta] = ganhadoras;
            desbloqueios[meta] = nova;
            etapas.push(meta);
          }
        }
      });
    }

    const totalArrecadado = cartelas.length * valorCartela;
    const totalPremiosPagos = [25, 50, 75, 100].reduce(
      (acc, p) => acc + (premiadas[p]?.length || 0) * valorPremios[p],
      0
    );
    setBolasSelecionadas(bolas);
    setPremios(premiadas);
    setBolasPremioDesbloqueadas(disbloqueios);
    setResumoFinanceiro({ totalArrecadado, totalPremiosPagos });
    jaParouNo100.current = true;
    setSorteando(false);
    setContador(null);
    setPausado(false);
  };

  const reiniciarTudo = () => {
    setBolasSelecionadas([]);
    setPremios({ 25: [], 50: [], 75: [], 100: [] });
    setEtapasAlcancadas([]);
    setBolasPremioDesbloqueadas({});
    setResumoFinanceiro(null);
    setSorteando(false);
    setContador(null);
    setPausado(false);
    setMostrarConfirmacao(false);
    jaParouNo100.current = false;
    setMensagem("");
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
        confirmarReinicio={mostrarConfirmacao}
        setConfirmarReinicio={setMostrarConfirmacao}
        onConfirmarReinicio={reiniciarTudo}
        finalizarSorteio={finalizarSorteio}
      />

      <SimuladorPainelInferior
        premios={premios}
        bolasPremioDesbloqueadas={bolasPremioDesbloqueadas}
        resumoFinanceiro={resumoFinanceiro}
        cartelas={cartelas}
        bolasSelecionadas={bolasSelecionadas}
        etapasAlcancadas={etapasAlcancadas}
        mensagem={mensagem}
      />
    </div>
  );
}
