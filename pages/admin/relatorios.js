
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
        .order("encerradoEm", { ascending: false });

      if (!error && data) {
        const filtrado = data.filter((s) => s.encerradoEm);
        setSorteios(filtrado);
      }
    }
    buscar();
  }, []);

  const calcularLucro = (s) => {
    if (!s.resumo) return "R$ 0.00";
    const total = s.resumo.totalArrecadado - s.resumo.totalPremiosPagos;
    return total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const formatarData = (d) => new Date(d).toLocaleString("pt-BR");

  return (
    <div style={{ padding: 30, background: "#0f172a", color: "white", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center", color: "#00ff00" }}>Relatórios de Sorteios</h2>

      <table style={{ margin: "20px auto", border: "2px solid #00ff00", boxShadow: "0 0 8px #00ff00" }}>
        <thead>
          <tr>
            <th style={estiloCelula}>Código</th>
            <th style={estiloCelula}>Data</th>
            <th style={estiloCelula}>Valor Cartela</th>
            <th style={estiloCelula}>Arrecadado</th>
            <th style={estiloCelula}>Pago</th>
            <th style={estiloCelula}>Lucro</th>
          </tr>
        </thead>
        <tbody>
          {sorteios.map((s) => (
            <tr key={s.codigoSorteio} onClick={() => setSelecionado(s)} style={{ cursor: "pointer" }}>
              <td style={estiloCelula}>{s.codigoSorteio}</td>
              <td style={estiloCelula}>{formatarData(s.encerradoEm)}</td>
              <td style={estiloCelula}>{s.valorCartela ? `R$ ${s.valorCartela.toFixed(2)}` : "R$ -"}</td>
              <td style={estiloCelula}>
                {s.resumo ? s.resumo.totalArrecadado.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "R$ -"}
              </td>
              <td style={estiloCelula}>
                {s.resumo ? s.resumo.totalPremiosPagos.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "R$ -"}
              </td>
              <td style={estiloCelula}>{calcularLucro(s)}</td>
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
          <p><strong>Total de Cartelas:</strong> {selecionado.resumo ? selecionado.resumo.totalArrecadado / selecionado.valorCartela : "-"}</p>
          <p><strong>Premiação:</strong></p>
          {["25", "50", "75", "100"].map((meta) => (
            <p key={meta}>
              {meta}%: R$ {selecionado.premios?.[meta] || "-"}
            </p>
          ))}
          <p><strong>Resumo:</strong></p>
          <p>Total Arrecadado: {selecionado.resumo?.totalArrecadado.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
          <p>Total Pago: {selecionado.resumo?.totalPremiosPagos.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
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

const estiloCelula = {
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
