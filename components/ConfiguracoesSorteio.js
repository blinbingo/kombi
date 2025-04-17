export function salvarConfiguracoes(titulo, quantidade, valorCartela, tempoDelay, valorPremios) {
  localStorage.setItem("bingoConfig", JSON.stringify({
    titulo, quantidade, valorCartela, tempoDelay, valorPremios
  }));
}

export function carregarConfiguracoes() {
  try {
    return JSON.parse(localStorage.getItem("bingoConfig"));
  } catch {
    return null;
  }
}
