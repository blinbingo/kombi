
import fs from "fs";
import path from "path";
import { useState, useRef, useEffect } from "react";
import DocViewer from "../../components/DocViewer";
import { docs } from "../../lib/docMap";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function getStaticProps() {
  const allFolders = ["components", "pages", "styles", "utils"];
  const filesOrganized = {};

  for (const folder of allFolders) {
    const dirPath = path.join(process.cwd(), folder);
    if (!fs.existsSync(dirPath)) continue;

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const files = entries.filter((entry) => entry.isFile()).map((entry) => entry.name).sort();

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
  const containerRef = useRef(null);

  useEffect(() => {
    console.log("Arquivos carregados:", arquivos);
  }, [arquivos]);

  if (!arquivos || Object.keys(arquivos).length === 0) {
    return (
      <div style={{ padding: "2rem", background: "#0f172a", color: "#fff" }}>
        <h1>⚠️ Nenhum conteúdo encontrado.</h1>
        <p>Verifique se o arquivo <code>docMap.js</code> está correto e se há arquivos no projeto.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", background: "#0f172a", color: "#fff" }}>
      <h1 style={{ color: "#00ff88" }}>📘 Documentação Técnica</h1>
      <p>Arquivos carregados: {Object.keys(arquivos).length}</p>
    </div>
  );
}
