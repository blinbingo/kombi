import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";

export default function AdminIndex() {
  const router = useRouter();
  const [sorteios, setSorteios] = useState([]);

  useEffect(() => {
    async function buscar() {
      const { data, error } = await supabase
        .from("bingo")
        .select("*")
        .order("data", { ascending: false });
      if (!error && data) {
        setSorteios(data.filter((s) => !s.encerradoEm));
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
    const csv =
      "data:text/csv;charset=utf-8," + ["CÓDIGO,NUMEROS", ...linhas].join("\n");
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
  };

  return (
    <div style={{ backgroundColor: "#0f172a", minHeight: "100vh", padding: "20px", color: "white" }}>
      <h1 style={{ textAlign: "center", color: "#00ff00", fontSize: "26px", marginBottom: "20px" }}>
        Sorteios Cadastrados
      </h1>

      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "20px" }}>
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

        <button
          onClick={() => router.push("/admin/relatorios")}
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
          📊 Relatórios
        </button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>
        {sorteios.map((s) => (
          <div key={s.codigoSorteio} style={{ border: "2px solid #00ff00", padding: "16px", borderRadius: "10px", minWidth: "260px", boxShadow: "0 0 12px #00ff00" }}>
            <p style={{ color: "#00ff00", fontSize: "14px", textAlign: "center" }}>{s.codigoSorteio}</p>
            <p><strong>Título:</strong> {s.titulo || "Sem título"}</p>
            <p><strong>Data:</strong> {new Date(s.data).toLocaleDateString("pt-BR")}</p>
            <p><strong>Horário:</strong> {new Date(s.data).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</p>
            <p><strong>Cartela:</strong> R$ {s.valorCartela}</p>
            <p><strong>Total de Cartelas:</strong> {s.quantidadeCartelas}</p>
            <p>
              <strong>Premiação:</strong><br />
              25%: R$ {s.premio25} | 50%: R$ {s.premio50}<br />
              75%: R$ {s.premio75} | 100%: R$ {s.premio100}
            </p>

            <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", marginTop: "10px" }}>
              <button onClick={() => router.push(`/admin/sorteio/${s.codigoSorteio}`)} style={{
                flex: 1,
                padding: "8px",
                border: "2px solid #00ff00",
                backgroundColor: "transparent",
                color: "#00ff00",
                fontWeight: "bold",
                borderRadius: "6px",
                cursor: "pointer"
              }}>
                INICIAR SORTEIO
              </button>

              <button onClick={() => router.push(`/admin/simular/${s.codigoSorteio}`)} style={{
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

            <button
              onClick={() => exportarCSV(s.codigoSorteio)}
              style={{
                marginTop: "10px",
                fontSize: "11px",
                padding: "6px",
                backgroundColor: "transparent",
                border: "1px solid #00ff00",
                color: "#00ff00",
                borderRadius: "4px",
                cursor: "pointer",
                width: "100%"
              }}
            >
              Exportar Cartelas
            </button>

            <button
              onClick={() => excluirSorteio(s.codigoSorteio)}
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
          </div>
        ))}
      </div>
    </div>
  );
}
