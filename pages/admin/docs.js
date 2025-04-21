
import fs from "fs";
import path from "path";
import { useState } from "react";
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

  const aplicaFiltro = (lista) => {
    if (!filtro) return lista;
    const termo = filtro.toLowerCase();
    return lista.filter(({ titulo, descricao, code }) =>
      (titulo + descricao + code).toLowerCase().includes(termo)
    );
  };

  const exportarPDF = () => {
    const input = document.getElementById("documentacao-pdf");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("documentacao-bingo.pdf");
    });
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

      <div id="documentacao-pdf">
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
            {aplicaFiltro(lista).map((arq, index) => (
              <div id={arq.caminho.replace(/[./]/g, "-")} key={index}>
                <DocViewer title={arq.titulo} description={arq.descricao} code={arq.code} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
