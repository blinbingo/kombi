import React, { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function Relatorios() {
  const [sorteios, setSorteios] = useState([]);

  useEffect(() => {
    async function carregar() {
      const { data, error } = await supabase
        .from("bingo")
        .select("*")
        .order("encerradoEm", { ascending: false });
      if (!error) setSorteios(data);
    }
    carregar();
  }, []);

  return (
    <div style={{ padding: "20px", backgroundColor: "#0f172a", minHeight: "100vh", color: "white" }}>
      <h1 style={{ textAlign: "center", color: "#00ff00" }}>Relatórios de Sorteios</h1>
      <div style={{ marginTop: "30px", display: "flex", flexDirection: "column", gap: "20px", maxWidth: "800px", marginInline: "auto" }}>
        {sorteios.map((s) => (
          <div key={s.codigoSorteio} style={{
            border: "2px solid #00ff00",
            backgroundColor: "#111827",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 0 10px #00ff00"
          }}>
            <p><strong>Código:</strong> {s.codigoSorteio}</p>
            <p><strong>Encerrado em:</strong> {new Date(s.encerradoEm).toLocaleString("pt-BR")}</p>
            <p><strong>Total Arrecadado:</strong> R$ {s.resumo?.totalArrecadado?.toFixed(2)}</p>
            <p><strong>Total Premiado:</strong> R$ {s.resumo?.totalPremiosPagos?.toFixed(2)}</p>
            <p><strong>Bolas Sorteadas:</strong> {s.bolas?.join(", ")}</p>
            <p><strong>Premiados:</strong></p>
            <ul>
              {Object.entries(s.premiados || {}).map(([nivel, cartelas]) => (
                <li key={nivel}>
                  {nivel}% - {Object.entries(cartelas).length} ganhadores:{" "}
                  {Object.entries(cartelas).map(([cod, val]) => `${cod} (R$ ${val})`).join(", ")}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
