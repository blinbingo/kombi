
import fs from "fs";
import path from "path";
import { useState } from "react";
import DocViewer from "../../components/DocViewer";
import { docs } from "../../lib/docMap";

export async function getStaticProps() {
  const allFolders = ["components", "pages", "styles", "utils"];
  const filesOrganized = {};

  for (const folder of allFolders) {
    const dirPath = path.join(process.cwd(), folder);
    if (!fs.existsSync(dirPath)) continue;

    const files = fs.readdirSync(dirPath).sort();
    filesOrganized[folder] = files.map((file) => {
      const filePath = path.join(dirPath, file);
      const content = fs.readFileSync(filePath, "utf-8");

      return {
        caminho: folder + "/" + file,
        code: content,
        ...(docs[folder + "/" + file] || { titulo: file, descricao: "Sem descrição." })
      };
    });
  }

  const rootFiles = ["next.config.js", "package.json", "README.md"]
    .filter((file) => fs.existsSync(path.join(process.cwd(), file)))
    .map((file) => {
      const content = fs.readFileSync(path.join(process.cwd(), file), "utf-8");
      return {
        caminho: file,
        code: content,
        ...(docs[file] || { titulo: file, descricao: "Sem descrição." })
      };
    });

  filesOrganized["raiz"] = rootFiles;

  return { props: { arquivos: filesOrganized } };
}

export default function Docs({ arquivos }) {
  const [filtro, setFiltro] = useState("");

  const filtrarArquivos = (lista) =>
    lista.filter(({ titulo, descricao, code }) =>
      (titulo + descricao + code).toLowerCase().includes(filtro.toLowerCase())
    );

  return (
    <div style={{ background: "#0f172a", color: "#ffffff", minHeight: "100vh", padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", color: "#00ff88", marginBottom: "1rem" }}>📘 Documentação Técnica</h1>

      <input
        type="text"
        placeholder="Buscar por palavra-chave..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          border: "1px solid #00ff88",
          background: "#0f172a",
          color: "#fff",
          marginBottom: "2rem",
          width: "100%",
        }}
      />

      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ color: "#00ff88" }}>📂 Sumário</h2>
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {Object.entries(arquivos).sort().map(([pasta, lista]) => (
            <li key={pasta} style={{ marginTop: "1rem" }}>
              <strong>{pasta.toUpperCase()}</strong>
              <ul style={{ listStyle: "none", paddingLeft: "1rem" }}>
                {lista.map((arq, idx) => (
                  <li key={idx}>
                    <a href={`#${arq.caminho.replace(/[./]/g, "-")}`} style={{ color: "#38f2a5" }}>
                      {arq.titulo}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      {Object.entries(arquivos).sort().map(([pasta, lista]) => (
        <div key={pasta}>
          <h2 style={{ marginTop: "3rem", color: "#00ff88" }}>{pasta.toUpperCase()}</h2>
          {filtrarArquivos(lista).map((arq, index) => (
            <div id={arq.caminho.replace(/[./]/g, "-")} key={index}>
              <DocViewer title={arq.titulo} description={arq.descricao} code={arq.code} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
