import { useState, useEffect, useRef } from "react";

export default function useSorteio(tempoDelay) {
  const [bolasSelecionadas, setBolasSelecionadas] = useState([]);
  const [contador, setContador] = useState(null);
  const [sorteando, setSorteando] = useState(false);
  const [pausado, setPausado] = useState(false);
  const jaParouNo100 = useRef(false);
  const numeros = Array.from({ length: 60 }, (_, i) => i + 1);

  // funções vão entrar nos próximos blocos

  return {
    bolasSelecionadas,
    setBolasSelecionadas,
    contador,
    setContador,
    sorteando,
    setSorteando,
    pausado,
    setPausado,
    jaParouNo100,
    numeros
  };
}
