import React, { useState } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function NovoSorteio() {
  const [horario, setHorario] = useState("");
  const [valorCartela, setValorCartela] = useState("");
  const [premios, setPremios] = useState({ 25: "", 50: "", 75: "", 100: "" });
  const [mensagem, setMensagem] = useState("");
  const [cartelasGeradas, setCartelasGeradas] = useState([]);

  const gerarNumeros = () => {
    const numeros = new Set();
    while (numeros.size < 24) {
      numeros.add(Math.floor(Math.random() * 60) + 1);
    }
    return Array.from(numeros);
  };

  const gerarCodigoSorteio = () => {
    const agora = new Date();
    const dia = String(agora.getDate()).padStart(2, '0');
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const ano = agora.getFullYear();
    const hora = String(agora.getHours()).padStart(2, '0');
    const minuto = String(agora.getMinutes()).padStart(2, '0');
    const segundo = String(agora.getSeconds()).padStart(2, '0');
    return `BLIN-${dia}${mes}${ano}-${hora}${minuto}${segundo}`;
  };

  const exportarCSV = () => {
    const linhas = cartelasGeradas.map((cartela, i) =>
      [`C${String(i + 1).padStart(4, "0")}`, ...cartela].join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + ["CÓDIGO,NUMEROS", ...linhas].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "cartelas.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const criarSorteio = async () => {
    setMensagem("Criando sorteio...");
    const codigo = gerarCodigoSorteio();
    const dataSorteio = new Date();
    const [h, m] = horario.split(":");
    dataSorteio.setHours(Number(h));
    dataSorteio.setMinutes(Number(m));
    const sorteio = {
      codigoSorteio: codigo,
      data: dataSorteio.toISOString(),
      valorCartela: parseFloat(valorCartela),
      premio25: parseFloat(premios[25]),
      premio50: parseFloat(premios[50]),
      premio75: parseFloat(premios[75]),
      premio100: parseFloat(premios[100])
    };

    const { error } = await supabase.from("bingo").insert([sorteio]);
    if (error) {
      setMensagem("Erro ao salvar sorteio!");
      return;
    }

    const novasCartelas = [];
    for (let i = 0; i < 200; i++) {
      novasCartelas.push({ codigoSorteio: codigo, numeros: gerarNumeros() });
    }

    const { error: erroCartelas } = await supabase.from("cartelas").insert(novasCartelas);
    if (erroCartelas) {
      setMensagem("Erro ao salvar cartelas!");
      return;
    }

    setCartelasGeradas(novasCartelas.map(c => c.numeros));
    setMensagem("✅ Sorteio e cartelas criadas com sucesso!");
  };

  return (
    <div style={{ backgroundColor: "#0f172a", color: "white", minHeight: "100vh", padding: "20px" }}>
      <h1 style={{ textAlign: "center", color: "#00ff00", fontSize: "24px" }}>
        Criar Novo Sorteio
      </h1>
      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        <label>Horário do Sorteio (HH:MM):</label>
        <input type="time" value={horario} onChange={e => setHorario(e.target.value)} />

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

        <button onClick={criarSorteio} style={{ marginTop: "12px" }}>
          Criar Sorteio
        </button>

        {cartelasGeradas.length > 0 && (
          <button onClick={exportarCSV} style={{ marginTop: "10px", marginLeft: "10px" }}>
            Exportar Cartelas (.CSV)
          </button>
        )}

        {mensagem && (
          <p style={{ marginTop: "20px", textAlign: "center", fontWeight: "bold" }}>{mensagem}</p>
        )}
      </div>
    </div>
  );
}
