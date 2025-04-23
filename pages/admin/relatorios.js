import React, { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function Relatorios() {
  const [sorteios, setSorteios] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [confirmarExclusao, setConfirmarExclusao] = useState(null);

  useEffect(() => {
    async function carregar() {
      const { data, error } = await supabase
        .from("bingo")
        .select("*")
        .not("encerradoEm", "is", null)
        .order("encerradoEm", { ascending: false });
      if (!error && data) setSorteios(data);
    }
    carregar();
  }, []);

  const excluirSorteio = async (codigoSorteio) => {
    await supabase.from("cartelas").delete().eq("codigoSorteio", codigoSorteio);
    await supabase.from("bingo").delete().eq("codigoSorteio", codigoSorteio);
    setSorteios((prev) => prev.filter((s) => s.codigoSorteio !== codigoSorteio));
    setSelecionado(null);
    setConfirmarExclusao(null);
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#0f172a", minHeight: "100vh", color: "white" }}>
      <h1 style={{ textAlign: "center", color: "#00ff00" }}>Relatórios de Sorteios</h1>

      {sorteios.map((s) => (
        <div key={s.codigoSorteio} style={{
          border: "2px solid #00ff00",
          backgroundColor: "#111827",
          padding: "16px",
          borderRadius: "10px",
          marginBottom: "20px",
          boxShadow: "0 0 10px #00ff00"
        }}>
          <p><strong>Código:</strong> {s.codigoSorteio}</p>
          <p><strong>Data:</strong> {new Date(s.encerradoEm).toLocaleString("pt-BR")}</p>
          <p><strong>Total Arrecadado:</strong> R$ {s.resumo?.totalArrecadado?.toFixed(2)}</p>
          <p><strong>Total Premiado:</strong> R$ {s.resumo?.totalPremiosPagos?.toFixed(2)}</p>

          <button
            onClick={() => setSelecionado(s)}
            style={{
              marginTop: "10px",
              border: "2px solid #00ff00",
              backgroundColor: "transparent",
              color: "#00ff00",
              padding: "8px 16px",
              fontWeight: "bold",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Ver Detalhes
          </button>

          {confirmarExclusao === s.codigoSorteio ? (
            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
              <button
                onClick={() => excluirSorteio(s.codigoSorteio)}
                style={{
                  flex: 1,
                  border: "2px solid red",
                  backgroundColor: "transparent",
                  color: "red",
                  borderRadius: "6px",
                  padding: "6px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Confirmar Exclusão
              </button>
              <button
                onClick={() => setConfirmarExclusao(null)}
                style={{
                  flex: 1,
                  border: "2px solid gray",
                  backgroundColor: "transparent",
                  color: "gray",
                  borderRadius: "6px",
                  padding: "6px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmarExclusao(s.codigoSorteio)}
              style={{
                marginTop: "10px",
                width: "100%",
                border: "2px solid red",
                backgroundColor: "transparent",
                color: "red",
                borderRadius: "6px",
                padding: "6px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "13px"
              }}
            >
              EXCLUIR
            </button>
          )}
        </div>
      ))}

      {selecionado && (
        <div style={{
          backgroundColor: "#111827",
          border: "2px solid #00ff00",
          padding: "20px",
          borderRadius: "10px",
          marginTop: "20px"
        }}>
          <h3>Detalhes do Sorteio {selecionado.codigoSorteio}</h3>
          <p>Bolas sorteadas: {selecionado.bolas?.join(", ")}</p>
          <p>Total Arrecadado: R$ {selecionado.resumo?.totalArrecadado}</p>
          <p>Total Pago: R$ {selecionado.resumo?.totalPremiosPagos}</p>
          <button
            onClick={() => setSelecionado(null)}
            style={{
              marginTop: "10px",
              padding: "6px 12px",
              border: "2px solid #00ff00",
              backgroundColor: "transparent",
              color: "#00ff00",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Fechar Detalhes
          </button>
        </div>
      )}
    </div>
  );
}
