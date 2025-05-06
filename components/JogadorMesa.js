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
          padding: '4px 8px',
          borderRadius: 8,
          fontWeight: 'bold',
          transform: `rotate(${rotate}deg)`, // Agora a rotação vai funcionar
        }}
      >
        {nome}
      </div>
    </div>
  );
}
