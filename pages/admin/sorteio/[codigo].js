
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../../utils/supabaseClient";
import CartelasPremiadas from "../../../components/CartelasPremiadas";
import RankingCartelas from "../../../components/RankingCartelas";

export default function SorteioManual() {
  console.log("⚠️ Componente SorteioManual carregou");

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
  const [confirmar, setConfirmar] = useState(false);

  const numeros = Array.from({ length: 60 }, (_, i) => i + 1);

  useEffect(() => {
    console.log("👀 useEffect rodando — código:", codigo);

    if (!codigo) return;

    const intervalo = setInterval(async () => {
      try {
        const res = await fetch(`/api/bolinhas?codigo=${codigo}&t=${Date.now()}`);
        const data = await res.json();

        console.log("🔍 API respondeu:", data);

        if (data.numero && !bolasSelecionadas.includes(data.numero)) {
          console.log("🎯 Bolinha enviada para sortearBola:", data.numero);
          sortearBola(data.numero);
        }
      } catch (err) {
        console.error("Erro ao buscar bolinha da API:", err);
      }
    }, 1000);

    return () => clearInterval(intervalo);
  }, [codigo, bolasSelecionadas]);

  return (
    <div className="body" style={{ textAlign: "center" }}>
      <h1>Sorteio Manual</h1>
      <p>Veja o console para depuração.</p>
    </div>
  );
}
