import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const SimuladorBingo = () => {
  const [dadosSorteio, setDadosSorteio] = useState(null);
  const [sorteioFinalizado, setSorteioFinalizado] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const exemploDados = {
    quantidadeCartelas: 1200,
    valorCartela: 5.0,
    premio25: 100.0,
    premio50: 150.0,
    premio75: 200.0,
    premio100: 300.0,
    totalArrecadado: 6000.0,
    totalPremiosPagos: 750.0,
    codigoSorteio: 'BLIN20250418',
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

  useEffect(() => {
    if (sorteioFinalizado) {
      salvarSorteio(dadosSorteio);
    }
  }, [sorteioFinalizado]);

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Simulador de Bingo</h1>
      <button
        onClick={() => {
          setMensagem('');
          setDadosSorteio(exemploDados);
          setSorteioFinalizado(true);
        }}
        style={{
          backgroundColor: 'darkgreen',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          border: '2px solid white',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
      >
        Finalizar Sorteio (e Salvar)
      </button>
      {mensagem && (
        <p style={{ marginTop: '20px', fontWeight: 'bold', color: mensagem.includes('✅') ? 'limegreen' : 'red' }}>
          {mensagem}
        </p>
      )}
    </div>
  );
};

export default SimuladorBingo;
