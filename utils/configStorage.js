// configStorage.js
export function salvarConfiguracoes(config) {
  localStorage.setItem("bingoConfig", JSON.stringify(config));
}

export function carregarConfiguracoes() {
  const config = localStorage.getItem("bingoConfig");
  return config ? JSON.parse(config) : null;
}
