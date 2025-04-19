import React, { useEffect, useState } from "react";
import SorteioCard from "../components/SorteioCard";
import { supabase } from "../utils/supabaseClient";

export default function Sorteios() {
  const [sorteios, setSorteios] = useState([]);

  useEffect(() => {
    async function buscarSorteios() {
      const { data, error } = await supabase
        .from("bingo")
        .select("*")
        .order("data", { ascending: false });

      if (error) {
        console.error("Erro ao buscar sorteios:", error.message);
      } else {
        setSorteios(data);
      }
    }

    buscarSorteios();
  }, []);

  return (
    <div style={{
      backgroundColor: "#0f172a",
      minHeight: "100vh",
      padding: "20px",
      color: "white"
    }}>
      <h1 style={{
        textAlign: "center",
        color: "#00ff00",
        fontSize: "26px",
        marginBottom: "20px"
      }}>
        SORTEIOS AGENDADOS
      </h1>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center"
      }}>
        {sorteios.map((sorteio, index) => (
          <SorteioCard
            key={index}
            horario={new Date(sorteio.data).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
            valorCartela={sorteio.valorCartela}
            premios={{
              25: sorteio.premio25,
              50: sorteio.premio50,
              75: sorteio.premio75,
              100: sorteio.premio100
            }}
          />
        ))}
      </div>
    </div>
  );
}
