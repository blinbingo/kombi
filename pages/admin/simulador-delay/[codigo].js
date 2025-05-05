import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../../utils/supabaseClient";
import CartelasPremiadas from "../../../components/CartelasPremiadas";
import RankingCartelas from "../../../components/RankingCartelas";

export default function SimuladorDelay() {
  const router = useRouter();
  const { codigo } = router.query;

  const [cartelas, setCartelas] = useState([]);
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

  useEffect(() => {
    let timer;
    if (sorteando && contador !== null && !pausado && !jaParouNo100.current) {
      if (contador > 0) {
        timer = setTimeout(() => setContador((prev) => prev - 1), 1000);
      } else {
        sortearBola();
        if (!jaParouNo100.current) setContador(tempoDelay);
      }
    }
    return () => clearTimeout(timer);
  }, [contador, sorteando, pausado]);

  const tempoDelay = 2; // Valor fixo ou substituir com delay do modal futuramente

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

  const iniciarSorteio = () => {
    if (!sorteando) {
      setSorteando(true);
      setContador(tempoDelay);
    }
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
    jaParouNo100.current = false;
  };

  return (
    <div className="body" style={{ textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <button onClick={() => router.push("/admin")} style={{
          border: "2px solid #00ff00", color: "#00ff00",
          background: "transparent", padding: "8px 16px",
          borderRadius: "6px", cursor: "pointer", fontWeight: "bold"
        }}>
          ← Voltar
        </button>
        <button onClick={reiniciarTudo} style={{
          border: "2px solid #00ff00", color: "#00ff00",
          background: "transparent", padding: "8px 16px",
          borderRadius: "6px", cursor: "pointer", fontWeight: "bold"
        }}>
          🔁 Reiniciar
        </button>
      </div>

      <div className="bingo-board">
        {numeros.map((num) => (
          <div key={num} className={`bola ${bolasSelecionadas.includes(num) ? "selecionada" : ""}`}>
            {num}
          </div>
        ))}
      </div>

      <div style={{
        display: "flex", justifyContent: "center",
        flexWrap: "wrap", gap: "6px", marginTop: "20px"
      }}>
        {bolasSelecionadas.map((bola, i) => (
          <div key={i} className="bola" style={{
            width: "32px", height: "32px", fontSize: "0.85rem"
          }}>
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
    </div>
  );
}
