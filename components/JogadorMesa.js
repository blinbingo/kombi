// components/JogadorMesa.js
export default function JogadorMesa({ top, left, rotate, nome }) {
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          color: 'black', // cor visível sobre fundo branco
          padding: '4px 8px',
          borderRadius: 8,
          fontWeight: 'bold',
          transform: `rotate(${rotate}deg)`,
        }}
      >
        {nome}
      </div>
    </div>
  );
}
