import fs from "fs";
import path from "path";
import DocViewer from "@/components/DocViewer";
import { docs } from "@/lib/docMap";

export async function getStaticProps() {
  const baseDir = path.join(process.cwd(), "components");
  const files = fs.readdirSync(baseDir);

  const arquivos = files.map((file) => {
    const filePath = path.join(baseDir, file);
    const content = fs.readFileSync(filePath, "utf-8");

    return {
      caminho: "components/" + file,
      code: content,
      ...(docs["components/" + file] || { titulo: file, descricao: "Sem descrição." })
    };
  });

  return { props: { arquivos } };
}

export default function Docs({ arquivos }) {
  return (
    <div style={{ padding: "2rem", background: "#020617", minHeight: "100vh" }}>
      <h1 style={{ color: "#00ff88", fontSize: "2rem", marginBottom: "2rem" }}>Documentação Técnica (Automática)</h1>
      {arquivos.map((arquivo, index) => (
        <DocViewer key={index} title={arquivo.titulo} description={arquivo.descricao} code={arquivo.code} />
      ))}
    </div>
  );
}
