
import { supabase } from '../../utils/supabaseClient';

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { codigo, numero } = req.body;

    if (!codigo || typeof numero !== "number") {
      return res.status(400).json({ error: "Dados inválidos" });
    }

    // Remove entrada anterior
    await supabase.from("temp_bolinhas").delete().eq("codigoSorteio", codigo);

    const { error } = await supabase.from("temp_bolinhas").insert([
      {
        codigoSorteio: codigo,
        numero: numero
      }
    ]);

    if (error) {
      return res.status(500).json({ error: "Erro ao salvar a bolinha" });
    }

    console.log("📥 Bolinha salva no Supabase:", numero, "para", codigo);
    return res.status(200).json({ status: "ok" });
  }

  if (req.method === "GET") {
    const codigo = req.query.codigo;

    if (!codigo) {
      return res.status(400).json({ error: "Código não fornecido" });
    }

    const { data, error } = await supabase
      .from("temp_bolinhas")
      .select("numero")
      .eq("codigoSorteio", codigo)
      .single();

    if (error || !data) {
      return res.status(200).json({ numero: null });
    }

    await supabase.from("temp_bolinhas").delete().eq("codigoSorteio", codigo);

    return res.status(200).json({ numero: data.numero });
  }

  return res.status(405).json({ error: "Método não permitido" });
}
