export function sortearBolasAutomaticamente(sorteio, delay, onFinish) {
  const todasAsBolas = Array.from({ length: 75 }, (_, i) => i + 1);
  const bolasRestantes = todasAsBolas.filter(
    (b) => !sorteio.bolas_sorteadas?.includes(b)
  );

  let index = 0;

  const sortear = () => {
    if (index >= bolasRestantes.length) {
      if (onFinish) onFinish();
      return;
    }

    const bola = bolasRestantes[index];
    // Aqui você pode chamar uma função que salva a bola no Supabase

    console.log('Bola sorteada:', bola); // Apenas para debug

    index++;
    setTimeout(sortear, delay);
  };

  sortear();
}
