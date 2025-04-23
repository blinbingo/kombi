import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../../utils/supabaseClient";
import CartelasPremiadas from "../../../components/CartelasPremiadas";
import RankingCartelas from "../../../components/RankingCartelas";

export default function SorteioManual() {
  const router = useRouter();
  const { codigo } = router.query;

  const [cartelas, setCartelas] = useState([]);
  const [bolasSelecionadas, setBolasSelecionadas] = useState([]);
  const [premios, setPremios] = useState({ 25: [], 50: [], 75: [], 100: [] });
  const [etapasAlcancadas, setEtapasAlcancadas] = useState([]);
  const [bolasPremioDesbloqueadas, setBolasPremioDesbloqueadas] = useState({});
  const [resumoFinanceiro, setResumoFinanceiro] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [encerrado, setEncerrado] = useState(false);
  const [confirmar, setConfirmar] = useState(false);

  const numeros = Array.from({ length: 60 }, (_, i) => i + 1);

  useEffect(() => {
    async function carregarCartelas() {
      const { data, error } = await supabase
        .from("cartelas")
        .select("numeros")
        .eq("codigoSorteio", codigo);
      if (!error && data) {
        const lista = data.map((item) => item.numeros);
        setCartelas(lista);
      }
    }
    if (codigo) carregarCartelas();
  }, [codigo]);

  const sortearBola = (num) => {
    if (bolasSelecionadas.includes(num) || encerrado) return;
    const novas = [...bolasSelecionadas, num];
    setBolasSelecionadas(novas);
    atualizarPremios(novas);
  };

  const atualizarPremios = (bolas) => {
    const metas = [25, 50, 75, 100];
    const novaBola = bolas[bolas.length - 1];
    const novasEtapas = [...etapasAlcancadas];
    const novosPremios = { ...premios };
    const novosDesbloqueios = { ...bolasPremioDesbloqueadas };

    metas.forEach((meta) => {
      if (!novasEtapas.includes(meta)) {
        const ganhadoras = [];
        cartelas.forEach((cartela, index) => {
          const acertos = cartela.filter((num) => bolas.includes(num));
          const porcentagem = Math.floor((acertos.length / 24) * 100);
          if (porcentagem >= meta && cartela.includes(novaBola)) {
            ganhadoras.push("C" + String(index + 1).padStart(4, "0"));
          }
        });
        if (ganhadoras.length > 0) {
          novosPremios[meta] = ganhadoras;
          novosDesbloqueios[meta] = novaBola;
          novasEtapas.push(meta);
        }
      }
    });

    setPremios(novosPremios);
    setBolasPremioDesbloqueadas(novosDesbloqueios);
    setEtapasAlcancadas(novasEtapas);

    if (novasEtapas.includes(100)) {
      const totalArrecadado = cartelas.length * 10;
      const totalPremiosPagos =
        (novosPremios[25]?.length || 0) * 10 +
        (novosPremios[50]?.length || 0) * 20 +
        (novosPremios[75]?.length || 0) * 200 +
        (novosPremios[100]?.length || 0) * 500;
      setResumoFinanceiro({ totalArrecadado, totalPremiosPagos });
    }
  };

  const reiniciarTudo = () => {
    setBolasSelecionadas([]);
    setPremios({ 25: [], 50: [], 75: [], 100: [] });
    setEtapasAlcancadas([]);
    setBolasPremioDesbloqueadas({});
    setResumoFinanceiro(null);
    setEncerrado(false);
    setMensagem("");
    setConfirmar(false);
  };

  const encerrarSorteio = async () => {
    const dados = {
      codigoSorteio: codigo,
      bolas: bolasSelecionadas.map(Number),
      premiados: {
        25: Object.fromEntries((premios[25] || []).map((c) => [c, 10])),
        50: Object.fromEntries((premios[50] || []).map((c) => [c, 20])),
        75: Object.fromEntries((premios[75] || []).map((c) => [c, 200])),
        100: Object.fromEntries((premios[100] || []).map((c) => [c, 500]))
      },
      resumo: resumoFinanceiro,
      encerradoEm: new Date().toISOString(),
      valorCartela: 10,
      premio25: 10,
      premio50: 20,
      premio75: 200,
      premio100: 500
    };

    const { error } = await supabase.from("historico").insert([dados]);
    if (error) {
      setMensagem("❌ Erro ao salvar no histórico!");
    } else {
      await supabase.from("bingo").delete().eq("codigoSorteio", codigo);
      setMensagem("✅ Sorteio encerrado e movido para o histórico!");
      setEncerrado(true);
    }
  };

  return (
    <div className="body" style={{ textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <button
          onClick={() => router.push("/admin")}
          style={{
            border: "2px solid #00ff00",
            color: "#00ff00",
            backgroundColor: "transparent",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          ← Voltar
        </button>

        <div style={{ display: "flex", gap: "10px" }}>
          {!confirmar ? (
            <button
              onClick={() => setConfirmar(true)}
              style={{
                padding: "8px 16px",
                border: "2px solid #00ff00",
                backgroundColor: "transparent",
                color: "#00ff00",
                fontWeight: "bold",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              🔁 Reiniciar
            </button>
          ) : (
            <>
              <button
                onClick={reiniciarTudo}
                style={{
                  padding: "8px 16px",
                  border: "2px solid red",
                  backgroundColor: "transparent",
                  color: "red",
                  fontWeight: "bold",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Confirmar Reinício
              </button>
              <button
                onClick={() => setConfirmar(false)}
                style={{
                  padding: "8px 16px",
                  border: "2px solid gray",
                  backgroundColor: "transparent",
                  color: "gray",
                  fontWeight: "bold",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bingo-board">
        {numeros.map((num) => (
          <div
            key={num}
            className={`bola ${bolasSelecionadas.includes(num) ? "selecionada" : ""}`}
            onClick={() => sortearBola(num)}
            style={{ cursor: "pointer" }}
          >
            {num}
          </div>
        ))}
      </div>

      <div style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "6px",
        margin: "20px auto"
      }}>
        {bolasSelecionadas.map((bola, i) => (
          <div
            key={i}
            className="bola"
            style={{ width: "32px", height: "32px", fontSize: "0.85rem" }}
          >
            {bola}
          </div>
        ))}
      </div>

      <CartelasPremiadas
        premios={premios}
        bolasPremioDesbloqueadas={bolasPremioDesbloqueadas}
        resumoFinanceiro={resumoFinanceiro}
      />

      <RankingCartelas
        cartelas={cartelas}
        bolasSelecionadas={bolasSelecionadas}
        etapasAlcancadas={etapasAlcancadas}
      />

      {etapasAlcancadas.includes(100) && !encerrado && (
        <button onClick={encerrarSorteio} style={{
          marginTop: "30px",
          border: "2px solid #00ff00",
          backgroundColor: "transparent",
          color: "#00ff00",
          fontWeight: "bold",
          padding: "10px 20px",
          borderRadius: "6px",
          cursor: "pointer"
        }}>
          ENCERRAR SORTEIO
        </button>
      )}

      {mensagem && (
        <p style={{ marginTop: "20px", fontWeight: "bold", color: mensagem.includes("✅") ? "#00ff00" : "red" }}>
          {mensagem}
        </p>
      )}
    </div>
  );
}
