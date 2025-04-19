import React, { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/router";

export default function PainelSorteios() {
  const [sorteios, setSorteios] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function buscar() {
      const { data, error } = await supabase.from("bingo").select("*").order("data", { ascending: false });
      if (!error) setSorteios(data);
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
      [`C${String(i + 1).padStart(4, "0")}`, ...(c.numeros || [])].join(",")
    );
    const csv = "data:text/csv;charset=utf-8," + ["CÓDIGO,NUMEROS", ...linhas].join("\n");
    const encodedUri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `cartelas_${codigoSorteio}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px" }}>
        {sorteios.map((s) => (
          <div key={s.codigoSorteio} style={{
            border: "2px solid #00ff00",
            backgroundColor: "#111827",
            padding: "16px",
            borderRadius: "10px",
            minWidth: "260px",
            boxShadow: "0 0 12px #00ff00"
          }}>
            <h3 style={{ color: "#00ff00", fontSize: "18px", marginBottom: "6px" }}>
              {s.codigoSorteio}
            </h3>
            <p><strong>Horário:</strong> {new Date(s.data).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</p>
            <p><strong>Cartela:</strong> R$ {s.valorCartela}</p>
            <p>
              <strong>Premiação:</strong><br />
              25%: R$ {s.premio25} | 50%: R$ {s.premio50}<br />
              75%: R$ {s.premio75} | 100%: R$ {s.premio100}
            </p>
            <button
              onClick={() => exportarCSV(s.codigoSorteio)}
              style={{
                marginTop: "10px",
                border: "2px solid #00ff00",
                backgroundColor: "transparent",
                color: "#00ff00",
                borderRadius: "6px",
                padding: "6px 12px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Exportar Cartelas (.CSV)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
