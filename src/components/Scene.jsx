import * as React from "react"
import * as THREE from "three"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { MeshDistortMaterial, Sparkles, Float } from "@react-three/drei"
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js"

// 0 at the top of the page, 1 at the bottom
const scrollProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight
  return max > 0 ? Math.min(window.scrollY / max, 1) : 0
}

// Chrome-like reflections without downloading an HDR
function Studio() {
  const { gl, scene } = useThree()
  React.useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = env
    return () => {
      scene.environment = null
      env.dispose()
      pmrem.dispose()
    }
  }, [gl, scene])
  return null
}

// The hero object: a liquid chrome icosahedron that swings sides and tightens as you scroll
function Core({ compact }) {
  const group = React.useRef()
  const shell = React.useRef()
  const cage = React.useRef()

  useFrame((state, dt) => {
    const p = scrollProgress()
    const g = group.current
    if (!g) return
    // Sit on the right beside the copy. Shrink and recentre while the skill sphere (also on the right) is on screen.
    const skills = document.getElementById(`skills`)
    const r = skills ? skills.getBoundingClientRect() : null
    const inSkills = r && r.top < window.innerHeight * 0.5 && r.bottom > window.innerHeight * 0.5
    const base = compact ? 0.62 : 1
    const side = compact || inSkills ? 0 : 3.0
    const shrink = inSkills ? 0.4 : 1
    g.position.x = THREE.MathUtils.lerp(g.position.x, side, 0.05)
    g.position.y = THREE.MathUtils.lerp(g.position.y, -p * 3, 0.06)
    g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, base * shrink * THREE.MathUtils.lerp(1, 0.7, p), 0.05))
    g.rotation.y += dt * 0.18
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, state.pointer.y * 0.35, 0.05)
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, state.pointer.x * 0.25, 0.05)
    if (cage.current) cage.current.rotation.y -= dt * 0.12
    if (shell.current) shell.current.material.distort = THREE.MathUtils.lerp(0.25, 0.6, p)
  })

  return (
    <group ref={group}>
      <Float speed={1.6} rotationIntensity={0.3} floatIntensity={1.1}>
        <mesh ref={shell}>
          <icosahedronGeometry args={[2.1, 32]} />
          <MeshDistortMaterial color="#d9dce6" metalness={1} roughness={0.08} distort={0.25} speed={2.4} envMapIntensity={1.6} />
        </mesh>
        <mesh ref={cage} scale={1.22}>
          <icosahedronGeometry args={[2.1, 2]} />
          <meshBasicMaterial color="#ff6b4a" wireframe transparent opacity={0.28} toneMapped={false} />
        </mesh>
      </Float>
    </group>
  )
}

// Neon orbits that tilt with the pointer
function Orbits() {
  const a = React.useRef()
  const b = React.useRef()
  const c = React.useRef()
  useFrame((state, dt) => {
    if (a.current) a.current.rotation.z += dt * 0.12
    if (b.current) b.current.rotation.x += dt * 0.08
    if (c.current) c.current.rotation.y -= dt * 0.1
  })
  return (
    <group rotation={[0.4, 0.2, 0]}>
      <mesh ref={a} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[3.6, 0.012, 16, 220]} />
        <meshBasicMaterial color="#ff6b4a" toneMapped={false} />
      </mesh>
      <mesh ref={b} rotation={[0.9, Math.PI / 3, 0]}>
        <torusGeometry args={[4.4, 0.01, 16, 220]} />
        <meshBasicMaterial color="#7c5cff" toneMapped={false} />
      </mesh>
      <mesh ref={c} rotation={[1.4, 0, 0.5]}>
        <torusGeometry args={[5.2, 0.008, 16, 220]} />
        <meshBasicMaterial color="#5ef2ff" toneMapped={false} />
      </mesh>
    </group>
  )
}

// Pointer and scroll drive the camera so the whole page feels like one moving space
function CameraRig() {
  const { camera, pointer } = useThree()
  useFrame(() => {
    const p = scrollProgress()
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.6, 0.04)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 0.4 - p * 1.2, 0.04)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 9 + p * 2.5, 0.04)
    camera.lookAt(0, -p * 1.2, 0)
  })
  return null
}

function Scene() {
  const { size } = useThree()
  const compact = size.width < 768
  const warm = React.useRef()
  const cool = React.useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (warm.current) {
      warm.current.position.set(Math.cos(t * 0.5) * 6, Math.sin(t * 0.4) * 3, 5)
    }
    if (cool.current) {
      cool.current.position.set(Math.cos(t * 0.35 + 3) * 7, Math.sin(t * 0.5 + 1) * 4, -3)
    }
  })

  return (
    <>
      <Studio />
      <ambientLight intensity={0.25} />
      <pointLight ref={warm} color="#ff6b4a" intensity={60} distance={30} />
      <pointLight ref={cool} color="#7c5cff" intensity={50} distance={30} />
      <Core compact={compact} />
      <Orbits />
      <Sparkles count={140} scale={[18, 12, 10]} size={2.2} speed={0.35} color="#ffb199" opacity={0.7} />
      <CameraRig />
    </>
  )
}

// The full-screen WebGL layer that sits behind the page
export default function SceneCanvas() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 9], fov: 40, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
      style={{ position: `fixed`, inset: 0, zIndex: 0, pointerEvents: `none` }}
    >
      <Scene />
    </Canvas>
  )
}
