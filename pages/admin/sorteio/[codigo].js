import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../../utils/supabaseClient";
import PainelControle from "../../../components/PainelControle";
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
    if (bolasSelecionadas.includes(num)) return;
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
  };

  return (
    <div className="body" style={{ textAlign: "center" }}>
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
        onConfirmarReinicio={() => {
          setBolasSelecionadas([]);
          setPremios({ 25: [], 50: [], 75: [], 100: [] });
          setEtapasAlcancadas([]);
          setBolasPremioDesbloqueadas({});
          setResumoFinanceiro(null);
        }}
        finalizarSorteio={() => {}}
      />

      <HistoricoBolas bolas={bolasSelecionadas} />
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
