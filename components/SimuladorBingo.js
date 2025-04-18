import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const SimuladorBingo = () => {
  const [bolasSelecionadas, setBolasSelecionadas] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [sorteioFinalizado, setSorteioFinalizado] = useState(false);

  const gerarCodigoSorteio = () => {
    const agora = new Date();
    const dia = String(agora.getDate()).padStart(2, '0');
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const ano = agora.getFullYear();
    const hora = String(agora.getHours()).padStart(2, '0');
    const minuto = String(agora.getMinutes()).padStart(2, '0');
    const segundo = String(agora.getSeconds()).padStart(2, '0');
    return \`BLIN-\${dia}\${mes}\${ano}-\${hora}\${minuto}\${segundo}\`;
  };

  const salvarSorteio = async (dados) => {
    try {
      const { error } = await supabase.from('bingo').insert([dados]);
      if (error) {
        console.error('Erro ao salvar no Supabase:', error.message);
        setMensagem('❌ Erro ao salvar sorteio.');
      } else {
        console.log('Sorteio salvo com sucesso!');
        setMensagem('✅ Sorteio salvo com sucesso!');
      }
    } catch (err) {
      console.error('Erro inesperado ao salvar sorteio:', err);
      setMensagem('❌ Erro inesperado ao salvar sorteio.');
    }
  };

  const finalizarSorteio = () => {
    const dados = {
      quantidadeCartelas: 1200,
      valorCartela: 5.0,
      premio25: 100.0,
      premio50: 150.0,
      premio75: 200.0,
      premio100: 300.0,
      totalArrecadado: 6000.0,
      totalPremiosPagos: 750.0,
      codigoSorteio: gerarCodigoSorteio(),
    };
    salvarSorteio(dados);
    setSorteioFinalizado(true);
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ color: 'white' }}>Simulador de Bingo</h1>

      {/* Aqui estariam seus painéis, bolas, cartelas, cronômetro, etc */}

      <button
        onClick={finalizarSorteio}
        style={{
          backgroundColor: 'green',
          color: 'white',
          padding: '10px 20px',
          fontSize: '1rem',
          borderRadius: '8px',
          border: '2px solid white',
          cursor: 'pointer',
        }}
      >
        Finalizar Sorteio (e Salvar)
      </button>

      {mensagem && (
        <p
          style={{
            marginTop: '20px',
            fontWeight: 'bold',
            color: mensagem.includes('✅') ? 'limegreen' : 'red',
          }}
        >
          {mensagem}
        </p>
      )}
    </div>
  );
};

export default SimuladorBingo;
