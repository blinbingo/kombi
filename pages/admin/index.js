import React, { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/router";

export default function PainelSorteios() {
  const [sorteios, setSorteios] = useState([]);
  const [cartelaCounts, setCartelaCounts] = useState({});
  const [confirmarExclusao, setConfirmarExclusao] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function buscar() {
      const { data, error } = await supabase
        .from("bingo")
        .select("*")
        .order("data", { ascending: false });
      if (!error) {
        setSorteios(data);
        const contagens = {};
        for (const s of data) {
          const { count } = await supabase
            .from("cartelas")
            .select("id", { count: "exact", head: true })
            .eq("codigoSorteio", s.codigoSorteio);
          contagens[s.codigoSorteio] = count || 0;
        }
        setCartelaCounts(contagens);
      }
    }
    buscar();
  }, []);
  const exportarCSV = async (codigoSorteio) => {
    const { data, error } = await supabase
      .from("cartelas")
      .select("*")
      .eq("codigoSorteio", codigoSorteio);

    if (error || !data) return;

    const linhas = data.map((c, i) =>
      ["C" + String(i + 1).padStart(4, "0"), ...(c.numeros || [])].join(",")
    );
    const csv = "data:text/csv;charset=utf-8," + ["CÓDIGO,NUMEROS", ...linhas].join("\\n");
    const encodedUri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `cartelas_${codigoSorteio}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const excluirSorteio = async (codigoSorteio) => {
    await supabase.from("cartelas").delete().eq("codigoSorteio", codigoSorteio);
    await supabase.from("bingo").delete().eq("codigoSorteio", codigoSorteio);
    setSorteios((prev) => prev.filter((s) => s.codigoSorteio !== codigoSorteio));
    setConfirmarExclusao(null);
  };
  return (
    <div style={{ backgroundColor: "#0f172a", minHeight: "100vh", padding: "20px", color: "white" }}>
      <h1 style={{ textAlign: "center", color: "#00ff00", fontSize: "26px", marginBottom: "20px" }}>
        Sorteios Cadastrados
      </h1>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          onClick={() => router.push("/admin/novo")}
          style={{
            padding: "10px 20px",
            backgroundColor: "transparent",
            border: "2px solid #00ff00",
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
          <div key={s.codigoSorteio} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{
              width: "100%",
              maxWidth: "300px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "4px"
            }}>
              <p style={{ color: "#00ff00", fontSize: "14px" }}>{s.codigoSorteio}</p>
              <button
                onClick={() => exportarCSV(s.codigoSorteio)}
                style={{
                  fontSize: "11px",
                  padding: "4px 8px",
                  backgroundColor: "transparent",
                  border: "1px solid #00ff00",
                  color: "#00ff00",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Exportar Cartelas
              </button>
            </div>
            <div style={{
              border: "2px solid #00ff00",
              backgroundColor: "#111827",
              padding: "16px",
              borderRadius: "10px",
              minWidth: "260px",
              boxShadow: "0 0 12px #00ff00"
            }}>
              <p><strong>Título:</strong> {s.titulo || "Sem título"}</p>
              <p><strong>Data:</strong> {new Date(s.data).toLocaleDateString("pt-BR")}</p>
              <p><strong>Horário:</strong> {new Date(s.data).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</p>
              <p><strong>Cartela:</strong> R$ {s.valorCartela}</p>
              <p><strong>Total de Cartelas:</strong> {cartelaCounts[s.codigoSorteio] || 0}</p>
              <p>
                <strong>Premiação:</strong><br />
                25%: R$ {s.premio25} | 50%: R$ {s.premio50}<br />
                75%: R$ {s.premio75} | 100%: R$ {s.premio100}
              </p>

              <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", marginTop: "10px" }}>
                <button
                  onClick={() => router.push("/admin/sorteio/" + s.codigoSorteio)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    border: "2px solid #00ff00",
                    backgroundColor: "transparent",
                    color: "#00ff00",
                    fontWeight: "bold",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                >
                  INICIAR SORTEIO
                </button>
                <button style={{
                  flex: 1,
                  padding: "8px",
                  border: "2px solid #00ff00",
                  backgroundColor: "transparent",
                  color: "#00ff00",
                  fontWeight: "bold",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}>
                  INICIAR SIMULAÇÃO
                </button>
              </div>

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
          </div>
        ))}
      </div>
    </div>
  );
}
