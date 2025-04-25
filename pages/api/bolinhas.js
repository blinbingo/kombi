
let memoriaBolinhas = {}; // Objeto em memória por codigoSorteio

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { codigo, numero } = req.body;

    if (!codigo || typeof numero !== "number") {
      return res.status(400).json({ error: "Dados inválidos" });
    }

    memoriaBolinhas[codigo] = numero;
    console.log("📥 Bolinha recebida:", numero, "| Código:", codigo);
    return res.status(200).json({ status: "ok" });
  }

  if (req.method === "GET") {
    const codigo = req.query.codigo;

    if (!codigo) {
      return res.status(400).json({ error: "Código não fornecido" });
    }

    const numero = memoriaBolinhas[codigo] || null;
    // Limpa após leitura para evitar repetição
    if (numero) delete memoriaBolinhas[codigo];

    return res.status(200).json({ numero });
  }

  return res.status(405).json({ error: "Método não permitido" });
}
