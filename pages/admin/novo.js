import React, { useState } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function NovoSorteio() {
  const [titulo, setTitulo] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [valorCartela, setValorCartela] = useState("");
  const [premios, setPremios] = useState({ 25: "", 50: "", 75: "", 100: "" });
  const [mensagem, setMensagem] = useState("");

  const gerarNumeros = () => {
    const numeros = new Set();
    while (numeros.size < 24) {
      numeros.add(Math.floor(Math.random() * 60) + 1);
    }
    return `{${Array.from(numeros).sort((a, b) => a - b).join(",")}}`;
  };

  const gerarCodigoSorteio = () => {
    const agora = new Date();
    const dia = String(agora.getDate()).padStart(2, "0");
    const mes = String(agora.getMonth() + 1).padStart(2, "0");
    const ano = agora.getFullYear();
    const hora = String(agora.getHours()).padStart(2, "0");
    const minuto = String(agora.getMinutes()).padStart(2, "0");
    const segundo = String(agora.getSeconds()).padStart(2, "0");
    return `BLIN-${dia}${mes}${ano}-${hora}${minuto}${segundo}`;
  };

  const criarSorteio = async () => {
    if (!titulo || !data || !horario || !quantidade || !valorCartela || !premios[25] || !premios[50] || !premios[75] || !premios[100]) {
      setMensagem("Preencha todos os campos.");
      return;
    }

    setMensagem("Criando sorteio...");
    const codigo = gerarCodigoSorteio();
    const dataSorteio = new Date(`${data}T${horario}`);

    const sorteio = {
      codigoSorteio: codigo,
      titulo: titulo,
      data: dataSorteio.toISOString(),
      valorCartela: parseFloat(valorCartela),
      premio25: parseFloat(premios[25]),
      premio50: parseFloat(premios[50]),
      premio75: parseFloat(premios[75]),
      premio100: parseFloat(premios[100]),
    };

    const { error } = await supabase.from("bingo").insert([sorteio]);
    if (error) {
      setMensagem("Erro ao salvar sorteio!");
      return;
    }

    const total = parseInt(quantidade);
    const novasCartelas = [];
    for (let i = 0; i < total; i++) {
      novasCartelas.push({
        codigoSorteio: codigo,
        numeros: gerarNumeros()
      });
    }

    const { error: erroCartelas } = await supabase.from("cartelas").insert(novasCartelas);
    if (erroCartelas) {
      setMensagem("Erro ao salvar cartelas!");
      return;
    }

    setMensagem("✅ Sorteio criado com sucesso!");
  };

  return (
    <div style={{ backgroundColor: "#0f172a", color: "white", minHeight: "100vh", padding: "20px" }}>
      <h1 style={{ textAlign: "center", color: "#00ff00", fontSize: "26px", marginBottom: "20px" }}>
        Criar Novo Sorteio
      </h1>
      <div style={{
        maxWidth: "700px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "12px"
      }}>
        <label style={{ gridColumn: "1 / -1" }}>Título do Sorteio:</label>
        <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} style={{ gridColumn: "1 / -1" }} />

        <label>Data:</label>
        <input type="date" value={data} onChange={e => setData(e.target.value)} />

        <label>Horário:</label>
        <input type="time" value={horario} onChange={e => setHorario(e.target.value)} />

        <label>Quantidade:</label>
        <input type="number" value={quantidade} onChange={e => setQuantidade(e.target.value)} />

        <label>Valor da Cartela:</label>
        <input type="number" value={valorCartela} onChange={e => setValorCartela(e.target.value)} />

        <label>Prêmio 25%:</label>
        <input type="number" value={premios[25]} onChange={e => setPremios(p => ({ ...p, 25: e.target.value }))} />

        <label>Prêmio 50%:</label>
        <input type="number" value={premios[50]} onChange={e => setPremios(p => ({ ...p, 50: e.target.value }))} />

        <label>Prêmio 75%:</label>
        <input type="number" value={premios[75]} onChange={e => setPremios(p => ({ ...p, 75: e.target.value }))} />

        <label>Prêmio 100%:</label>
        <input type="number" value={premios[100]} onChange={e => setPremios(p => ({ ...p, 100: e.target.value }))} />
      </div>

      <div style={{ maxWidth: "700px", margin: "30px auto 0", display: "flex", flexDirection: "column", gap: "10px" }}>
        <button onClick={criarSorteio}>
          Criar Sorteio
        </button>
        {mensagem && (
          <p style={{ textAlign: "center", fontWeight: "bold" }}>
            {mensagem}
          </p>
        )}
      </div>
    </div>
  );
}
