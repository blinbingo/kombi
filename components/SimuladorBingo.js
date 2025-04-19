import React, { useState } from "react";
import useSorteio from "../hooks/useSorteio";
import PainelControle from "./PainelControle";
import CartelasPremiadas from "./CartelasPremiadas";
import RankingCartelas from "./RankingCartelas";
import { supabase } from "../utils/supabaseClient";

export default function SimuladorBingo({
  cartelas,
  tempoDelay,
  valorCartela,
  valorPremios,
  titulo
}) {
  const [premios, setPremios] = useState({ 25: [], 50: [], 75: [], 100: [] });
  const [etapasAlcancadas, setEtapasAlcancadas] = useState([]);
  const [bolasPremioDesbloqueadas, setBolasPremioDesbloqueadas] = useState({});
  const [resumoFinanceiro, setResumoFinanceiro] = useState(null);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const {
    bolasSelecionadas,
    setBolasSelecionadas,
    contador,
    setContador,
    sorteando,
    setSorteando,
    pausado,
    setPausado,
    jaParouNo100,
    numeros,
    iniciarSorteio,
    reiniciarTudo
  } = useSorteio(tempoDelay);

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
      salvarSorteio(novosPremios);
    }
  };

  const salvarSorteio = async (premiadasReais) => {
    const totalPremiosPagos = [25, 50, 75, 100].reduce(
      (acc, meta) => acc + (premiadasReais[meta]?.length || 0) * valorPremios[meta],
      0
    );

    const dados = {
      quantidadeCartelas: cartelas.length,
      valorCartela,
      premio25: valorPremios[25],
      premio50: valorPremios[50],
      premio75: valorPremios[75],
      premio100: valorPremios[100],
      totalArrecadado: cartelas.length * valorCartela,
      totalPremiosPagos,
      codigoSorteio: `BLIN-${new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14)}`
    };

    try {
      const { error } = await supabase.from("bingo").insert([dados]);
      if (error) {
        console.error("Erro ao salvar no Supabase:", error.message);
        setMensagem("❌ Erro ao salvar sorteio.");
      } else {
        setMensagem("✅ Sorteio salvo com sucesso!");
      }
    } catch (err) {
      console.error("Erro inesperado ao salvar sorteio:", err);
      setMensagem("❌ Erro inesperado ao salvar sorteio.");
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
    setBolasPremioDesbloqueadas(dis...
    setResumoFinanceiro({ totalArrecadado, totalPremiosPagos });
    jaParouNo100.current = true;
    setSorteando(false);
    setContador(null);
    setPausado(false);
    salvarSorteio(premiadas);
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

      {sorteando && contador !== null && (
        <p className="cronometro-digital">Próxima bola em: {contador}s</p>
      )}

      <h3>Histórico</h3>
      <div style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "6px",
        marginTop: "10px"
      }}>
        {bolasSelecionadas.map((bola, i) => (
          <div key={i} className="bola" style={{ width: "32px", height: "32px", fontSize: "0.85rem" }}>
            {bola}
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
        bolasSelecionadas={bolasSelecionadas}
        etapasAlcancadas={etapasAlcancadas}
      />

      {mensagem && (
        <div style={{
          marginTop: "20px",
          textAlign: "center",
          color: mensagem.includes("✅") ? "limegreen" : "red"
        }}>
          <strong>{mensagem}</strong>
        </div>
      )}
    </div>
  );
}
