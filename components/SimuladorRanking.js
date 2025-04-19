import React from "react";

export default function SimuladorRanking({
  cartelas,
  bolasSelecionadas,
  etapasAlcancadas
}) {
  const calcularFaltantes = (cartela) =>
    cartela.filter((num) => !bolasSelecionadas.includes(num)).sort((a, b) => a - b);

  const cartelasComFaltantes = cartelas.map((cartela, index) => {
    const faltam = calcularFaltantes(cartela);
    return {
      codigo: "C" + String(index + 1).padStart(4, "0"),
      faltam
    };
  });

  const ordenadas = cartelasComFaltantes
    .sort((a, b) => a.faltam.length - b.faltam.length)
    .slice(0, 36);

  const colunas = [[], [], [], []];
  ordenadas.forEach((cartela, i) => {
    colunas[i % 4].push(cartela);
  });

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      gap: "10px",
      marginTop: "20px",
      flexWrap: "wrap"
    }}>
      {colunas.map((grupo, idx) => (
        <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {grupo.map((cartela) => (
            <div key={cartela.codigo}>
              <p style={{
                fontWeight: "bold",
                color: "#00ff00",
                fontSize: "14px",
                marginBottom: "4px"
              }}>
                {cartela.codigo}
              </p>
              <div style={{
                border: "2px solid #00ff00",
                borderRadius: "8px",
                padding: "6px",
                minWidth: "100px",
                minHeight: "38px",
                fontSize: "11px",
                color: "white"
              }}>
                {cartela.faltam.join(", ")}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
