import Link from 'next/link';

export default function Home() {
  return (
    <div className="body">
      <div className="card">
        <h1>Bem-vindo ao Bingo Blindado</h1>
        <Link href="/delay-lento"><button className="generate-button">🎯 Começar Delay Lento</button></Link>
      </div>
    </div>
  );
}
