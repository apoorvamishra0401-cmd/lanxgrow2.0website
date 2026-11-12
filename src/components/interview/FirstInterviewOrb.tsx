import { useEffect, useRef } from "react";
import * as THREE from "three";


export type OrbMode = "ready" | "recording" | "uploading" | "complete" | "error";
/** Adapted from the user-owned Lovable CallOrb (12-Nov-2026); visual only, no AI or audio inference. */
export function FirstInterviewOrb({ mode }: { mode: OrbMode }) {
  const host = useRef<HTMLDivElement>(null);
  const currentMode = useRef(mode); currentMode.current = mode;
  useEffect(() => {
    const el = host.current; if (!el) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); }
    catch { el.dataset["fallback"] = "true"; return; }
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 30); camera.position.z = 5.6;
    const css = getComputedStyle(el);
    const color = (name: string) => {
      const probe = document.createElement("span"); probe.style.color = css.getPropertyValue(name).trim(); el.appendChild(probe);
      const resolved = getComputedStyle(probe).color; probe.remove();
      // Canvas resolves modern CSS colours into browser-supported sRGB for Three.js.
      const canvas = document.createElement("canvas"); canvas.width = 1; canvas.height = 1;
      const ctx = canvas.getContext("2d"); if (!ctx) return new THREE.Color();
      ctx.fillStyle = resolved; ctx.fillRect(0, 0, 1, 1); const pixel = ctx.getImageData(0, 0, 1, 1).data;
      return new THREE.Color((pixel[0] ?? 0)/255, (pixel[1] ?? 0)/255, (pixel[2] ?? 0)/255);
    };
    const uniforms = { time: { value: 0 }, energy: { value: 0 }, ambient: { value: 0 }, lightTone: { value: color("--orb-light") }, midTone: { value: color("--orb-copper") }, darkTone: { value: color("--orb-shadow") } };
    const material = new THREE.ShaderMaterial({ uniforms,
      vertexShader: `varying vec3 n; varying vec3 p; uniform float time; uniform float energy; uniform float ambient;
      void main(){ n=normal; p=position; float d=sin(position.y*7.0+time)*sin(position.x*6.0-time*.6); vec3 pos=position+normal*d*(energy*.025+ambient*.004); gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.0); }`,
      fragmentShader: `varying vec3 n; varying vec3 p; uniform float time; uniform float energy; uniform float ambient; uniform vec3 lightTone; uniform vec3 midTone; uniform vec3 darkTone;
      void main(){ vec3 light=normalize(vec3(-.75,1.0,1.1)); float diffuse=dot(normalize(n),light)*.5+.5; float flow=sin(p.y*5.0+p.x*3.0+time*.55)*sin(p.z*5.0-time*.3); diffuse=clamp(diffuse+flow*(energy*.15+ambient*.025),0.0,1.0); vec3 c=mix(darkTone,midTone,smoothstep(.05,.7,diffuse)); c=mix(c,lightTone,pow(diffuse,4.0)*.85); gl_FragColor=vec4(c,1.0); }` });
    const geometry = new THREE.SphereGeometry(1, 96, 64);
    const sphere = new THREE.Mesh(geometry, material); scene.add(sphere);
    const lineMaterial = new THREE.LineBasicMaterial({ color: color("--orb-copper"), transparent: true, opacity: .27 });
    const rings: THREE.LineLoop[] = [];
    for (let i = 0; i < 2; i++) {
      const points = Array.from({ length: 160 }, (_, k) => { const t = k / 160 * Math.PI * 2; return new THREE.Vector3(Math.cos(t) * 1.3, Math.sin(t) * 1.12, 0); });
      const ring = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points), lineMaterial); ring.rotation.set(.7 + i*.8, .45, -.35+i*.7); scene.add(ring); rings.push(ring);
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); el.appendChild(renderer.domElement);
    const resize = () => { const width = el.clientWidth, height = el.clientHeight; renderer.setSize(width, height); camera.aspect = width / Math.max(height, 1); camera.updateProjectionMatrix(); };
    const observer = new ResizeObserver(resize); observer.observe(el); resize();
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0, last = performance.now(), time = 0, energy = 0;
    const draw = (now: number) => {
      const delta = Math.min((now-last)/1000,.05); last=now;
      const mode = currentMode.current;
      energy += ((mode === "recording" ? .38 : 0)-energy)*.18;
      const ambient = mode === "recording" ? 1 : mode === "uploading" ? .55 : mode === "ready" ? .1 : .03;
      if (!reduced.matches) time += delta*(ambient+energy*2);
      uniforms.time.value=time; uniforms.energy.value=reduced.matches ? 0 : energy; uniforms.ambient.value=reduced.matches ? 0 : ambient;
      rings.forEach((ring, i) => { if (!reduced.matches) ring.rotation.z += delta*.018*ambient*(i ? -1 : 1); });
      renderer.render(scene,camera); frame=requestAnimationFrame(draw);
    }; frame=requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); geometry.dispose(); material.dispose(); lineMaterial.dispose(); rings.forEach((r)=>r.geometry.dispose()); renderer.dispose(); renderer.domElement.remove(); };
  }, []);
  return <div className="call-orb" data-mode={mode} ref={host} role="img" aria-label={`Lan-X introduction orb · ${mode}`}><div className="orb-fallback" /><div className="orb-name" aria-hidden="true"><span>Lan-X</span><small>INTRO</small></div></div>;
}