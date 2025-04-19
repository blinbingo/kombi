import { useState, useEffect, useRef } from "react";

export default function useSorteio(tempoDelay) {
  const [bolasSelecionadas, setBolasSelecionadas] = useState([]);
  const [contador, setContador] = useState(null);
  const [sorteando, setSorteando] = useState(false);
  const [pausado, setPausado] = useState(false);
  const jaParouNo100 = useRef(false);
  const numeros = Array.from({ length: 60 }, (_, i) => i + 1);

  // funções vão entrar nos próximos blocos
  const sortearBola = () => {
    if (jaParouNo100.current) return;
    const disponiveis = numeros.filter((n) => !bolasSelecionadas.includes(n));
    if (disponiveis.length === 0) return;
    const nova = disponiveis[Math.floor(Math.random() * disponiveis.length)];
    setBolasSelecionadas([...bolasSelecionadas, nova]);
  };

  const iniciarSorteio = () => {
    if (!sorteando) {
      setSorteando(true);
      setContador(tempoDelay);
    }
  };

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
    numeros,
    sortearBola,
    iniciarSorteio
  };
}
