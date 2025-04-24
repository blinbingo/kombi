
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
        const lista = dataCartelas.map((item) => item.numeros);
        setCartelas(lista);
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

  return (
    <>
      {cartelas.length > 0 && (
        <SimuladorBingo
          cartelas={cartelas}
          tempoDelay={tempoDelay}
          valorCartela={valorCartela}
          valorPremios={valorPremios}
          titulo={titulo}
        />
      )}
    </>
  );
}
