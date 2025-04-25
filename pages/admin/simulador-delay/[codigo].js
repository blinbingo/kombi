
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../../utils/supabaseClient";
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

  const numeros = Array.from({ length: 60 }, (_, i) => i + 1);

  useEffect(() => {
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

    if (codigo) carregarCartelas();
  }, [codigo]);

  function atualizarPremios(bolas) {
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
  }

  function sortearBolaManual(numero) {
    if (!bolasSelecionadas.includes(numero)) {
      const novas = [...bolasSelecionadas, numero];
      setBolasSelecionadas(novas);
      atualizarPremios(novas);
    }
  }

  useEffect(() => {
    const intervalo = setInterval(async () => {
      if (!codigo) return;
      try {
        const res = await fetch(`/api/bolinha?codigo=${codigo}`);
        const data = await res.json();
        if (data.numero) {
          sortearBolaManual(data.numero);
        }
      } catch (e) {
        console.error("Erro ao buscar bolinha:", e);
      }
    }, 1000);

    return () => clearInterval(intervalo);
  }, [codigo, bolasSelecionadas]);

  return (
    <div className="body" style={{ textAlign: "center" }}>
      <h1>Sorteio Manual</h1>

      <div className="bingo-board">
        {numeros.map((num) => (
          <div
            key={num}
            className={`bola ${bolasSelecionadas.includes(num) ? "selecionada" : ""}`}
          >
            {num}
          </div>
        ))}
      </div>

      <div style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "6px",
        marginTop: "20px"
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
