// components/JogadorMesa.js
export default function JogadorMesa({ top, left, rotate, nome }) {
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        transform: `rotate(${rotate}deg)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          transform: `rotate(${-rotate}deg)`,
          backgroundColor: 'white',
          padding: '4px 8px',
          borderRadius: 8,
          fontWeight: 'bold',
        }}
      >
        {nome}
      </div>
    </div>
  );
}
