
import fs from "fs";
import path from "path";
import { useState } from "react";
import DocViewer from "../../components/DocViewer";
import { docs } from "../../lib/docMap";
import jsPDF from "jspdf";

export async function getStaticProps() {
  const projectRoot = process.cwd();
  const validExtensions = [".js", ".jsx", ".ts", ".tsx", ".json", ".md", ".css"];
  const ignoreFolders = [".next", "node_modules", ".git", ".vercel", ".turbo", "public", "out"];
  const ignoreFiles = ["package-lock.json", "vercel.json"];

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
      } else if (
        validExtensions.includes(path.extname(entry.name)) &&
        !ignoreFiles.includes(entry.name)
      ) {
        const content = fs.readFileSync(filePath, "utf-8");
        results.push({
          pasta: path.dirname(relPath),
          caminho: relPath,
          titulo: path.basename(relPath),
          descricao: docs[relPath]?.descricao || "Sem descrição.",
          code: content
        });
      }
    });

    return results;
  };

  const arquivosBrutos = getAllFiles(projectRoot);

  const agrupados = arquivosBrutos.reduce((acc, arquivo) => {
    if (!acc[arquivo.pasta]) acc[arquivo.pasta] = [];
    acc[arquivo.pasta].push(arquivo);
    return acc;
  }, {});

  return { props: { arquivosPorPasta: agrupados } };
}

export default function Docs({ arquivosPorPasta }) {
  const [filtro, setFiltro] = useState("");

  const aplicaFiltro = (lista) => {
    if (!filtro) return lista;
    const termo = filtro.toLowerCase();
    return lista.filter(({ titulo, descricao, code }) =>
      (titulo + descricao + code).toLowerCase().includes(termo)
    );
  };

  const exportarPDF = () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const margin = 15;
    const maxWidth = 180;

    Object.entries(arquivosPorPasta).sort().forEach(([pasta, arquivos], index) => {
      aplicaFiltro(arquivos).forEach((arq, i) => {
        if (index !== 0 || i !== 0) pdf.addPage();
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text(`Arquivo: ${arq.caminho}`, margin, 20);

        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");
        const descLines = pdf.splitTextToSize(arq.descricao, maxWidth);
        pdf.text("Descrição:", margin, 30);
        pdf.text(descLines, margin, 36);

        pdf.text("Código-fonte:", margin, 48);
        const codeLines = pdf.splitTextToSize(arq.code, maxWidth);
        let y = 54;
        codeLines.forEach((line) => {
          if (y > 280) {
            pdf.addPage();
            y = 20;
          }
          pdf.setFont("courier", "normal");
          pdf.text(line, margin, y);
          y += 5;
        });
      });
    });

    pdf.save("documentacao-completa.pdf");
  };

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

      <div>
        {Object.entries(arquivosPorPasta).sort().map(([pasta, arquivos]) => (
          <div key={pasta}>
            <h2 style={{ color: "#38f2a5", borderBottom: "1px solid #38f2a5", paddingBottom: "0.25rem", marginTop: "2rem" }}>
              📁 {pasta}
            </h2>
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
              {aplicaFiltro(arquivos).map((arq, index) => (
                <li key={index} style={{ marginBottom: "2rem" }}>
                  <DocViewer title={arq.titulo} description={arq.descricao} code={arq.code} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
