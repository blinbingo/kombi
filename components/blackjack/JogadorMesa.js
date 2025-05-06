// components/JogadorMesa.js
export default function JogadorMesa({ top, left, rotate, nome }) {
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        transform: 'translate(-50%, -50%)', // centraliza corretamente
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          transform: `rotate(${rotate}deg)`,
          backgroundColor: 'white',
          color: 'black',
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
