import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import PainelControle from './PainelControle';
import HistoricoBolas from './HistoricoBolas';
import CartelasPremiadas from './CartelasPremiadas';
import RankingCartelas from './RankingCartelas';

const SimuladorBingo = ({ cartelas, config }) => {
  const [bolasSorteadas, setBolasSorteadas] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [finalizado, setFinalizado] = useState(false);

  useEffect(() => {
    if (finalizado) {
      salvarSorteio();
    }
  }, [finalizado]);

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

  const salvarSorteio = async () => {
    const dados = {
      quantidadeCartelas: cartelas.length,
      valorCartela: config.valorCartela,
      premio25: config.premio25,
      premio50: config.premio50,
      premio75: config.premio75,
      premio100: config.premio100,
      totalArrecadado: cartelas.length * config.valorCartela,
      totalPremiosPagos:
        config.premio25 + config.premio50 + config.premio75 + config.premio100,
      codigoSorteio: gerarCodigoSorteio(),
    };

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

  return (
    <div className="simulador">
      <PainelControle
        bolasSorteadas={bolasSorteadas}
        setBolasSorteadas={setBolasSorteadas}
        setFinalizado={setFinalizado}
      />
      <HistoricoBolas bolas={bolasSorteadas} />
      <CartelasPremiadas cartelas={cartelas} bolas={bolasSorteadas} />
      <RankingCartelas cartelas={cartelas} bolas={bolasSorteadas} />

      {mensagem && (
        <div style={{ marginTop: '20px', textAlign: 'center', color: mensagem.includes('✅') ? 'limegreen' : 'red' }}>
          <strong>{mensagem}</strong>
        </div>
      )}
    </div>
  );
};

export default SimuladorBingo;
