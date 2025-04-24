
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSorteioByCodigo } from '../../utils/supabase/getSorteioByCodigo';
import { sortearBolasAutomaticamente } from '../../utils/sorteio/sortearBolasAutomaticamente';
import PainelControle from '../../components/PainelControle';
import CartelasPremiadas from '../../components/CartelasPremiadas';
import Ranking from '../../components/Ranking';
import HistoricoBolas from '../../components/HistoricoBolas';

export default function SimuladorDelay() {
  const router = useRouter();
  const { codigo } = router.query;
  const [sorteio, setSorteio] = useState(null);
  const [delay, setDelay] = useState(2000); // delay padrão de 2 segundos
  const [emAndamento, setEmAndamento] = useState(false);
  const [reiniciar, setReiniciar] = useState(false);

  useEffect(() => {
    if (codigo) {
      carregarDados();
    }
  }, [codigo]);

  const carregarDados = async () => {
    const dados = await getSorteioByCodigo(codigo);
    setSorteio(dados);
  };

  const iniciarSorteio = () => {
    if (sorteio) {
      setEmAndamento(true);
      sortearBolasAutomaticamente(sorteio, delay, () => {
        setEmAndamento(false);
      });
    }
  };

  const handleReiniciar = () => {
    setReiniciar(true);
    setTimeout(() => setReiniciar(false), 100); // força recarregar filhos
  };

  return (
    <div className="simulador-delay">
      <h1>Simulador com Delay - Código: {codigo}</h1>

      <PainelControle
        delay={delay}
        setDelay={setDelay}
        onIniciar={iniciarSorteio}
        onReiniciar={handleReiniciar}
        emAndamento={emAndamento}
      />

      {sorteio && !reiniciar && (
        <>
          <HistoricoBolas codigo={codigo} />
          <Ranking codigo={codigo} />
          <CartelasPremiadas codigo={codigo} />
        </>
      )}
    </div>
  );
}
