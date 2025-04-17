import { useState } from "react";

export default function usePremiacao(cartelas, valorCartela, valorPremios) {
  const [premios, setPremios] = useState({ 25: [], 50: [], 75: [], 100: [] });
  const [etapasAlcancadas, setEtapasAlcancadas] = useState([]);
  const [bolasPremioDesbloqueadas, setBolasPremioDesbloqueadas] = useState({});
  const [resumoFinanceiro, setResumoFinanceiro] = useState(null);

  const atualizarPremios = (bolas) => {
    const metas = [25, 50, 75, 100];
    const novaBola = bolas[bolas.length - 1];
    const novasEtapas = [...etapasAlcancadas];
    const novosPremios = { ...premios };
    const novosDesbloqueios = { ...bolasPremioDesbloqueadas };

    metas.forEach((meta) => {
      if (!novasEtapas.includes(meta)) {
        const ganhadoras = [];
        cartelas.forEach((cartela, index) => {
          const acertos = cartela.filter((num) => bolas.includes(num));
          const porcentagem = Math.floor((acertos.length / 24) * 100);
          if (porcentagem >= meta && cartela.includes(novaBola)) {
            ganhadoras.push("C" + String(index).padStart(4, "0"));
          }
        });
        if (ganhadoras.length > 0) {
          novosPremios[meta] = ganhadoras;
          novosDesbloqueios[meta] = novaBola;
          novasEtapas.push(meta);
        }
      }
    });

    setPremios(novosPremios);
    setEtapasAlcancadas(novasEtapas);
    setBolasPremioDesbloqueadas(novosDesbloqueios);

    if (novasEtapas.includes(100)) {
      const totalArrecadado = cartelas.length * valorCartela;
      const totalPremiosPagos = [25, 50, 75, 100].reduce(
        (acc, p) => acc + (novosPremios[p]?.length || 0) * valorPremios[p],
        0
      );
      setResumoFinanceiro({ totalArrecadado, totalPremiosPagos });
      return false; // parar finalização automática
    }

    return true; // continuar sorteio
  };

  const reiniciarPremios = () => {
    setPremios({ 25: [], 50: [], 75: [], 100: [] });
    setEtapasAlcancadas([]);
    setBolasPremioDesbloqueadas({});
    setResumoFinanceiro(null);
  };

  return {
    premios,
    etapasAlcancadas,
    bolasPremioDesbloqueadas,
    resumoFinanceiro,
    atualizarPremios,
    reiniciarPremios
  };
}
