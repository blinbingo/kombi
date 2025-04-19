
import React from "react";

function gerarCodigoCartela(index) {
  return "C" + String(index + 1).padStart(4, "0");
}

export default function RankingCartelas({ cartelas, bolasSelecionadas, etapasAlcancadas }) {
  const proximaMeta = [25, 50, 75, 100].find((m) => !etapasAlcancadas.includes(m));
  if (!proximaMeta) return null;

  const totalNecessario = Math.floor((proximaMeta / 100) * 24);

  const ranking = cartelas
    .map((cartela, index) => {
      const acertos = cartela.filter((n) => bolasSelecionadas.includes(n));
     const faltam = cartela
  .filter((num) => !bolasSelecionadas.includes(num))
  .sort((a, b) => a - b);

      return {
        codigo: gerarCodigoCartela(index),
        faltamQtd: totalNecessario - acertos.length,
        numerosFaltando: faltam
      };
    })
    .filter((item) => item.faltamQtd > 0)
    .sort((a, b) => a.faltamQtd - b.faltamQtd)
    .slice(0, 35);

  return (
    <div>
      <h3 style={{ color: "#fff", marginTop: "30px" }}>Ranking para {proximaMeta}%</h3>
      <div className="ranking-grid">
        {ranking.map((cartela, i) => (
          <div key={i}>
            <div style={{ color: "#00ff00", fontWeight: "bold", marginBottom: "4px" }}>{cartela.codigo}</div>
            <div className="ranking-card">
              <div style={{ fontSize: "0.7rem", marginBottom: "4px" }}>Números Restantes: {cartela.faltamQtd}</div>
              <div style={{ fontSize: "1rem", wordWrap: "break-word" }}>{cartela.numerosFaltando.join(", ")}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
