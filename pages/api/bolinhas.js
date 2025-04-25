
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { codigo, numero } = req.body;

  if (!codigo || typeof numero !== "number") {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  // Apenas loga por enquanto
  console.log("🎯 Nova bolinha recebida:", numero, "| Sorteio:", codigo);

  // Em breve: salvar ou emitir essa bolinha para a interface do sorteio

  return res.status(200).json({ status: "ok", recebido: numero });
}
