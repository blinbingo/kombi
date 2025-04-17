
import React, { useState } from "react";
import SimuladorBingo from "../components/SimuladorBingo";
import { gerarCartelasOtimizadas } from "../components/GeradorCartelas";

export default function DelayLento() {
  const [cartelas, setCartelas] = useState([]);
  const [quantidadeCartelas, setQuantidadeCartelas] = useState(1);
  const [valorCartela, setValorCartela] = useState(1);
  const [tempoDelay, setTempoDelay] = useState(5);
  const [valorPremios, setValorPremios] = useState({ 25: 1, 50: 1, 75: 1, 100: 1 });
  const [titulo, setTitulo] = useState("");
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  const gerarCartelas = () => {
    const novas = gerarCartelasOtimizadas(quantidadeCartelas);
    setCartelas(novas);
  };

  const reiniciar = () => {
    setCartelas([]);
    setMostrarConfirmacao(false);
  };

  return (
    <div className="body">
      {cartelas.length === 0 ? (
        <div className="card">
          <h2>Configurações do Sorteio</h2>
          <label>Título:</label><br />
          <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} /><br />
          <label>Quantas cartelas deseja gerar?</label><br />
          <input type="number" min="1" value={quantidadeCartelas} onChange={(e) => setQuantidadeCartelas(Math.max(1, parseInt(e.target.value) || 1))} /><br />
          <label>Valor da cartela (R$):</label><br />
          <input type="number" min="0" value={valorCartela} onChange={(e) => setValorCartela(Math.max(0, parseFloat(e.target.value) || 0))} /><br />
          <label>Prêmios (R$):</label><br />
          <div>
            {[25, 50, 75, 100].map(p => (
              <div key={p}>
                <label>{p}%: </label>
                <input
                  type="number"
                  min="0"
                  value={valorPremios[p]}
                  onChange={e =>
                    setValorPremios(prev => ({
                      ...prev,
                      [p]: parseFloat(e.target.value) || 0
                    }))
                  }
                />
              </div>
            ))}
          </div>
          <label>Tempo entre bolas (segundos):</label><br />
          <input type="number" min="1" value={tempoDelay} onChange={(e) => setTempoDelay(Math.max(1, parseInt(e.target.value) || 1))} /><br />
          <button className="generate-button" onClick={gerarCartelas}>🎯 Gerar Cartelas</button>
        </div>
      ) : (
        <SimuladorBingo
          cartelas={cartelas}
          tempoDelay={tempoDelay}
          valorCartela={valorCartela}
          valorPremios={valorPremios}
          titulo={titulo}
          onReiniciarSolicitado={() => setMostrarConfirmacao(true)}
        />
      )}
      {mostrarConfirmacao && (
        <div className="confirmacao-popup">
          <p>Deseja realmente reiniciar?</p>
          <button onClick={reiniciar}>❗ Confirmar Reinício</button>
          <button onClick={() => setMostrarConfirmacao(false)}>Cancelar</button>
        </div>
      )}
    </div>
  );
}
