// pages/blackjack/index.js
import dynamic from "next/dynamic";

// Importa o componente da mesa com lógica
const MesaJogo = dynamic(() => import("@/components/blackjack/MesaJogo"), {
  ssr: false,
});

export default function BlackjackPage() {
  return <MesaJogo />;
}
