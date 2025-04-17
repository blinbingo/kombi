import React from "react";

export default function PainelControle({
  sorteando,
  pausado,
  sortearBola,
  iniciarSorteio,
  setPausado,
  confirmarReinicio,
  setConfirmarReinicio,
  onConfirmarReinicio,
  finalizarSorteio
}) {
  return (
    <div className="controles">
      <button onClick={sortearBola} disabled={sorteando}>Sortear Bola</button>
      <button onClick={iniciarSorteio} disabled={sorteando}>Sortear Automático</button>

      {sorteando && pausado && (
        <button onClick={() => setPausado(false)}>▶️ Retomar Sorteio</button>
      )}
      {sorteando && !pausado && (
        <button onClick={() => setPausado(true)}>⏸️ Pausar</button>
      )}

      {confirmarReinicio ? (
        <button onClick={onConfirmarReinicio}>❗ Confirmar Reinício</button>
      ) : (
        <button onClick={() => setConfirmarReinicio(true)}>🔁 Reiniciar</button>
      )}

      <button onClick={finalizarSorteio}>🏁 Finalizar Sorteio</button>
    </div>
  );
}
