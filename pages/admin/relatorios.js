import React, { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function Relatorios() {
  const [sorteios, setSorteios] = useState([]);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    async function buscar() {
      const { data, error } = await supabase
        .from("historico")
        .select("*")
        .order("encerradoEm", { ascending: false });
      if (!error) setSorteios(data);
    }
    buscar();
  }, []);

  return (
    <div style={{ padding: 20, background: "#0f172a", minHeight: "100vh", color: "#fff" }}>
      <h1 style={{ textAlign: "center", color: "#00ff00" }}>Relatórios de Sorteios</h1>

      <table style={{
        margin: "20px auto",
        borderCollapse: "collapse",
        border: "2px solid limegreen",
        boxShadow: "0 0 8px limegreen"
      }}>
        <thead>
          <tr style={{ background: "#111", color: "#00ff00" }}>
            <th style={td}>Código</th>
            <th style={td}>Data</th>
            <th style={td}>Valor Cartela</th>
            <th style={td}>Arrecadado</th>
            <th style={td}>Pago</th>
            <th style={td}>Lucro</th>
          </tr>
        </thead>
        <tbody>
          {sorteios.map((s) => {
            const lucro = (s.resumo?.totalArrecadado || 0) - (s.resumo?.totalPremiosPagos || 0);
            return (
              <tr key={s.codigoSorteio} onClick={() => setModal(s)} style={{ cursor: "pointer", textAlign: "center" }}>
                <td style={td}>{s.codigoSorteio}</td>
                <td style={td}>{new Date(s.encerradoEm).toLocaleString("pt-BR")}</td>
                <td style={td}>R$ {s.valorCartela?.toFixed(2) || ""}</td>
                <td style={td}>R$ {s.resumo?.totalArrecadado?.toFixed(2) || ""}</td>
                <td style={td}>R$ {s.resumo?.totalPremiosPagos?.toFixed(2) || ""}</td>
                <td style={td}>R$ {lucro.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {modal && (
        <div style={{
          position: "fixed", inset: 0, background: "#000a", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}
          onClick={() => setModal(null)}
        >
          <div style={{
            background: "#111827",
            border: "2px solid limegreen",
            borderRadius: "10px",
            padding: 20,
            minWidth: 500,
            boxShadow: "0 0 14px limegreen"
          }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ color: "#00ff00" }}>Detalhes do Sorteio</h2>
            <p><strong>Código:</strong> {modal.codigoSorteio}</p>
            <p><strong>Data:</strong> {new Date(modal.encerradoEm).toLocaleString("pt-BR")}</p>
            <p><strong>Valor da Cartela:</strong> R$ {modal.valorCartela}</p>
            <p><strong>Total de Cartelas:</strong> {
              modal.resumo?.totalArrecadado && modal.valorCartela
                ? Math.round(modal.resumo.totalArrecadado / modal.valorCartela)
                : "?"
            }</p>
            <p><strong>Premiação:</strong></p>
            <ul>
              <li>25%: R$ {modal.premio25}</li>
              <li>50%: R$ {modal.premio50}</li>
              <li>75%: R$ {modal.premio75}</li>
              <li>100%: R$ {modal.premio100}</li>
            </ul>
            <p><strong>Resumo Financeiro:</strong></p>
            <p>Total arrecadado: R$ {modal.resumo?.totalArrecadado}</p>
            <p>Total de prêmios pagos: R$ {modal.resumo?.totalPremiosPagos}</p>
            <p><strong>Lucro:</strong> R$ {(modal.resumo?.totalArrecadado - modal.resumo?.totalPremiosPagos).toFixed(2)}</p>

            <p><strong>Bolas Sorteadas:</strong></p>
            <p>{(modal.bolas || []).join(", ")}</p>

            <p><strong>Cartelas Premiadas:</strong></p>
            <table style={{ width: "100%", marginTop: 10, borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={td}>Cartela</th>
                  <th style={td}>Prêmio</th>
                </tr>
              </thead>
              <tbody>
                {[25, 50, 75, 100].flatMap(meta => (
                  Object.entries(modal.premiados?.[meta] || {}).map(([c, valor]) => (
                    <tr key={c + meta}>
                      <td style={td}>{c}</td>
                      <td style={td}>R$ {valor}</td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>

            <button onClick={() => setModal(null)} style={{
              marginTop: 20,
              padding: "6px 16px",
              border: "2px solid #00ff00",
              background: "transparent",
              color: "#00ff00",
              fontWeight: "bold",
              borderRadius: "6px",
              cursor: "pointer"
            }}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}

const td = {
  border: "1px solid limegreen",
  padding: "6px 10px",
};
