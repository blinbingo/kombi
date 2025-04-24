
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../../utils/supabaseClient";
import CartelasPremiadas from "../../../components/CartelasPremiadas";
import RankingCartelas from "../../../components/RankingCartelas";

export default function SimuladorDelay() {
  const router = useRouter();
  const { codigo } = router.query;

  const [cartelas, setCartelas] = useState([]);
  const [bolasSorteadas, setBolasSorteadas] = useState([]);
  const [etapasAlcancadas, setEtapasAlcancadas] = useState([]);
  const [premios, setPremios] = useState({ 25: null, 50: null, 75: null, 100: null });
  const [bolasPremioDesbloqueadas, setBolasPremioDesbloqueadas] = useState({});
  const [resumoFinanceiro, setResumoFinanceiro] = useState(null);
  const [cronometro, setCronometro] = useState(null);
  const [delay, setDelay] = useState(5);
  const [emAndamento, setEmAndamento] = useState(false);
  const [indexAtual, setIndexAtual] = useState(0);
  const numeros = useRef(Array.from({ length: 60 }, (_, i) => i + 1)).current;
  const intervaloRef = useRef(null);

  useEffect(() => {
    if (!codigo) return;

    const carregarDados = async () => {
      const cartelasRes = await supabase
        .from("cartelas")
        .select("numeros")
        .eq("codigoSorteio", codigo);

      const sorteioRes = await supabase
        .from("bingo")
        .select("delay")
        .eq("codigoSorteio", codigo)
        .single();

      if (cartelasRes.data) {
        setCartelas(cartelasRes.data.map(c => c.numeros));
      }

      if (sorteioRes.data?.delay) {
        setDelay(parseInt(sorteioRes.data.delay));
      }
    };

    carregarDados();
  }, [codigo]);

  useEffect(() => {
    let timer;
    if (cronometro !== null && emAndamento) {
      if (cronometro > 0) {
        timer = setTimeout(() => setCronometro(prev => prev - 1), 1000);
      } else {
        sortearProximaBola();
      }
    }
    return () => clearTimeout(timer);
  }, [cronometro, emAndamento]);

  const embaralhar = (array) => {
    const copia = [...array];
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  };

  const iniciarSorteio = () => {
    if (emAndamento) return;
    setBolasSorteadas([]);
    setEtapasAlcancadas([]);
    setPremios({ 25: null, 50: null, 75: null, 100: null });
    setBolasPremioDesbloqueadas({});
    setResumoFinanceiro(null);
    setIndexAtual(0);
    setEmAndamento(true);
    numeros.sort(() => Math.random() - 0.5); // embaralhar
    setCronometro(delay);
  };

  const sortearProximaBola = () => {
    const disponiveis = numeros.filter((n) => !bolasSorteadas.includes(n));
    if (disponiveis.length === 0) return;

    const proxima = disponiveis[0];
    const novas = [...bolasSorteadas, proxima];
    setBolasSorteadas(novas);
    verificarPremios(novas, proxima);
  };

  const verificarPremios = (bolas, novaBola) => {
    const metas = [25, 50, 75, 100];
    const novasEtapas = [...etapasAlcancadas];
    const novosPremios = { ...premios };
    const novosDesbloqueios = { ...bolasPremioDesbloqueadas };

    for (const meta of metas) {
      if (!novasEtapas.includes(meta)) {
        for (let i = 0; i < cartelas.length; i++) {
          const acertos = cartelas[i].filter((n) => bolas.includes(n));
          const porcentagem = Math.floor((acertos.length / 24) * 100);
          if (porcentagem >= meta && cartelas[i].includes(novaBola)) {
            const ganhadora = "C" + String(i + 1).padStart(4, "0");
            novosPremios[meta] = ganhadora;
            novosDesbloqueios[meta] = novaBola;
            novasEtapas.push(meta);
            break; // para no primeiro
          }
        }
      }
    }

    setPremios(novosPremios);
    setBolasPremioDesbloqueadas(novosDesbloqueios);
    setEtapasAlcancadas(novasEtapas);

    if (novasEtapas.includes(100)) {
      const totalArrecadado = cartelas.length * 10;
      const totalPremiosPagos = 
        (novosPremios[25] ? 10 : 0) +
        (novosPremios[50] ? 20 : 0) +
        (novosPremios[75] ? 200 : 0) +
        (novosPremios[100] ? 500 : 0);
      setResumoFinanceiro({ totalArrecadado, totalPremiosPagos });
      setEmAndamento(false);
      setCronometro(null);
    } else {
      setCronometro(delay);
    }
  };

  const reiniciar = () => {
    clearInterval(intervaloRef.current);
    setBolasSorteadas([]);
    setEtapasAlcancadas([]);
    setPremios({ 25: null, 50: null, 75: null, 100: null });
    setBolasPremioDesbloqueadas({});
    setResumoFinanceiro(null);
    setIndexAtual(0);
    setEmAndamento(false);
    setCronometro(null);
  };

  return (
    <div className="body" style={{ textAlign: "center" }}>
      <h2>Sorteio com Delay - Código: {codigo}</h2>
      {emAndamento && cronometro !== null && (
        <div style={{ fontSize: "1.5rem", marginBottom: 10 }}>
          Próxima bola em: {cronometro}s
        </div>
      )}
      <button className="generate-button" onClick={iniciarSorteio} disabled={emAndamento}>
        ▶️ Iniciar Sorteio
      </button>
      <button onClick={reiniciar} disabled={emAndamento} style={{ marginLeft: 10 }}>
        🔁 Reiniciar
      </button>

      <div className="bingo-board">
        {numeros.map((num) => (
          <div key={num} className={`bola ${bolasSorteadas.includes(num) ? "selecionada" : ""}`}>
            {num}
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
        bolasSelecionadas={bolasSorteadas}
        etapasAlcancadas={etapasAlcancadas}
      />
    </div>
  );
}
