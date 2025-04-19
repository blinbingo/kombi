import React from "react";
import SorteioCard from "../components/SorteioCard";

export default function Sorteios() {
  // Mock temporário de sorteios agendados
  const sorteios = [
    {
      horario: "15:50",
      valorCartela: 5,
      premios: { 25: 100, 50: 200, 75: 300, 100: 400 }
    },
    {
      horario: "18:00",
      valorCartela: 3,
      premios: { 25: 75, 50: 150, 75: 225, 100: 300 }
    },
    {
      horario: "20:30",
      valorCartela: 10,
      premios: { 25: 250, 50: 500, 75: 750, 100: 1000 }
    }
  ];

  return (
    <div style={{
      backgroundColor: "#0f172a",
      minHeight: "100vh",
      padding: "20px",
      color: "white"
    }}>
      <h1 style={{
        textAlign: "center",
        color: "#00ff00",
        fontSize: "26px",
        marginBottom: "20px"
      }}>
        SORTEIOS AGENDADOS
      </h1>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center"
      }}>
        {sorteios.map((sorteio, index) => (
          <SorteioCard
            key={index}
            horario={sorteio.horario}
            valorCartela={sorteio.valorCartela}
            premios={sorteio.premios}
          />
        ))}
      </div>
    </div>
  );
}
