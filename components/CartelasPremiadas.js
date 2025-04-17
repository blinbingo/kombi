import React from "react";

export default function CartelasPremiadas({
  premios,
  bolasPremioDesbloqueadas,
  resumoFinanceiro
}) {
  return (
    <div className="cartelas-container">
      <h3>Cartelas Premiadas</h3>
      <ul>
        {[25, 50, 75, 100].map((meta) =>
          premios[meta]?.length > 0 ? (
            <li key={meta}>
              Prêmio {meta}% - {premios[meta].length} ganhadores: {premios[meta].join(", ")} (Bola: {bolasPremioDesbloqueadas[meta]})
            </li>
          ) : null
        )}
      </ul>

      {resumoFinanceiro && (
        <div style={{ marginTop: "20px", fontWeight: "bold" }}>
          <p>Total arrecadado: R$ {resumoFinanceiro.totalArrecadado.toFixed(2)}</p>
          <p>Total de prêmios pagos: R$ {resumoFinanceiro.totalPremiosPagos.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}
