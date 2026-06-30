export function LightingSetup() {
  return (
    <>
      <ambientLight intensity={0.04} color="#1a2040" />
      <directionalLight
        position={[8, 3, 6]}
        intensity={2.8}
        color="#fff4e8"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={[-6, -2, -4]} intensity={0.35} color="#4d8cff" />
      <pointLight position={[-4, 2, 3]} intensity={0.6} color="#67d8ff" distance={20} decay={2} />
      <pointLight position={[5, -3, -2]} intensity={0.25} color="#6e5dff" distance={18} decay={2} />
    </>
  );
}
