import React from "react";
import CartelasPremiadas from "./CartelasPremiadas";
import RankingCartelas from "./RankingCartelas";

export default function SimuladorPainelInferior({
  premios,
  bolasPremioDesbloqueadas,
  resumoFinanceiro,
  cartelas,
  bolasSelecionadas,
  etapasAlcancadas,
  mensagem
}) {
  return (
    <>
      <CartelasPremiadas
        premios={premios}
        bolasPremioDesbloqueadas={bolasPremioDesbloqueadas}
        resumoFinanceiro={resumoFinanceiro}
      />
      <RankingCartelas
        cartelas={cartelas}
        bolasSelecionadas={bolasSelecionadas}
        etapasAlcancadas={etapasAlcancadas}
      />
      {mensagem && (
        <div style={{
          marginTop: "20px",
          textAlign: "center",
          color: mensagem.includes("✅") ? "limegreen" : "red"
        }}>
          <strong>{mensagem}</strong>
        </div>
      )}
    </>
  );
}
