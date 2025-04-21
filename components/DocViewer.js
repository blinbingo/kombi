import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

const DocViewer = ({ title, description, code }) => {
  return (
    <div style={{
      marginBottom: "2rem",
      background: "#0f172a",
      padding: "1rem",
      borderRadius: "12px",
      border: "1px solid #00ff88"
    }}>
      <h2 style={{ color: "#00ff88" }}>{title}</h2>
      <p style={{ color: "#ffffff", marginBottom: "1rem" }}>{description}</p>
      <SyntaxHighlighter language="javascript" style={vscDarkPlus} customStyle={{ borderRadius: "8px", fontSize: "0.75rem" }}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default DocViewer;
