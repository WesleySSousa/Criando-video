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


function actor(sp, x, z, k = 1, o = {}) { const mm = A.bb(sp, { k, shadow: o.shadow ?? false }); if (o.flip) mm.scale.x = -1; const g = new THREE.Group(); g.add(mm); g.position.set(x, o.y ?? 0, z); const sh = blob(.4 * k, .5); sh.position.y = .015; g.add(sh); g.userData.cam = true; scene.add(g); return g; }
function lamp(col, i, d, pos) { const l = new THREE.PointLight(col, i, d, 2); l.position.copy(pos); scene.add(l); return l; }
let scene, post_o = {};
const faceCam = () => scene.traverse(g => { if (g.userData.cam) g.rotation.y = Math.atan2(camera.position.x - g.position.x, camera.position.z - g.position.z); });
const px = (g, sp, k, ix, iy, dz = 0) => V3(g.position.x + (ix - sp.w / 2) * A.SPX * k, (sp.h - iy) * A.SPX * k, g.position.z + dz);

// ============ QC1: Praca do Despertar, 3/4 lateral ============
function buildQC1() {
  scene = new THREE.Scene(); const fogc = '#e3d19a'; scene.fog = new THREE.FogExp2(fogc, .02); scene.background = new THREE.Color(fogc);
  const sun = new THREE.DirectionalLight('#f6f2e4', 1.6); sun.position.set(-6, 14, 12); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, near: 1, far: 50 }); sun.shadow.bias = -.0006;
  scene.add(sun, new THREE.HemisphereLight('#f4ecc8', '#9a8a5c', 1.0));
  scene.add(mesh(new THREE.BoxGeometry(160, .4, 160).translate(0, -.2, -30), mat(cobbles(96, 96, { seed: 9, cell: 8, cols: ['#8a7b58', '#ac9c74', '#c8b88e', '#dfd2a8', '#f0e6c4'] }))));
  // fonte seca ao fundo
  const fm = mat(cobbles(64, 64, { seed: 2, cell: 6, cols: ['#a89a74', '#c0b28a', '#d8cba2', '#ece2bc'] }));
  const basin = mesh(new THREE.CylinderGeometry(3.4, 3.6, 1.0, 24).translate(-5, .5, -16), fm); scene.add(basin);
  scene.add(mesh(new THREE.CylinderGeometry(.5, .8, 2.6, 12).translate(-5, 1.3, -16), fm));
  const MM = mats(); [['wall2', 'roof2'], ['wall3', 'roof3'], ['wall', 'roof'], ['wall2', 'roof']].forEach(([w, r], i) => scene.add(house({ x: -26 + i * 15, z: -34, w: 9, d: 6, h: 6 + (i % 2) * 2, wall: w, roof: r, windows: [] })));
  // multidao parada de pe, desfocada
  const Rr = mulberry(5), hc = ['#1a1410', '#3a2a1c', '#6a4a2a', '#c8a050', '#2a2a30'], cc = ['#2e4a6a', '#6a3a3a', '#3a5a3a', '#5a5a66', '#7a5a8a', '#8a7a4a'];
  const spr = []; for (let i = 0; i < 14; i++) spr.push(A.crowdSide(hc[i % 5], cc[i % 6], ['#2a2a30', '#3a3328', '#40454e'][i % 3]));
  for (let i = 0; i < 170; i++) { const x = (Rr() - .5) * 44, z = -3.6 - Rr() * 30; if (Math.abs(x) < 3 && z > -7) continue; const g = actor(spr[i % 14], x, z, 3.1 * (.92 + Rr() * .16), { flip: Rr() > .5 }); g.userData.cam = true; }
  const teco = A.makeSprite('teco','menu'), K = .9, tg = actor(teco, -.3, 0, K, { shadow: true });
  const bz = px(tg, teco, K, 16.5, 41); lamp('#ff9a3a', 2.6, 4, bz.clone().add(V3(.05, .15, .6)));
  const g1 = glow('#ffa040', .5, 1.2); g1.position.copy(bz).add(V3(0, 0, .1)); scene.add(g1);
  lamp('#fff2d6', 1.2, 9, V3(-2.2, 2.6, 4)); 
  const pm = new THREE.Mesh(new THREE.PlaneGeometry(.68, .68), new THREE.MeshBasicMaterial({ map: A.menuPanel(), transparent: true, opacity: .94, color: new THREE.Color(1.1, 1.12, 1.15), fog: false }));
  pm.position.set(.36, 1.1, .15); pm.rotation.y = -.6; scene.add(pm);
  const pg = glow('#b6ccf4', 1.5, .5); pg.position.set(.36, 1.1, .05); scene.add(pg);
  const dust = particles(70, (i, t, o) => { o.x = ((i * 7.3) % 4) - 2; o.y = .2 + (i * 3.7 % 3); o.z = ((i * 5.1) % 5) - 2; o.a = .3; o.s = .02; o.r = 1; o.g = .95; o.b = .8; }, { soft: 1 }); dust.userData.update(0); scene.add(dust);
  camera.position.set(-1.9, 2.15, 3.7); camera.up.set(0, 1, 0); camera.lookAt(-.02, 1.0, 0); camera.fov = 36; camera.updateProjectionMatrix();
  post_o = { exposure: 1.1, bloom: [.5, .8, .85], vig: .5, warm: .12, sat: 1.04, tilt: [10, .16, .3], aper: 150, focusPt: V3(0, 1.0, 0) };
}

// ============ QC2: Beco dos Sinos, Teco ajoelhado e Lira em primeiro plano ============
function buildQC2() {
  scene = new THREE.Scene(); const fogc = '#3b2a66'; scene.fog = new THREE.FogExp2(fogc, .028); scene.background = new THREE.Color(fogc);
  const key = new THREE.DirectionalLight('#b79cf2', 1.9); key.position.set(-5, 14, 16); key.target.position.set(0, 0, 0); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -16, right: 16, top: 22, bottom: -22, near: 1, far: 70 }); key.shadow.bias = -.0008; scene.add(key, key.target, new THREE.HemisphereLight('#7a66c0', '#2c2046', 1.5));
  scene.add(mesh(new THREE.BoxGeometry(5.2, .4, 70).translate(0, -.2, -22), mat(cobbles(96, 96, { seed: 4, cell: 8, cols: ['#1c1730', '#322a4a', '#4a4068', '#645a88', '#8174a8'] }))));
  scene.add(mesh(new THREE.BoxGeometry(60, .3, 80).translate(0, -.45, -22), mat(rock(96, 96, { cols: ['#120e22', '#1e1834', '#2c2448', '#3c335c'] }))));
  const walls = ['wall3', 'wall2', 'wall', 'wall3', 'wall2', 'wall'], roofs = ['roof2', 'roof', 'roof2', 'roof3', 'roof2', 'roof'];
  for (const s of [-1, 1]) for (let i = 0; i < 8; i++) {
    const w = 6.2, d = 5, h = 4.6 + (i % 2) * .7, z = 8 - i * 6.3;
    scene.add(house({ x: s * (2.6 + d / 2), z, w, d, h, wall: walls[(i + (s > 0 ? 2 : 0)) % 6], roof: roofs[(i + (s > 0 ? 3 : 0)) % 6], door: i % 3 ? -1 : 1, windows: [], ry: -s * Math.PI / 2, chimney: i % 2 === 0 }));
    for (const dz of [-1.6, 1.6]) { const pos = V3(s * 2.1, h - 1.0, z + dz);
      const g = new THREE.Mesh(new THREE.CylinderGeometry(.2, .2, .44, 10), new THREE.MeshStandardMaterial({ color: '#ffb0c8', emissive: '#ff6a9c', emissiveIntensity: 2.6, roughness: .8 })); g.position.copy(pos); scene.add(g);
      const gl = glow('#ff7aa8', 1.6, .6); gl.position.copy(pos); scene.add(gl);
      const rope = new THREE.Mesh(new THREE.BoxGeometry(.04, .6, .04), new THREE.MeshBasicMaterial({ color: '#150e18' })); rope.position.copy(pos).add(V3(s * .12, .5, 0)); scene.add(rope);
      const bell = new THREE.Mesh(new THREE.ConeGeometry(.17, .26, 8), new THREE.MeshStandardMaterial({ color: '#b07a30', metalness: .3, roughness: .6, emissive: '#3a2008', emissiveIntensity: .6 })); bell.position.copy(pos).add(V3(0, 1.1, 0)); bell.rotation.x = Math.PI; scene.add(bell); }
  }
  [[2.5, 0], [-3, 1], [-9, 0], [-14, 1]].forEach(([z, k]) => lamp(k ? '#ff9cc0' : '#ffb27a', 5, 11, V3(k ? -1.6 : 1.6, 3.2, z)));
  // fundo: Gritador caido, brasa apagada, machado, Ouvidor curvado (8-10 m de Teco)
  const GX = -.7, GZ = -3.4;
  const gs = A.gritadorSide(); actor(gs, GX, GZ, 1.0);
  const axe = A.axeSide(); actor(axe, GX + 1.5, GZ + .3, 1.0);
  const dl = A.deadLantern(); actor(dl, GX + .55, GZ + .5, 1.5);
  const ouv = actor(A.makeSprite('ouvidor', 'bent'), GX + .1, GZ - 1.6, .95, { flip: true, shadow: false });
  lamp('#4fd8a0', 2.2, 5, V3(GX + 1.2, 2.2, GZ - 2.4));
  const ash = particles(110, (i, t, o) => { const r = h2(i, 1, 3), r2 = h2(i, 2, 3), r3 = h2(i, 3, 3), u = (r * 1.4) % 1; o.x = GX + (r2 - .5) * 2.4 + Math.sin(u * 5 + i) * .25; o.z = GZ + (r3 - .5) * 1.2; o.y = .2 + u * 3.4; o.a = .8 * (1 - u * .6); o.s = .05 + r2 * .05; o.r = .9; o.g = .86; o.b = 1; }, { soft: 1 }); ash.userData.update(0); scene.add(ash);
  // primeiro plano
  const teco = A.makeSprite('teco','kneel'), lira = A.makeSprite('lira','stand');
  const tg = actor(teco, -.3, 4.0, .9, { shadow: true }), lg = actor(lira, .36, 3.8, .85, { flip: true, shadow: true });
  const bz = px(tg, teco, .9, 16.5, 39 + 12); lamp('#ff8a2a', 1.4, 3, bz.clone().add(V3(.1, .1, .5)));
  const g1 = glow('#ff9a40', .35, 1.2); g1.position.copy(bz).add(V3(0, 0, .1)); scene.add(g1);
  const g2 = glow('#ffe080', .2, .7); g2.position.copy(px(lg, lira, .85, 15, 32)).add(V3(0, 0, .1)); scene.add(g2);
  lamp('#ffc4dc', 1.6, 6, V3(.3, 1.9, 5.6)); lamp('#c8b4ff', 1.4, 6, V3(-1, 1.0, 5.4));
  camera.position.set(.2, 1.4, 6.35); camera.up.set(0, 1, 0); camera.lookAt(0, .95, 4.0); camera.fov = 55; camera.updateProjectionMatrix();
  post_o = { exposure: 1.3, bloom: [.6, .8, .9], vig: .62, warm: .06, sat: 1.12, tilt: [8, .14, .3], aper: 3, focusPt: V3(0, .85, 4.0) };
}

// ============ QC3: Boca do Fosso, 3/4 lateral ============
function buildQC3() {
  scene = new THREE.Scene(); const fogc = '#0c3a30'; scene.fog = new THREE.FogExp2(fogc, .028); scene.background = new THREE.Color(fogc);
  const hemi = new THREE.HemisphereLight('#4a9a82', '#0a1a16', 1.5), key = new THREE.DirectionalLight('#88e0c0', .9); key.position.set(-3, 14, 12); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -12, right: 12, top: 14, bottom: -14, near: 1, far: 50 }); scene.add(hemi, key);
  const rk = mat(rock(128, 128, { seed: 7, cols: ['#0a1612', '#16282a', '#243c3e', '#37524f', '#4c6a64', '#6a8880'] })), rk2 = mat(rock(96, 96, { seed: 2, cols: ['#08120f', '#122220', '#1e3432', '#2e4846'] }));
  const RP = 2.9, PX0 = 2.7, PZ = -3.0;
  const sh = new THREE.Shape(); sh.moveTo(-16, -22); sh.lineTo(18, -22); sh.lineTo(18, 12); sh.lineTo(-16, 12); sh.closePath();
  const hole = new THREE.Path(); hole.absarc(PX0, -PZ, RP, 0, Math.PI * 2, true); sh.holes.push(hole);
  const fg = new THREE.ExtrudeGeometry(sh, { depth: .6, bevelEnabled: false, curveSegments: 40 }); fg.rotateX(-Math.PI / 2); fg.translate(0, -.6, 0); scene.add(mesh(fg, rk));
  const wall = mesh(new THREE.CylinderGeometry(RP + .05, RP + .05, 15, 40, 1, true).translate(PX0, -7.5, PZ), rk2); wall.material = wall.material.clone(); wall.material.side = THREE.BackSide; wall.castShadow = false; scene.add(wall);
  for (let i = 0; i < 112; i++) { const th = i / 16 * Math.PI * 2 - Math.PI * .5, r = (1.75 + RP) / 2, y = -.18 - i * .1; const b = box(RP - 1.7 + .02, .22, 1.08, rk); b.position.set(PX0 + Math.cos(th) * r, y - .22, PZ + Math.sin(th) * r); b.rotation.y = -th; b.castShadow = false; scene.add(b); }
  const bottom = new THREE.Mesh(new THREE.CircleGeometry(RP, 32), new THREE.MeshBasicMaterial({ color: new THREE.Color(.4, 3.0, 1.7), fog: false })); bottom.rotation.x = -Math.PI / 2; bottom.position.set(PX0, -11.8, PZ); scene.add(bottom);
  for (const [y, i, d] of [[-1.5, 14, 14], [-5, 26, 16], [-9, 36, 14]]) lamp('#42ffa4', i, d, V3(PX0, y, PZ));
  for (const [y, s, i] of [[.5, 3.2, .18]]) { const m = glow('#3dffa6', s, i); m.position.set(PX0, y, PZ); scene.add(m); }
  const Rr = mulberry(21), addRock = (x, z, w, h, d) => { const b = box(w, h, d, rk2); b.position.set(x, -.6, z); b.rotation.y = (Rr() - .5) * .5; scene.add(b); };
  for (let i = 0; i < 8; i++) addRock(-9 - 3 * (i % 3) + Rr() * 2, -16 + i * 3 + Rr(), 4 + Rr() * 3, 6 + Rr() * 8, 4 + Rr() * 3);
  for (let i = 0; i < 9; i++) addRock(-10 + i * 3.6 + Rr(), -17 - Rr() * 2, 4 + Rr() * 3, 10 + Rr() * 8, 4 + Rr() * 2);
  for (let i = 0; i < 6; i++) addRock(14 + 2 * (i % 2) + Rr(), -14 + i * 3.5, 4 + Rr() * 3, 6 + Rr() * 8, 4 + Rr() * 3);
  const cm = new THREE.MeshStandardMaterial({ color: '#7affc0', emissive: '#2cf08c', emissiveIntensity: 1.2, roughness: .35, flatShading: true });
  const cry = (p, dir, s) => { const g = new THREE.Mesh(new THREE.ConeGeometry(.11 * s, .75 * s, 5), cm); g.position.copy(p); g.quaternion.setFromUnitVectors(V3(0, 1, 0), dir.clone().normalize()); g.translateY(.3 * s); scene.add(g); };
  for (let i = 0; i < 46; i++) { const a = Rr() * 6.28, y = -.8 - Rr() * 10.5, p = V3(PX0 + Math.cos(a) * (RP - .1), y, PZ + Math.sin(a) * (RP - .1)); const gl = glow('#5affb0', .8 + Rr() * .4, .55); gl.position.copy(p); scene.add(gl); cry(p, V3(-Math.cos(a), .35, -Math.sin(a)), .9 + Rr() * .9); }
  for (const [x, z, n] of [[-3.5, -6, 4], [8, -8, 4], [-2, -12, 3], [6.5, -13, 3], [-6.5, -2, 3]]) { for (let k = 0; k < n; k++) cry(V3(x + (Rr() - .5), 0, z + (Rr() - .5)), V3((Rr() - .5) * .8, 1, (Rr() - .5) * .8), 1.2 + Rr() * 1.2); const gl = glow('#5affb0', 1.6, .4); gl.position.set(x, .8, z); scene.add(gl); lamp('#3dffa0', 3, 7, V3(x, 1.1, z)); }
  for (let i = 0; i < 14; i++) { const p = V3(-10 + Rr() * 22, 1 + Rr() * 7, -15 - Rr() * 2); const gl = glow('#5affb0', .8, .3); gl.position.copy(p); scene.add(gl); cry(p, V3(Rr() - .5, Rr() - .5, 1), 1.5 + Rr()); }
  const sp = particles(120, (i, t, o) => { const r = h2(i, 5, 1), r2 = h2(i, 6, 1), u = (r2 * 3) % 1, a = r * 6.28, rr = Math.sqrt(h2(i, 7, 1)) * (RP - .3); o.x = PX0 + Math.cos(a) * rr; o.z = PZ + Math.sin(a) * rr; o.y = -8 + u * 12; o.a = .55 * Math.sin(u * 3.1416); o.s = .04 + r * .04; o.r = .5; o.g = 1; o.b = .7; }, { soft: 1 }); sp.userData.update(0); scene.add(sp);
  const teco = A.makeSprite('teco','stand'), lira = A.makeSprite('lira','stand'), K = .9;
  const tg = actor(teco, .7, 0, K, { shadow: true }), lg = actor(lira, .08, .12, .85, { shadow: true });
  const bz = px(tg, teco, K, 16.5, 41); lamp('#ff8428', 2.2, 4.5, bz.clone().add(V3(.35, .7, .9)));
  const g1 = glow('#ff9440', .5, 1.4); g1.position.copy(bz).add(V3(0, 0, .1)); scene.add(g1);
  const g2 = glow('#ffe080', .22, .8); g2.position.copy(px(lg, lira, .85, 15, 32)).add(V3(0, 0, .1)); scene.add(g2);
  lamp('#9ae8cc', 1.8, 8, V3(-1.5, 2.2, 3));
  camera.position.set(-.9, 2.5, 3.2); camera.up.set(0, 1, 0); camera.lookAt(.5, .95, -.3); camera.fov = 37; camera.updateProjectionMatrix();
  post_o = { exposure: 1.25, bloom: [.75, .8, .8], vig: .66, warm: .02, sat: 1.1, tilt: [8, .15, .3], aper: 22, focusPt: V3(.5, .9, 0) };
}

[buildQC1, buildQC2, buildQC3][QC - 1]();
faceCam();
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
