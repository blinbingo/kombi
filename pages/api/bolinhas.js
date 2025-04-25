
import { supabase } from '../../utils/supabaseClient';

export default async function handler(req, res) {
  console.log("🔔 API /api/bolinhas foi chamada. Método:", req.method);

  if (req.method === "POST") {
    const { codigo, numero } = req.body;
    console.log("📩 Recebido no corpo:", req.body);

    if (!codigo || typeof numero !== "number") {
      console.log("❌ Dados inválidos:", { codigo, numero });
      return res.status(400).json({ error: "Dados inválidos" });
    }

    // Remove entrada anterior
    const { error: deleteError } = await supabase
      .from("temp_bolinhas")
      .delete()
      .eq("codigoSorteio", codigo);

    if (deleteError) {
      console.log("⚠️ Erro ao tentar deletar antiga bolinha:", deleteError);
    }

    // Insere nova bolinha
    const { error: insertError } = await supabase
      .from("temp_bolinhas")
      .insert([{ codigoSorteio: codigo, numero }]);

    if (insertError) {
      console.log("❌ Erro ao inserir bolinha:", insertError);
      return res.status(500).json({ error: "Erro ao salvar a bolinha" });
    }

    console.log("✅ Bolinha salva com sucesso:", numero, "para", codigo);
    return res.status(200).json({ status: "ok" });
  }

  if (req.method === "GET") {
    const codigo = req.query.codigo;
    console.log("🔍 Buscando bolinha para o código:", codigo);

    if (!codigo) {
      return res.status(400).json({ error: "Código não fornecido" });
    }

    const { data, error } = await supabase
      .from("temp_bolinhas")
      .select("numero")
      .eq("codigoSorteio", codigo)
      .single();

    if (error || !data) {
      console.log("⚠️ Nenhuma bolinha encontrada ou erro:", error);
      return res.status(200).json({ numero: null });
    }

    // Limpa após leitura
    await supabase.from("temp_bolinhas").delete().eq("codigoSorteio", codigo);
    console.log("📤 Bolinha entregue e apagada:", data.numero);

    return res.status(200).json({ numero: data.numero });
  }

  return res.status(405).json({ error: "Método não permitido" });
}
