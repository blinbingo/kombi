export function gerarCartelasOtimizadas(quantidade) {
  const numeros = Array.from({ length: 60 }, (_, i) => i + 1);
  const gerarCartela = () => {
    const cartela = new Set();
    while (cartela.size < 24) {
      const numero = numeros[Math.floor(Math.random() * numeros.length)];
      cartela.add(numero);
    }
    return Array.from(cartela);
  };
  const cartelas = [];
  for (let i = 0; i < quantidade; i++) {
    cartelas.push(gerarCartela());
  }
  return cartelas;
}

export function gerarCodigoCartela(index) {
  return "C" + String(index + 1).padStart(4, "0"); // começa do C0001
}

export function reiniciarSorteioEstado(
  setBolasSelecionadas,
  setPremios,
  setEtapasAlcancadas,
  setBolasPremioDesbloqueadas,
  setResumoFinanceiro,
  setSorteando,
  setContador,
  setPausado,
  jaParouNo100
) {
  setBolasSelecionadas([]);
  setPremios({ 25: [], 50: [], 75: [], 100: [] });
  setEtapasAlcancadas([]);
  setBolasPremioDesbloqueadas({});
  setResumoFinanceiro(null);
  setSorteando(false);
  setContador(null);
  setPausado(false);
  jaParouNo100.current = false;
}
