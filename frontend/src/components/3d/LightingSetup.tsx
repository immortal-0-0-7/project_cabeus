export function LightingSetup() {
  return (
    <>
      <hemisphereLight args={['#1c2438', '#050508', 0.82]} />
      <ambientLight intensity={0.4} color="#0a0e16" />
      <directionalLight
        position={[-16, 8, 22]}
        intensity={4}
        color="#ddd4c8"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={[14, 3, -16]} intensity={0.06} color="#243048" />
    </>
  );
}
