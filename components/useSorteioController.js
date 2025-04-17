import { useEffect, useRef, useState } from "react";

export default function useSorteioController({
  tempoDelay,
  cartelas,
  valorCartela,
  valorPremios,
  atualizarPremiosExternamente
}) {
  const [bolasSelecionadas, setBolasSelecionadas] = useState([]);
  const [contador, setContador] = useState(null);
  const [sorteando, setSorteando] = useState(false);
  const [pausado, setPausado] = useState(false);
  const jaParouNo100 = useRef(false);

  const numeros = Array.from({ length: 60 }, (_, i) => i + 1);

  const sortearBola = () => {
    const disponiveis = numeros.filter((n) => !bolasSelecionadas.includes(n));
    if (disponiveis.length === 0) return;
    const nova = disponiveis[Math.floor(Math.random() * disponiveis.length)];
    const novas = [...bolasSelecionadas, nova];
    setBolasSelecionadas(novas);
    atualizarPremiosExternamente(novas);
  };

  const iniciarSorteio = () => {
    setSorteando(true);
    setContador(tempoDelay);
  };

  const reiniciar = () => {
    setBolasSelecionadas([]);
    setContador(null);
    setSorteando(false);
    setPausado(false);
    jaParouNo100.current = false;
  };

  const finalizarSorteio = (callback) => {
    let bolas = [...bolasSelecionadas];
    let etapas = [];
    const numerosRestantes = numeros.filter((n) => !bolas.includes(n));

    for (let i = 0; i < numerosRestantes.length; i++) {
      const nova = numerosRestantes[i];
      bolas.push(nova);
      const continuar = callback(bolas);
      if (!continuar) break;
    }

    setBolasSelecionadas(bolas);
    setSorteando(false);
    setContador(null);
    setPausado(false);
    jaParouNo100.current = true;
  };

  useEffect(() => {
    let timer;
    if (sorteando && contador !== null && !pausado && !jaParouNo100.current) {
      if (contador > 0) {
        timer = setTimeout(() => setContador((prev) => prev - 1), 1000);
      } else {
        sortearBola();
        setContador(tempoDelay);
      }
    }
    return () => clearTimeout(timer);
  }, [contador, sorteando, pausado]);

  return {
    bolasSelecionadas,
    contador,
    sorteando,
    pausado,
    setPausado,
    sortearBola,
    iniciarSorteio,
    reiniciar,
    finalizarSorteio
  };
}
