
import React, { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function Relatorios() {
  const [sorteios, setSorteios] = useState([]);
  const [selecionado, setSelecionado] = useState(null);

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

  const calcularLucro = (resumo) =>
    (resumo?.totalArrecadado || 0) - (resumo?.totalPremiosPagos || 0);

  return (
    <div style={{ padding: "20px", backgroundColor: "#0f172a", minHeight: "100vh", color: "white" }}>
      <h1 style={{ textAlign: "center", color: "#00ff00" }}>Relatórios de Sorteios</h1>

      <table style={{
        width: "100%", maxWidth: "1000px", margin: "30px auto",
        borderCollapse: "collapse", boxShadow: "0 0 10px #00ff00"
      }}>
        <thead>
          <tr style={{ backgroundColor: "#111827", color: "#00ff00" }}>
            <th style={td}>Código</th>
            <th style={td}>Data</th>
            <th style={td}>Valor Cartela</th>
            <th style={td}>Arrecadado</th>
            <th style={td}>Pago</th>
            <th style={td}>Lucro</th>
          </tr>
        </thead>
        <tbody>
          {sorteios.map((s) => (
            <tr key={s.codigoSorteio} style={{ cursor: "pointer", backgroundColor: "#1e293b" }}
              onClick={() => setSelecionado(s)}>
              <td style={td}>{s.codigoSorteio}</td>
              <td style={td}>{new Date(s.encerradoEm).toLocaleString("pt-BR")}</td>
              <td style={td}>R$ {s.valorCartela?.toFixed(2)}</td>
              <td style={td}>R$ {s.resumo?.totalArrecadado?.toFixed(2)}</td>
              <td style={td}>R$ {s.resumo?.totalPremiosPagos?.toFixed(2)}</td>
              <td style={td}>R$ {calcularLucro(s.resumo).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selecionado && (
        <div style={{
          backgroundColor: "#111827",
          color: "white",
          border: "2px solid #00ff00",
          boxShadow: "0 0 10px #00ff00",
          borderRadius: "10px",
          padding: "20px",
          position: "fixed",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "90%",
          maxWidth: "800px",
          zIndex: 1000
        }}>
          <h2 style={{ color: "#00ff00", marginBottom: "10px" }}>Detalhes do Sorteio</h2>
          <p><strong>Código:</strong> {selecionado.codigoSorteio}</p>
          <p><strong>Data:</strong> {new Date(selecionado.encerradoEm).toLocaleString("pt-BR")}</p>
          <p><strong>Valor da Cartela:</strong> R$ {selecionado.valorCartela}</p>
          <p><strong>Total de Cartelas:</strong> {selecionado?.resumo?.totalArrecadado / selecionado.valorCartela}</p>
          <p><strong>Premiação:</strong> 25%: R$ {selecionado.premio25}, 50%: R$ {selecionado.premio50}, 75%: R$ {selecionado.premio75}, 100%: R$ {selecionado.premio100}</p>
          <p><strong>Bolas sorteadas:</strong> {selecionado.bolas?.join(", ")}</p>
          <p><strong>Resumo Financeiro:</strong></p>
          <ul>
            <li>Total Arrecadado: R$ {selecionado.resumo?.totalArrecadado}</li>
            <li>Total de Prêmios Pagos: R$ {selecionado.resumo?.totalPremiosPagos}</li>
            <li>Lucro: R$ {calcularLucro(selecionado.resumo)}</li>
          </ul>
          <p><strong>Cartelas Premiadas:</strong></p>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
            <thead>
              <tr>
                <th style={td}>Nível</th>
                <th style={td}>Cartela</th>
                <th style={td}>Valor</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(selecionado.premiados || {}).flatMap(([nivel, cartelas]) =>
                Object.entries(cartelas).map(([cod, valor]) => (
                  <tr key={nivel + cod}>
                    <td style={td}>{nivel}%</td>
                    <td style={td}>{cod}</td>
                    <td style={td}>R$ {valor}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <button onClick={() => setSelecionado(null)} style={{
            marginTop: "20px",
            padding: "10px 20px",
            border: "2px solid red",
            backgroundColor: "transparent",
            color: "red",
            fontWeight: "bold",
            borderRadius: "6px",
            cursor: "pointer"
          }}>Fechar</button>
        </div>
      )}
    </div>
  );
}

const td = {
  border: "1px solid #00ff00",
  padding: "8px",
  textAlign: "center"
};
