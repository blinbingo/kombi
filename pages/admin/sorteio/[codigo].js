
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../../utils/supabaseClient";
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

  useEffect(() => {
    if (codigo) {
      async function carregarCartelas() {
        const { data } = await supabase
          .from("cartelas")
          .select("numeros")
          .eq("codigoSorteio", codigo);
        if (data) {
          setCartelas(data.map((item) => item.numeros));
        }
      }
      carregarCartelas();
    }
  }, [codigo]);

  const sortearBola = (num) => {
    if (bolasSelecionadas.includes(num)) return;
    const novas = [...bolasSelecionadas, num];
    setBolasSelecionadas(novas);
  };

  return (
    <div>
      <h1>Sorteio Manual</h1>
      <div>
        etapasAlcancadas.includes(100) && !encerrado && (
  <button
    onClick={async () => {
      console.log("Código que será usado no WHERE:", codigo);

      const { error } = await supabase
        .from("bingo")
        .update({
          bolas: bolasSelecionadas,
          premiados: {
            25: Object.fromEntries((premios[25] || []).map((c) => [c, 10])),
            50: Object.fromEntries((premios[50] || []).map((c) => [c, 20])),
            75: Object.fromEntries((premios[75] || []).map((c) => [c, 200])),
            100: Object.fromEntries((premios[100] || []).map((c) => [c, 500]))
          },
          resumo: resumoFinanceiro,
          encerradoEm: new Date().toISOString()
        })
        .eq("codigoSorteio", codigo);

      if (error) {
        console.error("Erro Supabase:", error);
        setMensagem("❌ Erro ao encerrar sorteio!");
      } else {
        setMensagem("✅ Sorteio encerrado e salvo com sucesso!");
        setEncerrado(true);
      }
    }}
    style={{
      marginTop: "30px",
      border: "2px solid #00ff00",
      backgroundColor: "transparent",
      color: "#00ff00",
      fontWeight: "bold",
      padding: "10px 20px",
      borderRadius: "6px",
      cursor: "pointer"
    }}
  >
    ENCERRAR SORTEIO
  </button>
)
      </div>
      {mensagem && (
        <p style={ color: mensagem.includes("✅") ? "green" : "red" }>
          {mensagem}
        </p>
      )}
    </div>
  );
}
