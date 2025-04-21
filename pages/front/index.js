
import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [showCadastro, setShowCadastro] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [cadastroSucesso, setCadastroSucesso] = useState(false);

  const handleCadastro = () => {
    setCadastroSucesso(true);
    setTimeout(() => {
      setShowCadastro(false);
      setCadastroSucesso(false);
    }, 1500);
  };

  return (
    <div className="background">
      <header className="topo">
        <img src="/assets/logo.png" alt="Logo" className="logo" />
        <div className="botoes">
          <button className="btn-transparente" onClick={() => setShowLogin(true)}>Entrar</button>
          <button className="btn-verde" onClick={() => setShowCadastro(true)}>Cadastre-se</button>
        </div>
      </header>

      <main className="banner-central">
        <img src="/assets/banner.png" alt="Banner" className="banner-img" />
      </main>

      <div className="icones-flutuantes">
        <Link href="/bingo"><img src="/assets/icon-bingo.svg" alt="Bingo" /></Link>
        <img src="/assets/icon-carta.svg" alt="Cartas" />
        <img src="/assets/icon-contato.svg" alt="Contato" />
      </div>

      {showCadastro && (
        <div className="modal">
          <div className="modal-content">
            <button className="btn-voltar" onClick={() => setShowCadastro(false)}>Voltar</button>
            <h2>Cadastro</h2>
            <input type="text" placeholder="Apelido" />
            <input type="password" placeholder="Senha" />
            <button className="btn-verde" onClick={handleCadastro}>Cadastrar</button>
            {cadastroSucesso && <p className="mensagem">Cadastro salvo</p>}
          </div>
        </div>
      )}

      {showLogin && (
        <div className="modal">
          <div className="modal-content">
            <button className="btn-voltar" onClick={() => setShowLogin(false)}>Voltar</button>
            <h2>Entrar</h2>
            <input type="text" placeholder="Apelido" />
            <input type="password" placeholder="Senha" />
            <button className="btn-verde">Entrar</button>
          </div>
        </div>
      )}
    </div>
  );
}
