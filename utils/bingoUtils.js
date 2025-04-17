// bingoUtils.js
export function gerarCartela() {
  const numeros = Array.from({ length: 60 }, (_, i) => i + 1);
  const cartela = new Set();
  while (cartela.size < 24) {
    const numero = numeros[Math.floor(Math.random() * numeros.length)];
    cartela.add(numero);
  }
  return Array.from(cartela);
}

export function gerarCartelasOtimizadas(quantidade) {
  const cartelas = [];
  for (let i = 0; i < quantidade; i++) {
    cartelas.push(gerarCartela());
  }
  return cartelas;
}

// Placeholder para atualizarPremios
export function atualizarPremios(bolas, cartelas, etapasAlcancadas, premios, bolasPremioDesbloqueadas) {
  // lógica virá aqui
  return { atualizados: true };
}
