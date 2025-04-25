
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SimuladorBingo from "../../../components/SimuladorBingo";
import { supabase } from "../../../utils/supabaseClient";

export default function SimuladorDelay() {
  const router = useRouter();
  const { codigo, delay: delayQuery } = router.query;

  const [cartelas, setCartelas] = useState([]);
  const [valorCartela, setValorCartela] = useState(1);
  const [valorPremios, setValorPremios] = useState({ 25: 1, 50: 1, 75: 1, 100: 1 });
  const [tempoDelay, setTempoDelay] = useState(5);
  const [titulo, setTitulo] = useState("");

  const [resumoFinanceiro, setResumoFinanceiro] = useState(null);
  const [premios, setPremios] = useState({ 25: [], 50: [], 75: [], 100: [] });
  const [bolasSelecionadas, setBolasSelecionadas] = useState([]);
  const [bolasPremioDesbloqueadas, setBolasPremioDesbloqueadas] = useState({});
  const [etapasAlcancadas, setEtapasAlcancadas] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [encerrado, setEncerrado] = useState(false);

  useEffect(() => {
    if (!codigo) return;

    const carregarDados = async () => {
      const { data: dataCartelas } = await supabase
        .from("cartelas")
        .select("numeros")
        .eq("codigoSorteio", codigo);

      const { data: dataSorteio } = await supabase
        .from("bingo")
        .select("valorCartela, premio25, premio50, premio75, premio100, titulo")
        .eq("codigoSorteio", codigo)
        .single();

      if (dataCartelas) {
        setCartelas(dataCartelas.map((item) => item.numeros));
      }

      if (dataSorteio) {
        setValorCartela(Number(dataSorteio.valorCartela) || 1);
        setTitulo(dataSorteio.titulo || "");
        setValorPremios({
          25: Number(dataSorteio.premio25) || 1,
          50: Number(dataSorteio.premio50) || 1,
          75: Number(dataSorteio.premio75) || 1,
          100: Number(dataSorteio.premio100) || 1,
        });
      }

      if (delayQuery) {
        setTempoDelay(Number(delayQuery));
      }
    };

    carregarDados();
  }, [codigo, delayQuery]);

  const encerrarSorteio = async () => {
    const dados = {
      codigoSorteio: codigo,
      bolas: bolasSelecionadas.map(Number),
      premiados: {
        25: Object.fromEntries((premios[25] || []).map((c) => [c, valorPremios[25]])),
        50: Object.fromEntries((premios[50] || []).map((c) => [c, valorPremios[50]])),
        75: Object.fromEntries((premios[75] || []).map((c) => [c, valorPremios[75]])),
        100: Object.fromEntries((premios[100] || []).map((c) => [c, valorPremios[100]]))
      },
      resumo: resumoFinanceiro,
      encerradoEm: new Date().toISOString(),
      valorCartela,
      premio25: valorPremios[25],
      premio50: valorPremios[50],
      premio75: valorPremios[75],
      premio100: valorPremios[100]
    };

    const { error } = await supabase.from("historico").insert([dados]);
    if (error) {
      setMensagem("❌ Erro ao salvar no histórico!");
    } else {
      await supabase.from("bingo").delete().eq("codigoSorteio", codigo);
      setMensagem("✅ Sorteio encerrado e movido para o histórico!");
      setEncerrado(true);
    }
  };

  return (
    <div className="body" style={{ textAlign: "center" }}>
      {cartelas.length > 0 && (
        <>
          <SimuladorBingo
            cartelas={cartelas}
            tempoDelay={tempoDelay}
            valorCartela={valorCartela}
            valorPremios={valorPremios}
            titulo={titulo}
            setPremios={setPremios}
            setResumoFinanceiro={setResumoFinanceiro}
            setBolasSelecionadas={setBolasSelecionadas}
            setEtapasAlcancadas={setEtapasAlcancadas}
            setBolasPremioDesbloqueadas={setBolasPremioDesbloqueadas}
          />

          {etapasAlcancadas.includes(100) && !encerrado && (
            <button onClick={encerrarSorteio} style={{
              marginTop: "30px",
              border: "2px solid #00ff00",
              backgroundColor: "transparent",
              color: "#00ff00",
              fontWeight: "bold",
              padding: "10px 20px",
              borderRadius: "6px",
              cursor: "pointer"
            }}>
              ENCERRAR SORTEIO
            </button>
          )}

          {mensagem && (
            <p style={{
              marginTop: "20px",
              fontWeight: "bold",
              color: mensagem.includes("✅") ? "#00ff00" : "red"
            }}>
              {mensagem}
            </p>
          )}
        </>
      )}
    </div>
  );
}
