// BRASA VIVA ep.1: previa visual (3 quadros-chave). ?qc=1 | 2 | 3
import * as THREE from 'three';
import { makePost } from './post_ts.js';
import { cobbles, rock, texOf, PX, ramp, hex, h2, glow, blob, billboard, mulberry } from './px.js';
import { mat, mesh, house, mats, box } from './kit.js';
import { particles, flick } from './fx.js';
import * as A from './art.js';

const W = innerWidth, H = innerHeight, Q = new URLSearchParams(location.search), QC = +(Q.get('qc') ?? 1), SS = +(Q.get('ss') ?? 2);
const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H);
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('stage').appendChild(renderer.domElement);
renderer.domElement.style.width = W + 'px'; renderer.domElement.style.height = H + 'px';
const camera = new THREE.PerspectiveCamera(30, W / H, .3, 400);
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);

// sprite deitado no chao (imagem para cima = -z)
function flat(sp, k = 1, y = .02, rot = 0, lit = true) {
  const g = new THREE.Group(), m = billboard(sp.tex, sp.w * A.SPX * k, sp.h * A.SPX * k, { em: sp.em, emCol: '#fff', emI: 2, shadow: false, receive: false, ay: .5 });
  m.rotation.x = -Math.PI / 2; g.add(m); g.position.y = y; g.rotation.y = rot; return g;
}
function stand(sp, x, z, k = 1, o = {}) { const m = A.bb(sp, { k, ...o }); const g = new THREE.Group(); g.add(m); g.position.set(x, 0, z); const sh = blob(.45 * k, .5); sh.position.y = .015; g.add(sh); g.userData.k = k; return g; }
function face(g, cam) { g.rotation.y = Math.atan2(cam.position.x - g.position.x, cam.position.z - g.position.z); }
function lamp(col, i, d, pos, shadow = false) { const l = new THREE.PointLight(col, i, d, 2); l.position.copy(pos); l.castShadow = shadow; if (shadow) { l.shadow.bias = -.004; l.shadow.mapSize.set(1024, 1024); } return l; }

let scene, post_o = {}, tiltPt = null, setup = {};

// ============ QC1: P1, Praca do Despertar, insercao de topo ============
function buildQC1() {
  scene = new THREE.Scene(); const fogc = '#e3d19a'; scene.fog = new THREE.FogExp2(fogc, .016); scene.background = new THREE.Color(fogc);
  const sun = new THREE.DirectionalLight('#f6f2e4', 1.5); sun.position.set(-4, 30, 9); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -10, right: 10, top: 10, bottom: -10, near: 1, far: 60 }); sun.shadow.bias = -.0006;
  scene.add(sun, new THREE.HemisphereLight('#f4ecc8', '#9a8a5c', 1.0));
  const floorM = mat(cobbles(96, 96, { seed: 9, cell: 8, cols: ['#8a7b58', '#ac9c74', '#c8b88e', '#dfd2a8', '#f0e6c4'] }));
  scene.add(mesh(new THREE.BoxGeometry(60, .4, 60).translate(0, -.2, 0), floorM));
  // multidao anonima (pontinhos de gente), desfocada
  const R = mulberry(5), hc = ['#1a1410', '#3a2a1c', '#6a4a2a', '#c8a050', '#2a2a30'], cc = [['#2e4a6a', '#4a6a8a', '#6a8aaa'], ['#6a3a3a', '#8a5a4a', '#aa7a5a'], ['#3a5a3a', '#5a7a4a', '#7a9a6a'], ['#5a5a66', '#7a7a88', '#9a9aa8']];
  for (let i = 0; i < 16; i++) { const sp = A.crowdTop([hc[i % 5]], cc[i % 4]), f = flat(sp, .9, .02, R() * 6.28); let x, z; do { x = (R() - .5) * 9; z = (R() - .5) * 13 - .3; } while (Math.abs(x) < 1.9 && z > -2.4 && z < 2.4); f.position.x = x; f.position.z = z; scene.add(f); }
  // Teco visto de cima
  const K = .62, teco = flat(A.tecoTop(), K, .03); teco.position.set(-.05, .03, -1.25); scene.add(teco);
  const px = (x, y) => V3((x - 32) * A.SPX * K - .05, 0, (y - 40) * A.SPX * K - 1.25);   // pixel do sprite -> mundo
  const brasa = px(57.5, 67.5); const L = lamp('#ff9a3a', 3.2, 4, brasa.clone().setY(.7)); scene.add(L);
  const gl = glow('#ffa040', .55, 1.2); gl.position.copy(brasa).setY(.2); scene.add(gl);
  const gl2 = glow('#ff9030', .25, 1.6); gl2.position.copy(brasa).setY(.25); scene.add(gl2);
  // Menu: painel flutuando a frente das maos
  const pm = new THREE.Mesh(new THREE.PlaneGeometry(1.75, 1.75), new THREE.MeshBasicMaterial({ map: A.menuPanel(), transparent: true, opacity: .93, color: new THREE.Color(1.08, 1.1, 1.12), fog: false }));
  pm.position.set(.05, 1.05, .55); pm.up.set(0, 0, -1); pm.lookAt(V3(0, 12, 2.2)); scene.add(pm);
  const pg = glow('#b6ccf4', 2.8, .55); pg.position.set(.05, .9, .55); scene.add(pg);
  const refl = new THREE.Mesh(new THREE.PlaneGeometry(1.6, .12), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.6, 1.7, 1.9), transparent: true, opacity: .16, fog: false, depthWrite: false })); refl.position.set(.05, 1.07, .1); refl.rotation.copy(pm.rotation); refl.rotateZ(.9); refl.rotation.order = pm.rotation.order; scene.add(refl);
  const dust = particles(60, (i, t, o) => { o.x = ((i * 7.3) % 5) - 2.5; o.y = .5 + (i * 3.7 % 4); o.z = ((i * 5.1) % 7) - 3.5; o.a = .25; o.s = .045; o.r = 1; o.g = .95; o.b = .8; }, { soft: 1 }); dust.userData.update(0); scene.add(dust);
  camera.position.set(0, 13.5, 1.6); camera.up.set(0, 0, -1); camera.lookAt(0, 0, -.05); camera.fov = 30; camera.updateProjectionMatrix();
  tiltPt = px(12, 74).add(V3(.25, .3, .55));   // entre a mao e o painel
  post_o = { exposure: 1.1, bloom: [.5, .8, .85], vig: .5, warm: .12, sat: 1.04, tilt: [15, .11, .28], aper: 160, focusPt: tiltPt };
}

// ============ QC2: P8, Beco dos Sinos, top-down ============
function buildQC2() {
  scene = new THREE.Scene(); const fogc = '#3b2a66'; scene.fog = new THREE.FogExp2(fogc, .03); scene.background = new THREE.Color(fogc);
  const key = new THREE.DirectionalLight('#b79cf2', 1.9); key.position.set(5, 26, 16); key.target.position.set(0, 0, -4); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -16, right: 16, top: 22, bottom: -22, near: 1, far: 70 }); key.shadow.bias = -.0008; scene.add(key, key.target, new THREE.HemisphereLight('#7a66c0', '#2c2046', 1.5));
  scene.add(mesh(new THREE.BoxGeometry(5.2, .4, 60).translate(0, -.2, -12), mat(cobbles(96, 96, { seed: 4, cell: 8, cols: ['#1c1730', '#322a4a', '#4a4068', '#645a88', '#8174a8'] }))));
  scene.add(mesh(new THREE.BoxGeometry(60, .3, 70).translate(0, -.45, -12), mat(rock(96, 96, { cols: ['#120e22', '#1e1834', '#2c2448', '#3c335c'] }))));
  const MM = mats(); const walls = ['wall3', 'wall2', 'wall', 'wall3', 'wall2', 'wall'], roofs = ['roof2', 'roof', 'roof2', 'roof3', 'roof2', 'roof'];
  const lants = [];
  for (const s of [-1, 1]) for (let i = 0; i < 6; i++) {
    const w = 6.2, d = 5, h = 4.6 + (i % 2) * .7, z = 6 - i * 6.3;
    const hs = house({ x: s * (2.6 + d / 2), z, w, d, h, wall: walls[(i + (s > 0 ? 2 : 0)) % 6], roof: roofs[(i + (s > 0 ? 3 : 0)) % 6], door: i % 3 ? -1 : 1, windows: [], ry: s * Math.PI / 2 * -1, chimney: i % 2 === 0 }); scene.add(hs);
    // lanternas de papel rosa no beiral + sino de bronze mudo
    for (const dz of [-1.6, 1.6]) {
      const pos = V3(s * 2.1, h - .75, z + dz); lants.push(pos);
      const g = new THREE.Mesh(new THREE.CylinderGeometry(.17, .17, .38, 10), new THREE.MeshStandardMaterial({ color: '#ffb0c8', emissive: '#ff6a9c', emissiveIntensity: 2.6, roughness: .8 })); g.position.copy(pos); scene.add(g);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(.12, .2, .08, 8), new THREE.MeshStandardMaterial({ color: '#2a1810' })); cap.position.copy(pos).add(V3(0, .3, 0)); scene.add(cap);
      const gl = glow('#ff7aa8', 1.2, .55); gl.position.copy(pos); scene.add(gl);
      const rope = new THREE.Mesh(new THREE.BoxGeometry(.04, .55, .04), new THREE.MeshBasicMaterial({ color: '#150e18' })); rope.position.copy(pos).add(V3(s * .12, .55, 0)); scene.add(rope);
      const bell = new THREE.Mesh(new THREE.ConeGeometry(.17, .26, 8), new THREE.MeshStandardMaterial({ color: '#b07a30', metalness: .3, roughness: .6, emissive: '#3a2008', emissiveIntensity: .6 })); bell.position.copy(pos).add(V3(0, 1.1, 0)); bell.rotation.x = Math.PI; scene.add(bell);
    }
  }
  // fiacao com lanternas atravessando o beco
  for (const z of [-12]) { const c = new THREE.Mesh(new THREE.BoxGeometry(5, .04, .04), new THREE.MeshBasicMaterial({ color: '#150e18' })); c.position.set(0, 4.2, z); scene.add(c);
    const g = new THREE.Mesh(new THREE.CylinderGeometry(.22, .22, .45, 10), new THREE.MeshStandardMaterial({ color: '#ffb0c8', emissive: '#ff6a9c', emissiveIntensity: 2.4 })); g.position.set(.3, 3.9, z); scene.add(g); const gl = glow('#ff7aa8', 2.0, .7); gl.position.set(.3, 3.9, z); scene.add(gl); lants.push(V3(.3, 3.9, z)); }
  [[-9, 0], [0, 1], [6, 0], [-14, 1]].forEach(([z, k]) => { const p = lamp(k ? '#ff9cc0' : '#ffb27a', 5, 11, V3(k ? -1 : 1.4, 3.4, z)); scene.add(p); });
  // personagens
  camera.position.set(0, 17.6, 9.8); camera.up.set(0, 1, 0); camera.lookAt(0, 0, -2.0); camera.fov = 30; camera.updateProjectionMatrix();
  const GZ = -6.2;
  const grit = A.gritadorTop(); const gf = flat(grit, 1.2, .03, .35); gf.position.set(-.1, .03, GZ); scene.add(gf);
  const axe = flat(A.axeFlat(), 1.15, .03, -.7); axe.position.set(1.35, .03, GZ + .9); scene.add(axe);
  const dl = stand(A.deadLantern(), -1.15, GZ + .8, 1.1, { shadow: true }); scene.add(dl); face(dl, camera);
  const Rr = mulberry(8); const ad = A.ashDot();
  for (let i = 0; i < 34; i++) { const f = flat(ad, .5 + Rr() * .7, .035, Rr() * 6.28); const a = Rr() * 6.28, r = .6 + Rr() * 1.9; f.position.set(-.1 + Math.cos(a) * r * 1.1, .035, GZ + Math.sin(a) * r * .9); scene.add(f); }
  const ouv = stand(A.ouvidor(), .15, GZ - .9, 1.05, { emI: 1.1 }); scene.add(ouv); face(ouv, camera);
  const eg = glow('#5ff0a8', 1.6, .35); eg.position.set(.15, 3.8, GZ - .6); scene.add(eg); const el = lamp('#5ff0a8', 3, 9, V3(.15, 3.2, GZ + .4)); scene.add(el);
  const ash = particles(110, (i, t, o) => { const r = h2(i, 1, 3), r2 = h2(i, 2, 3), r3 = h2(i, 3, 3), u = (r * 1.4) % 1; o.x = -.1 + (r2 - .5) * 2.2 + Math.sin(u * 5 + i) * .25; o.z = GZ + (r3 - .5) * 1.6; o.y = .2 + u * 4.2; o.a = .8 * (1 - u * .6); o.s = .04 + r2 * .05; o.r = .9; o.g = .86; o.b = 1; }, { soft: 1 }); ash.userData.update(0); scene.add(ash);
  const teco = stand(A.tecoBack(), -1.9, 2.4, 1.0); const lira = stand(A.liraBack(), -1.35, 2.95, 1.0);
  scene.add(teco, lira); face(teco, camera); face(lira, camera);
  const tl = V3(-1.9 - .38, .45, 2.4 + 0); const tb = lamp('#ff8a2a', 2.3, 5, tl.clone().add(V3(.1, .6, .9))); scene.add(tb);
  const tg = glow('#ff9a40', 1.0, 1.5); tg.position.copy(tl).add(V3(0, 0, .15)); scene.add(tg);
  const lg = glow('#ffe080', .3, .7); lg.position.set(-1.35 + .23, .27, 3.05); scene.add(lg);
  scene.add(lamp('#c8b4ff', 2.2, 7, V3(-1.5, 2.2, 5.2)));
  tiltPt = V3(0, 1.2, GZ);
  post_o = { exposure: 1.3, bloom: [.6, .8, .9], vig: .62, warm: .06, sat: 1.12, tilt: [9, .06, .36], aper: 220, focusPt: tiltPt };
}

// ============ QC3: P12, Boca do Fosso ============
function buildQC3() {
  scene = new THREE.Scene(); const fogc = '#0c3a30'; scene.fog = new THREE.FogExp2(fogc, .028); scene.background = new THREE.Color(fogc);
  const hemi = new THREE.HemisphereLight('#4a9a82', '#0a1a16', 1.5), key = new THREE.DirectionalLight('#88e0c0', .9); key.position.set(3, 20, 14); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -12, right: 12, top: 14, bottom: -14, near: 1, far: 50 }); scene.add(hemi, key);
  const rk = mat(rock(128, 128, { seed: 7, cols: ['#0a1612', '#16282a', '#243c3e', '#37524f', '#4c6a64', '#6a8880'] })), rk2 = mat(rock(96, 96, { seed: 2, cols: ['#08120f', '#122220', '#1e3432', '#2e4846'] }));
  const RP = 2.9;
  // piso com buraco circular
  const sh = new THREE.Shape(); sh.moveTo(-14, -14); sh.lineTo(14, -14); sh.lineTo(14, 10); sh.lineTo(-14, 10); sh.closePath();
  const hole = new THREE.Path(); hole.absarc(0, 5.2, RP, 0, Math.PI * 2, true); sh.holes.push(hole);
  const fg = new THREE.ExtrudeGeometry(sh, { depth: .6, bevelEnabled: false, curveSegments: 40 }); fg.rotateX(-Math.PI / 2); fg.translate(0, -.6, 0);
  scene.add(mesh(fg, rk));
  // parede do poco + escada em espiral (7 terracos)
  const wall = mesh(new THREE.CylinderGeometry(RP + .05, RP + .05, 15, 40, 1, true).translate(0, -7.5, -5.2), rk2); wall.material = wall.material.clone(); wall.material.side = THREE.BackSide; wall.castShadow = false; scene.add(wall);
  const N = 7 * 16; const stepM = rk;
  for (let i = 0; i < N; i++) { const th = i / 16 * Math.PI * 2 + Math.PI * .5, r = (1.75 + RP) / 2, y = -.18 - i * .1; const b = box(RP - 1.7 + .02, .22, 1.08, stepM); b.position.set(Math.cos(th) * r, y - .22, -5.2 + Math.sin(th) * r); b.rotation.y = -th; b.castShadow = false; scene.add(b); }
  const bottom = new THREE.Mesh(new THREE.CircleGeometry(RP, 32), new THREE.MeshBasicMaterial({ color: new THREE.Color(.4, 3.0, 1.7), fog: false })); bottom.rotation.x = -Math.PI / 2; bottom.position.set(0, -11.8, -5.2); scene.add(bottom);
  const bg = glow('#4dffb0', 7.5, 1.3); bg.position.set(0, -11.4, -5.2);  scene.add(bg);
  const bg2 = glow('#7affc8', 3, 1.0); bg2.position.set(0, -9, -5.2);  scene.add(bg2);
  for (const [y, i, d] of [[-1.5, 14, 14], [-5, 26, 16], [-9, 36, 14]]) scene.add(lamp('#42ffa4', i, d, V3(0, y, -5.2)));
  const mist = glow('#3dffa6', 6.5, .45); mist.position.set(0, .6, -5.2); scene.add(mist);
  // paredoes da caverna
  const Rr = mulberry(21);
  const rocks = []; const addRock = (x, z, w, h, d) => { const b = box(w, h, d, rk2); b.position.set(x, -.6, z); b.rotation.y = (Rr() - .5) * .5; scene.add(b); rocks.push(b); };
  for (let i = 0; i < 9; i++) addRock(-9 + Rr() * 2 - 3 * (i % 3), -14 + i * 2.2 + Rr(), 4 + Rr() * 3, 6 + Rr() * 8, 4 + Rr() * 3);
  for (let i = 0; i < 9; i++) addRock(9 - Rr() * 2 + 3 * (i % 3), -14 + i * 2.2 + Rr(), 4 + Rr() * 3, 6 + Rr() * 8, 4 + Rr() * 3);
  for (let i = 0; i < 7; i++) addRock(-10 + i * 3.4 + Rr(), -15 - Rr() * 2, 4 + Rr() * 3, 10 + Rr() * 8, 4 + Rr() * 2);
  // cristais verdes: parede do poco, borda e paredoes
  const cm = new THREE.MeshStandardMaterial({ color: '#7affc0', emissive: '#2cf08c', emissiveIntensity: 2.6, roughness: .35, flatShading: true });
  const cry = (p, dir, s) => { const g = new THREE.Mesh(new THREE.ConeGeometry(.11 * s, .75 * s, 5), cm); g.position.copy(p); g.quaternion.setFromUnitVectors(V3(0, 1, 0), dir.clone().normalize()); g.translateY(.3 * s); scene.add(g); return g; };
  for (let i = 0; i < 46; i++) { const a = Rr() * 6.28, y = -.8 - Rr() * 10.5, p = V3(Math.cos(a) * (RP - .1), y, -5.2 + Math.sin(a) * (RP - .1)); const gl = glow('#5affb0', .8 + Rr() * .4, .55); gl.position.copy(p); scene.add(gl); cry(p, V3(-Math.cos(a), .35, -Math.sin(a)), .9 + Rr() * .9); }
  for (const [x, z, n] of [[-4.5, -1.8, 5], [4.3, -3.5, 4], [-5.4, -6.5, 6], [5.6, -8, 5], [-3.2, -9.8, 4], [3.4, -10.5, 5], [-7, -3.5, 4], [7.2, -5, 5]]) { for (let k = 0; k < n; k++) { const p = V3(x + (Rr() - .5) * 1.0, 0, z + (Rr() - .5) * 1.0); cry(p, V3((Rr() - .5) * .8, 1, (Rr() - .5) * .8), 1.3 + Rr() * 1.4); } const gl = glow('#5affb0', 1.8, .55); gl.position.set(x, .8, z); scene.add(gl); const l = lamp('#3dffa0', 4, 7, V3(x, 1.1, z)); scene.add(l); }
  for (let i = 0; i < 18; i++) { const p = V3((Rr() - .5) * 18, 1 + Rr() * 8, -12 - Rr() * 2.5); const gl = glow('#5affb0', .9, .5); gl.position.copy(p); scene.add(gl); cry(p, V3((Rr() - .5), (Rr() - .5), 1), 1.5 + Rr()); }
  // poeira / esporos subindo do buraco
  const sp = particles(120, (i, t, o) => { const r = h2(i, 5, 1), r2 = h2(i, 6, 1), u = (r2 * 3) % 1; const a = r * 6.28, rr = Math.sqrt(h2(i, 7, 1)) * (RP - .3); o.x = Math.cos(a) * rr; o.z = -5.2 + Math.sin(a) * rr; o.y = -8 + u * 12; o.a = .55 * Math.sin(u * 3.1416); o.s = .05 + r * .05; o.r = .5; o.g = 1; o.b = .7; }, { soft: 1 }); sp.userData.update(0); scene.add(sp);
  // Teco e Lira, de costas, diante do Fosso (Lira a ~0,5 m atras)
  camera.position.set(0, 16.2, 10.4); camera.up.set(0, 1, 0); camera.lookAt(0, -2.0, -4.3); camera.fov = 30; camera.updateProjectionMatrix();
  const teco = stand(A.tecoBack(), .15, -.85, 1.0, { shadow: false }), lira = stand(A.liraBack(), -.45, -.3, 1.0, { shadow: false }); scene.add(teco, lira); face(teco, camera); face(lira, camera);
  const tl = V3(.15 - .38, .45, -.85), tb = lamp('#ff8428', 2.2, 5, tl.clone().add(V3(-.1, .55, .9))); scene.add(tb);
  const tg = glow('#ff9440', 1.0, 1.7); tg.position.copy(tl).add(V3(0, 0, .15)); scene.add(tg);
  const lg = glow('#ffe080', .3, .7); lg.position.set(-.45 + .23, .27, -.25); scene.add(lg);
  scene.add(lamp('#9ae8cc', 2.4, 7, V3(.2, 2.2, 1.9)));
  tiltPt = V3(.15, .8, -.85);
  post_o = { exposure: 1.25, bloom: [.75, .8, .8], vig: .66, warm: .02, sat: 1.1, tilt: [16, .05, .3], aper: 300, focusPt: tiltPt };
}

[buildQC1, buildQC2, buildQC3][QC - 1]();
const post = makePost(renderer, scene, camera, W, H, { ssaa: SS });
window.render = () => {
  const o = post_o; renderer.toneMappingExposure = o.exposure;
  post.bloom.strength = o.bloom[0]; post.bloom.radius = o.bloom[1]; post.bloom.threshold = o.bloom[2];
  const Vu = post.vig.uniforms; Vu.amt.value = o.vig; Vu.warm.value = o.warm; Vu.sat.value = o.sat; Vu.contrast.value = .26; Vu.fade.value = 1;
  camera.updateMatrixWorld(); scene.updateMatrixWorld();
  const p = o.focusPt.clone().project(camera);
  post.dof.focus = camera.position.distanceTo(o.focusPt); post.dof.aper = o.aper; post.dof.maxCoc = 24;
  post.dof.tiltAmt = o.tilt[0]; post.dof.tiltC = p.y * .5 + .5; post.dof.tiltW = o.tilt[1]; post.dof.tiltF = o.tilt[2];
  post.composer.render();
};
window.DUR = 1; window.READY = true;
