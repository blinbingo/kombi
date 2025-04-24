import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";

export default function AdminIndex() {
  const router = useRouter();
  const [sorteios, setSorteios] = useState([]);
  const [confirmar, setConfirmar] = useState(null);

  useEffect(() => {
    async function buscar() {
      const { data, error } = await supabase
        .from("bingo")
        .select("*")
        .is("encerradoEm", null)
        .order("data", { ascending: true });

      if (!error && data) setSorteios(data);
    }
    buscar();
  }, []);

  const excluir = async (codigoSorteio) => {
    await supabase.from("cartelas").delete().eq("codigoSorteio", codigoSorteio);
    await supabase.from("bingo").delete().eq("codigoSorteio", codigoSorteio);
    setSorteios((prev) => prev.filter((s) => s.codigoSorteio !== codigoSorteio));
    setConfirmar(null);
  };

  return (
    <div style={{ backgroundColor: "#0f172a", color: "white", minHeight: "100vh", padding: "20px" }}>
      <h1 style={{ textAlign: "center", color: "#00ff00" }}>Sorteios Cadastrados</h1>

      <div style={{ textAlign: "center", margin: "20px" }}>
        <button
          onClick={() => router.push("/admin/novo")}
          style={{
            padding: "10px 20px",
            border: "2px solid #00ff00",
            backgroundColor: "transparent",
            color: "#00ff00",
            fontWeight: "bold",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          ➕ Criar Novo Sorteio
        </button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>
        {sorteios.map((s) => (
          <div key={s.codigoSorteio} style={{
            border: "2px solid #00ff00",
            padding: "16px",
            borderRadius: "10px",
            backgroundColor: "#111827",
            boxShadow: "0 0 10px #00ff00",
            minWidth: "280px"
          }}>
            <p><strong>Código:</strong> {s.codigoSorteio}</p>
            <p><strong>Data:</strong> {new Date(s.data).toLocaleString("pt-BR")}</p>
            <p><strong>Valor da Cartela:</strong> R$ {s.valorCartela?.toFixed(2)}</p>
            <p><strong>Premiação:</strong> 25%: R$ {s.premio25} | 50%: R$ {s.premio50} | 75%: R$ {s.premio75} | 100%: R$ {s.premio100}</p>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
              <button
                onClick={() => router.push("/admin/sorteio/" + s.codigoSorteio)}
                style={{
                  padding: "6px",
                  flex: 1,
                  marginRight: "5px",
                  border: "2px solid #00ff00",
                  color: "#00ff00",
                  backgroundColor: "transparent",
                  fontWeight: "bold",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Iniciar Sorteio
              </button>
              <button
                onClick={() => {
                  const delay = prompt("Quantos segundos de delay entre as bolas?");
                  if (!delay || isNaN(delay)) return alert("Delay inválido.");
                  router.push(`/admin/simulador-delay/${s.codigoSorteio}?delay=${delay}`);
                }}
                style={{
                  padding: "6px",
                  flex: 1,
                  border: "2px solid #00ff00",
                  color: "#00ff00",
                  backgroundColor: "transparent",
                  fontWeight: "bold",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Simular
              </button>
            </div>

            {confirmar === s.codigoSorteio ? (
              <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                <button
                  onClick={() => excluir(s.codigoSorteio)}
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
                  onClick={() => setConfirmar(null)}
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
                onClick={() => setConfirmar(s.codigoSorteio)}
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
      </div>
    </div>
  );
}
