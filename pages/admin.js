import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Admin() {
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      const { data, error } = await supabase
        .from("bingo")
        .select("*")
        .order("data", { ascending: false });

      if (error) {
        console.error("Erro ao buscar dados:", error);
      } else {
        setDados(data);
      }
      setCarregando(false);
    }

    carregarDados();
  }, []);

  return (
    <div style={{ padding: "20px", color: "white", backgroundColor: "#0f172a", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Painel Administrativo</h1>
      {carregando ? (
        <p>Carregando dados...</p>
      ) : dados.length === 0 ? (
        <p>Nenhum sorteio registrado ainda.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#14532d", color: "#fff" }}>
              <th style={{ padding: "8px", border: "1px solid #00ff00" }}>Código</th>
              <th style={{ padding: "8px", border: "1px solid #00ff00" }}>Data</th>
              <th style={{ padding: "8px", border: "1px solid #00ff00" }}>Cartelas</th>
              <th style={{ padding: "8px", border: "1px solid #00ff00" }}>Valor Cartela</th>
              <th style={{ padding: "8px", border: "1px solid #00ff00" }}>Prêmios</th>
              <th style={{ padding: "8px", border: "1px solid #00ff00" }}>Arrecadado</th>
              <th style={{ padding: "8px", border: "1px solid #00ff00" }}>Pago</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((sorteio) => (
              <tr key={sorteio.codigoSorteio} style={{ textAlign: "center" }}>
                <td style={{ padding: "8px", border: "1px solid #00ff00" }}>{sorteio.codigoSorteio}</td>
                <td style={{ padding: "8px", border: "1px solid #00ff00" }}>{new Date(sorteio.data).toLocaleString()}</td>
                <td style={{ padding: "8px", border: "1px solid #00ff00" }}>{sorteio.quantidadeCartelas}</td>
                <td style={{ padding: "8px", border: "1px solid #00ff00" }}>R$ {sorteio.valorCartela.toFixed(2)}</td>
                <td style={{ padding: "8px", border: "1px solid #00ff00" }}>
                  {`25%: R$${sorteio.premio25.toFixed(2)} | 50%: R$${sorteio.premio50.toFixed(2)} | 75%: R$${sorteio.premio75.toFixed(2)} | 100%: R$${sorteio.premio100.toFixed(2)}`}
                </td>
                <td style={{ padding: "8px", border: "1px solid #00ff00" }}>R$ {sorteio.totalArrecadado.toFixed(2)}</td>
                <td style={{ padding: "8px", border: "1px solid #00ff00" }}>R$ {sorteio.totalPremiosPagos.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
