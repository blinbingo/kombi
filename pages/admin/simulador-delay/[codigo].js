import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SimuladorBingo from "../../../components/SimuladorBingo";
import { supabase } from "../../../utils/supabaseClient";

export default function SimuladorDelay() {
  const router = useRouter();
  const { codigo } = router.query;

  const [cartelas, setCartelas] = useState([]);
  const [valorCartela, setValorCartela] = useState(10);
  const [valorPremios, setValorPremios] = useState({ 25: 10, 50: 20, 75: 200, 100: 500 });
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
        setValorCartela(Number(dataSorteio.valorCartela) || 10);
        setTitulo(dataSorteio.titulo || "");
        setValorPremios({
          25: Number(dataSorteio.premio25) || 10,
          50: Number(dataSorteio.premio50) || 20,
          75: Number(dataSorteio.premio75) || 200,
          100: Number(dataSorteio.premio100) || 500,
        });
      }
    };

    carregarDados();
  }, [codigo]);

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
      premio50: valorPrem
::contentReference[oaicite:0]{index=0}
 
