import React, { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function Relatorios() {
  const [sorteios, setSorteios] = useState([]);
  const [selecionado, setSelecionado] = useState(null);

  useEffect(() => {
    async function buscar() {
      const { data, error } = await supabase
        .from("bingo")
        .select("*")
        .not("encerradoEm", "is", null)
        .order("encerradoEm", { ascending: false });
      if (!error && data) setSorteios(data);
    }
    buscar();
  }, []);

  const calcularLucro = (s) => {
    if (!s.resumo) return "R$ 0,00";
    const total = s.resumo.totalArrecadado - s.resumo.totalPremiosPagos;
    return total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const formatarData = (d) => new Date(d).toLocaleString("pt-BR");

  return (
    <div style={{ padding: 30, background: "#0f172a", color: "white", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center", color: "#00ff00" }}>Relatórios de Sorteios</h2>

      <table style={{ margin: "20px auto", border: "2px solid #00ff00", boxShadow: "0 0 8px #00ff00", width: "100%", maxWidth: "1000px" }}>
        <thead>
          <tr>
            <th style={celula}>Código</th>
            <th style={celula}>Data</th>
            <th style={celula}>Valor Cartela</th>
            <th style={celula}>Arrecadado</th>
            <th style={celula}>Pago</th>
            <th style={celula}>Lucro</th>
          </tr>
        </thead>
        <tbody>
          {sorteios.map((s) => (
            <tr key={s.codigoSorteio} onClick={() => setSelecionado(s)} style={{ cursor: "pointer" }}>
              <td style={celula}>{s.codigoSorteio}</td>
              <td style={celula}>{formatarData(s.encerradoEm)}</td>
              <td style={celula}>R$ {s.valorCartela?.toFixed(2)}</td>
              <td style={celula}>R$ {s.resumo?.totalArrecadado?.toFixed(2)}</td>
              <td style={celula}>R$ {s.resumo?.totalPremiosPagos?.toFixed(2)}</td>
              <td style={celula}>{calcularLucro(s)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selecionado && (
        <div style={modal}>
          <h3 style={{ color: "#00ff00" }}>Detalhes do Sorteio</h3>
          <p><strong>Código:</strong> {selecionado.codigoSorteio}</p>
          <p><strong>Data:</strong> {formatarData(selecionado.encerradoEm)}</p>
          <p><strong>Valor da Cartela:</strong> R$ {selecionado.valorCartela?.toFixed(2)}</p>
          <p><strong>Total de Cartelas:</strong> {selecionado.resumo ? (selecionado.resumo.totalArrecadado / selecionado.valorCartela).toFixed(0) : "-"}</p>
          <p><strong>Premiação:</strong></p>
          {["25", "50", "75", "100"].map((meta) => (
            <p key={meta}>
              {meta}%: R$ {selecionado[`premio${meta}`] || "-"}
            </p>
          ))}
          <p><strong>Resumo:</strong></p>
          <p>Total Arrecadado: R$ {selecionado.resumo?.totalArrecadado.toFixed(2)}</p>
          <p>Total Pago: R$ {selecionado.resumo?.totalPremiosPagos.toFixed(2)}</p>
          <p><strong>Bolas Sorteadas:</strong> {selecionado.bolas?.join(", ")}</p>
          <p><strong>Cartelas Premiadas:</strong></p>
          {selecionado.premiados && Object.entries(selecionado.premiados).map(([meta, ganhadores]) => (
            <div key={meta}>
              <p>{meta}%:</p>
              <ul>
                {Object.entries(ganhadores).map(([cod, valor]) => (
                  <li key={cod}>{cod} - R$ {valor}</li>
                ))}
              </ul>
            </div>
          ))}
          <button onClick={() => setSelecionado(null)} style={btnFechar}>Fechar</button>
        </div>
      )}
    </div>
  );
}

const celula = {
  padding: "10px 20px",
  border: "1px solid #00ff00",
  textAlign: "center"
};

const modal = {
  background: "#111827",
  border: "2px solid #00ff00",
  padding: 20,
  borderRadius: 10,
  width: "80%",
  margin: "20px auto",
  boxShadow: "0 0 12px #00ff00"
};

const btnFechar = {
  marginTop: 20,
  backgroundColor: "#00ff00",
  color: "#000",
  padding: "8px 16px",
  fontWeight: "bold",
  border: "none",
  borderRadius: 6,
  cursor: "pointer"
};
