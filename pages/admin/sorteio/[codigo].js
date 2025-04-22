
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../../utils/supabaseClient";
import PainelControle2 from "../../../components/PainelControle2";
import HistoricoBolas from "../../../components/HistoricoBolas";
import CartelasPremiadas from "../../../components/CartelasPremiadas";
import RankingCartelas from "../../../components/RankingCartelas";

export default function SorteioManual() {
  const router = useRouter();
  const { codigo } = router.query;

  const [cartelas, setCartelas] = useState([]);
  const [bolasSelecionadas, setBolasSelecionadas] = useState([]);
  const [premios, setPremios] = useState({ 25: [], 50: [], 75: [], 100: [] });
  const [etapasAlcancadas, setEtapasAlcancadas] = useState([]);
  const [bolasPremioDesbloqueadas, setBolasPremioDesbloqueadas] = useState({});
  const [resumoFinanceiro, setResumoFinanceiro] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [encerrado, setEncerrado] = useState(false);
  const numeros = Array.from({ length: 60 }, (_, i) => i + 1);

  useEffect(() => {
    if (codigo) {
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
    }
  }, [codigo]);

  const sortearBola = (num) => {
    if (bolasSelecionadas.includes(num) || encerrado) return;
    const novas = [...bolasSelecionadas, num];
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

  const reiniciarTudo = () => {
    setBolasSelecionadas([]);
    setPremios({ 25: [], 50: [], 75: [], 100: [] });
    setEtapasAlcancadas([]);
    setBolasPremioDesbloqueadas({});
    setResumoFinanceiro(null);
    setEncerrado(false);
    setMensagem("");
  };

  return (
    <div className="body" style={{ textAlign: "center" }}>
      <button
        onClick={() => router.push("/admin")}
        style={{
          marginBottom: "20px",
          border: "2px solid #00ff00",
          color: "#00ff00",
          backgroundColor: "transparent",
          padding: "8px 16px",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        ← Voltar
      </button>

      <div className="bingo-board">
        {numeros.map((num) => (
          <div
            key={num}
            className={`bola ${bolasSelecionadas.includes(num) ? "selecionada" : ""}`}
            onClick={() => sortearBola(num)}
            style={{ cursor: "pointer" }}
          >
            {num}
          </div>
        ))}
      </div>

      <PainelControle
        sorteando={false}
        pausado={false}
        sortearBola={() => {}}
        iniciarSorteio={() => {}}
        setPausado={() => {}}
        confirmarReinicio={false}
        setConfirmarReinicio={() => {}}
        onConfirmarReinicio={reiniciarTudo}
        finalizarSorteio={() => {}}
      />

      <div style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "6px",
        margin: "20px auto"
      }}>
        {bolasSelecionadas.map((bola, i) => (
          <div
            key={i}
            className="bola"
            style={{ width: "32px", height: "32px", fontSize: "0.85rem" }}
          >
            {bola}
          </div>
        ))}
      </div>
    </div>
  );
}
