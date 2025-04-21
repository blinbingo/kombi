
import fs from "fs";
import path from "path";
import { useState } from "react";
import DocViewer from "../../components/DocViewer";
import { docs } from "../../lib/docMap";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function getStaticProps() {
  const projectRoot = process.cwd();
  const validExtensions = [".js", ".jsx", ".ts", ".tsx", ".json", ".md", ".css"];
  const ignoreFolders = [".next", "node_modules", ".git", ".vercel", ".turbo", "public", "out"];

  const getAllFiles = (dirPath) => {
    let results = [];
    const list = fs.readdirSync(dirPath, { withFileTypes: true });

    list.forEach((entry) => {
      const filePath = path.join(dirPath, entry.name);
      const relPath = path.relative(projectRoot, filePath).replace(/\\/g, "/");

      if (entry.isDirectory()) {
        const shouldIgnore = ignoreFolders.some(folder => relPath.startsWith(folder));
        if (!shouldIgnore) {
          results = results.concat(getAllFiles(filePath));
        }
      } else if (validExtensions.includes(path.extname(entry.name))) {
        const content = fs.readFileSync(filePath, "utf-8");
        results.push({
          caminho: relPath,
          titulo: path.basename(relPath),
          descricao: docs[relPath]?.descricao || "Sem descrição.",
          code: content
        });
      }
    });

    return results;
  };

  const arquivos = getAllFiles(projectRoot);

  return { props: { arquivos } };
}

export default function Docs({ arquivos }) {
  const [filtro, setFiltro] = useState("");

  const aplicaFiltro = (lista) => {
    if (!filtro) return lista;
    const termo = filtro.toLowerCase();
    return lista.filter(({ titulo, descricao, code }) =>
      (titulo + descricao + code).toLowerCase().includes(termo)
    );
  };

  const exportarPDF = async () => {
    const container = document.getElementById("documentacao-pdf");
    if (!container) return alert("Não foi possível exportar.");

    const canvas = await html2canvas(container, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("documentacao-bingo.pdf");
  };

  const arquivosFiltrados = aplicaFiltro(arquivos);

  return (
    <div style={{ background: "#0f172a", color: "#ffffff", minHeight: "100vh", padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", color: "#00ff88", marginBottom: "1rem" }}>📘 Documentação Técnica</h1>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
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
            width: "75%",
          }}
        />
        <button
          onClick={exportarPDF}
          style={{
            padding: "0.5rem 1rem",
            marginLeft: "1rem",
            borderRadius: "8px",
            background: "#00ff88",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Exportar PDF
        </button>
      </div>

      <div id="documentacao-pdf">
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {arquivosFiltrados.map((arq, index) => (
            <li key={index} style={{ marginBottom: "2rem" }}>
              <DocViewer title={arq.titulo} description={arq.descricao} code={arq.code} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
