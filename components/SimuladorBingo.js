import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const SimuladorBingo = () => {
  const [dadosSorteio, setDadosSorteio] = useState(null);
  const [sorteioFinalizado, setSorteioFinalizado] = useState(false);

  // Exemplo de dados fictícios de sorteio (substituir pelos reais do seu app)
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
      } else {
        console.log('Sorteio salvo com sucesso!');
      }
    } catch (err) {
      console.error('Erro inesperado ao salvar sorteio:', err);
    }
  };

  // Exemplo de uso: salvar quando finalizar o sorteio
  useEffect(() => {
    if (sorteioFinalizado) {
      salvarSorteio(dadosSorteio);
    }
  }, [sorteioFinalizado]);

  return (
    <div>
      <h1>Simulador de Bingo</h1>
      <button
        onClick={() => {
          setDadosSorteio(exemploDados);
          setSorteioFinalizado(true);
        }}
      >
        Finalizar Sorteio (e Salvar)
      </button>
    </div>
  );
};

export default SimuladorBingo;
