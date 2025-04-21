
import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

const DocViewer = ({ title, description, code }) => {
  const [show, setShow] = useState(false);

  return (
    <div style={{
      marginBottom: "1.5rem",
      padding: "1rem",
      borderRadius: "12px",
      background: "#1e293b",
      border: "1px solid #00ff88"
    }}>
      <h2
        style={{ color: "#00ff88", cursor: "pointer", margin: 0 }}
        onClick={() => setShow(true)}
      >
        {title}
      </h2>
      <p style={{ color: "#ffffff", marginTop: "0.5rem" }}>{description}</p>

      {show && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}>
          <div style={{
            background: "#0f172a",
            padding: "1rem",
            borderRadius: "12px",
            maxHeight: "90vh",
            maxWidth: "90vw",
            overflowY: "auto",
            border: "1px solid #00ff88"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ color: "#00ff88" }}>{title}</h3>
              <button onClick={() => setShow(false)} style={{
                background: "#00ff88",
                color: "#000",
                border: "none",
                borderRadius: "4px",
                padding: "0.3rem 0.8rem",
                cursor: "pointer"
              }}>Fechar</button>
            </div>
            <SyntaxHighlighter language="javascript" style={vscDarkPlus} customStyle={{ fontSize: "0.75rem" }}>
              {code}
            </SyntaxHighlighter>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocViewer;
