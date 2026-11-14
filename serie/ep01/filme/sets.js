// LOGADO ep.1: sets (cada um com sua nevoa e luz-chave). Vida real: amarelo-quente dessaturado. Jogo: menta frio / rosa-violeta.
import * as THREE from 'three';
import { PX, ramp, hex, h2, fbm, texOf, cobbles, woodPlanks, plaster, ground, glow, blob, mulberry, billboard } from './px.js';
import { mat, mesh, box, mats, windowQuad } from './kit.js';
import { sky, particles, flick } from './fx.js';
import { bb } from './art.js';
import { sprite } from './chars.js';
import { drawPanel, panelSize } from './hud.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const lerp = (a, b, t) => a + (b - a) * t;
export const clamp01 = x => Math.max(0, Math.min(1, x));
function lamp(g, col, i, d, pos, shadow = false) { const l = new THREE.PointLight(col, i, d, 2); l.position.copy(pos); l.castShadow = shadow; g.add(l); return l; }
function sunLight(g, col, i, pos, ext = 12) { const s = new THREE.DirectionalLight(col, i); s.position.copy(pos); s.castShadow = true; s.shadow.mapSize.set(2048, 2048); Object.assign(s.shadow.camera, { left: -ext, right: ext, top: ext, bottom: -ext, near: 1, far: 60 }); s.shadow.bias = -.0007; g.add(s, s.target); return s; }
const plane = (w, h, map, o = {}) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map, transparent: !!o.tr, fog: o.fog ?? false, side: THREE.DoubleSide, color: o.color ? new THREE.Color(o.color) : 0xffffff })); return m; };
function canvasTex(c) { const t = texOf(c); t.magFilter = THREE.NearestFilter; return t; }

// ============ CAMPINA MANSA (jogo, ao ar livre) ============
const TOD = [  // hora do jogo -> parametros de luz
  { h: 8.0, sun: '#eafff4', si: 1.7, sunp: [-7, 15, 9], hs: '#d6f5e6', hg: '#79a98f', hi: 1.05, fog: '#bfe6d2', fd: .018, top: '#78bcd4', mid: '#a6dccd', hor: '#cdeedd', exp: 1.15 },
  { h: 13.0, sun: '#f4fff8', si: 1.9, sunp: [-3, 18, 8], hs: '#dcf8ea', hg: '#82b496', hi: 1.1, fog: '#c4ecd8', fd: .017, top: '#6cb4d0', mid: '#a0dccc', hor: '#cfeedd', exp: 1.18 },
  { h: 16.0, sun: '#f0ffea', si: 1.8, sunp: [6, 13, 8], hs: '#d4f2e0', hg: '#7aa88a', hi: 1.05, fog: '#bce6cc', fd: .019, top: '#70b4cc', mid: '#a4d8c4', hor: '#cdeacf', exp: 1.15 },
  { h: 17.8, sun: '#ff74b4', si: 1.7, sunp: [14, 4.6, 7], hs: '#f4b0dc', hg: '#356a76', hi: 1.25, fog: '#d890bc', fd: .02, top: '#5a3a8a', mid: '#c870b8', hor: '#ff9ac8', exp: 1.2 },
  { h: 18.58, sun: '#d884e6', si: 1.2, sunp: [14, 5, 7], hs: '#c090e0', hg: '#2f6070', hi: 1.45, fog: '#a878c4', fd: .022, top: '#2c2468', mid: '#8a5ab8', hor: '#e88ac8', exp: 1.25 },
  { h: 18.8, sun: '#9a78f0', si: .9, sunp: [14, 5, 7], hs: '#9a80e0', hg: '#2a5568', hi: 1.5, fog: '#7058b0', fd: .024, top: '#1c1856', mid: '#6a48a8', hor: '#b078d0', exp: 1.28 },
];
export function todAt(hr) {
  let a = TOD[0], b = TOD[TOD.length - 1];
  for (let i = 0; i < TOD.length - 1; i++) if (hr >= TOD[i].h && hr <= TOD[i + 1].h) { a = TOD[i]; b = TOD[i + 1]; break; }
  if (hr <= TOD[0].h) b = a; if (hr >= TOD[TOD.length - 1].h) a = b;
  const k = a === b ? 0 : (hr - a.h) / (b.h - a.h), C = (x, y) => new THREE.Color(x).lerp(new THREE.Color(y), k);
  return { sun: C(a.sun, b.sun), si: lerp(a.si, b.si, k), sunp: a.sunp.map((v, i) => lerp(v, b.sunp[i], k)), hs: C(a.hs, b.hs), hg: C(a.hg, b.hg), hi: lerp(a.hi, b.hi, k), fog: C(a.fog, b.fog), fd: lerp(a.fd, b.fd, k), top: C(a.top, b.top), mid: C(a.mid, b.mid), hor: C(a.hor, b.hor), exp: lerp(a.exp, b.exp, k) };
}
export function buildCampina() {
  const g = new THREE.Group(), R = mulberry(11);
  g.add(mesh(new THREE.BoxGeometry(500, .4, 500).translate(0, -.2, -80), mat(ground(160, 160, { seed: 21, mask: () => 1, grass: ['#1c4a34', '#2c7048', '#44a062', '#7ed08c', '#a8eaa8'] }), { color: '#ffffff' })));
  // manchas de terra nos pontos de spawn (pontos de Gosmim)
  const dirt = mat(ground(48, 48, { seed: 3, mask: () => 0, dirt: ['#3a3a30', '#566048', '#788660', '#94a478'] }));
  for (const [x, z, r] of [[-1.2, -.4, 1.5], [4.5, -1.2, 1.5], [-6.5, -2.2, 1.6], [9, -3, 1.6], [-3, -6, 1.6], [2, -8, 1.8], [-10, -7, 1.6], [7, -10, 1.6]]) { const d = mesh(new THREE.CylinderGeometry(r, r, .05, 18).translate(x, .02, z), dirt, { cast: false }); g.add(d); }
  // trilha
  const trail = mesh(new THREE.BoxGeometry(60, .04, 2.2).translate(-4, .02, 2.6), dirt, { cast: false }); g.add(trail);
  g.userData.cam = [];
  const addBB = (spr, x, z, k, flip = false, o = {}) => { const m = bb(spr, { k, shadow: o.shadow ?? false }); if (flip) m.scale.x = -1; const gp = new THREE.Group(); gp.add(m); gp.position.set(x, o.y ?? 0, z); gp.userData.cam = true; g.add(gp); return gp; };
  const tr0 = sprite('item', 'tree0'), tr1 = sprite('item', 'tree1'), bush = sprite('item', 'bush'), tu0 = sprite('item', 'tuft0'), tu1 = sprite('item', 'tuft1');
  for (let i = 0; i < 24; i++) { const x = -26 + i * 2.2 + R() * 1.6, z = -9 - R() * 8; addBB(R() > .5 ? tr0 : tr1, x, z, .95 + R() * .6, R() > .5); }
  for (let i = 0; i < 22; i++) { const x = -40 + i * 3.8 + R() * 2, z = -26 - R() * 14; addBB(R() > .5 ? tr0 : tr1, x, z, 2.0 + R() * 1.0, R() > .5); }
  for (let i = 0; i < 14; i++) addBB(bush, -16 + i * 2.4 + R() * 2, -4 - R() * 4, .9 + R() * .5, R() > .5);
  for (let i = 0; i < 70; i++) { const x = -16 + R() * 34, z = 4 - R() * 16; addBB(R() > .5 ? tu0 : tu1, x, z, .55 + R() * .45, R() > .5); }
  for (const [x, z] of [[-4.6, 1.2], [6.5, -.2]]) addBB(sprite('item', 'marker'), x, z, 1.1, false, { shadow: true });
  // serra distante (cintas de colinas em pixel)
  const ridgeMat = (col, seed, ppm = 3) => { const W = 300 * ppm / 3, H = 40; const P = new PX(Math.round(300 * ppm), Math.round(40 * ppm)), c = hex(col); for (let x = 0; x < P.w; x++) { const top = P.h * (1 - (.3 + .6 * fbm(x * .01 / (ppm / 3), 0, seed, 4))); for (let y = Math.floor(top); y < P.h; y++) P.set(x, y, y - top < 2 ? [c[0] + 18, c[1] + 18, c[2] + 24] : c); } return P.done(); };
  const rd = [];
  for (const [col, z, h, s] of [['#6aa890', -150, 40, 4], ['#4e8a78', -110, 30, 9]]) { const m = new THREE.Mesh(new THREE.PlaneGeometry(420, h).translate(0, h / 2 - 1, z), new THREE.MeshBasicMaterial({ map: canvasTex(ridgeMat(col, s)), transparent: true, alphaTest: .5, fog: true })); g.add(m); rd.push(m); }
  const sk = sky({ top: '#78bcd4', mid: '#a6dccd', hor: '#cdeedd', moonI: 0 }); g.add(sk.mesh);
  const sun = sunLight(g, '#eafff4', 1.7, V3(-7, 15, 9), 13);
  const hemi = new THREE.HemisphereLight('#d6f5e6', '#79a98f', 1.05); g.add(hemi);
  const fill = new THREE.PointLight('#ffffff', 1.1, 8, 2); g.add(fill);
  // poeira / esporos no ar
  const dust = particles(60, (i, t, o) => { o.x = ((i * 7.3) % 24) - 12; o.y = .3 + (i * 3.7 % 3) + Math.sin(t * .4 + i) * .15; o.z = -((i * 5.1) % 14) + 2; o.a = .35; o.s = .018; o.r = .9; o.g = 1; o.b = .95; }, { soft: 1 }); g.add(dust);
  return {
    group: g, fogDensity: .018,
    apply(env, focus, t) {
      const T = todAt(env.hour ?? 8);
      sun.color.copy(T.sun); sun.intensity = T.si; sun.position.set(focus.x + T.sunp[0], T.sunp[1] + 1, focus.z + T.sunp[2]); sun.target.position.set(focus.x, 0, focus.z); sun.target.updateMatrixWorld();
      hemi.color.copy(T.hs); hemi.groundColor.copy(T.hg); hemi.intensity = T.hi; fill.position.set(focus.x - .5, 1.7, focus.z + 2.4); fill.color.copy(T.hs).lerp(new THREE.Color('#ffffff'), .5); fill.intensity = (.9 + .2 * (1 - clamp01((env.hour - 17) / 1.5))) * 1;
      sk.u.top.value.copy(T.top); sk.u.mid.value.copy(T.mid); sk.u.hor.value.copy(T.hor); dust.userData.update(t);
      sk.mesh.position.copy(env.camPos);
      return { fog: T.fog, fd: T.fd * (env.fogK ?? 1), exp: T.exp };
    },
  };
}

// ============ BANCA DE COMPRAS (Porto Manso) ============
export function buildBanca() {
  const g = new THREE.Group(), M = mats();
  const floor = mat(cobbles(96, 96, { seed: 14, cell: 10, cols: ['#4a5470', '#667090', '#8490b0', '#a2aecc', '#bcc8e0'] }));
  g.add(mesh(new THREE.BoxGeometry(40, .4, 30).translate(0, -.2, -2), floor));
  const wallM = mat(plaster(96, 96, { seed: 31, wall: ['#5e6c86', '#7a88a2', '#94a2bc', '#b0bdd4'], beams: [{ t: 'h', y: 0 }, { t: 'v', x: 0 }, { t: 'v', x: 48 }] }));
  g.add(mesh(new THREE.BoxGeometry(40, 8, .4).translate(0, 4, -8), wallM));
  g.add(mesh(new THREE.BoxGeometry(.4, 8, 30).translate(-16, 4, -2), wallM)); g.add(mesh(new THREE.BoxGeometry(.4, 8, 30).translate(16, 4, -2), wallM));
  // janelas altas (paineis emissivos azul-claro)
  const wp = new PX(16, 40), wE = ramp(['#8ab4e0', '#b8d8f4', '#e4f2ff', '#ffffff']);
  wp.fill((x, y) => { const fr = x < 1 || x > 14 || y < 1 || y > 38 || x === 7 || x === 8 || y === 13 || y === 26; return fr ? hex('#34405a') : wE(.45 + (1 - y / 40) * .5 + (h2(x, y, 4) - .5) * .12, x, y); });
  const winM = new THREE.MeshBasicMaterial({ map: canvasTex(wp.done()), color: new THREE.Color(1.5, 1.6, 1.8), fog: false });
  const wins = [];
  for (const x of [-12, -7, -2, 3, 8, 13]) { const w = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 4), winM); w.position.set(x, 4.6, -7.78); g.add(w); wins.push(w); const gl = glow('#9cc8ff', 4.2, .35); gl.position.set(x, 4.6, -7.4); g.add(gl); }
  // balcao com selo prateado
  const wood = mat(woodPlanks(64, 64, { pw: 5, len: 32, seed: 7, cols: ['#2a2230', '#443a52', '#5e5270', '#7a6c90'] }));
  const cnt = box(7, 1.1, 1.1, wood); cnt.position.set(0, 0, -3.6); g.add(cnt);
  const top = box(7.3, .1, 1.4, mat(cobbles(64, 64, { seed: 3, cell: 20, cols: ['#8a909c', '#aab0bc', '#cfd5de', '#eef2f8'] }))); top.position.set(0, 1.1, -3.6); g.add(top);
  const seal = new PX(32, 32); seal.fill((x, y) => { const d = Math.hypot(x - 15.5, y - 15.5); if (d > 15) return null; if (d > 13) return hex('#eef2f8'); if (d > 11) return hex('#8a909c'); const a = Math.atan2(y - 15.5, x - 15.5); const star = Math.abs(Math.cos(a * 2.5)) * 9 + 3 > d; return star ? hex('#e8eef6') : hex('#5a6478'); });
  const sealM = plane(.6, .6, canvasTex(seal.done()), { tr: true, fog: true, color: '#ffffff' }); sealM.position.set(0, .6, -3.02); g.add(sealM);
  const slot = box(1.2, .08, .5, M.beam); slot.position.set(0, 1.2, -3.5); g.add(slot);
  // colunas
  for (const x of [-10, 10]) { const c = box(.9, 7, .9, wallM); c.position.set(x, 0, -6); g.add(c); }
  // painel de precos (curva de 24 h) na parede
  const pc = document.createElement('canvas'); const [pw, ph] = panelSize('banca'); pc.width = pw; pc.height = ph; const pg = pc.getContext('2d'); const ptex = canvasTex(pc);
  const board = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 3.0 * ph / pw), new THREE.MeshBasicMaterial({ map: ptex, fog: false, color: new THREE.Color(1.15, 1.15, 1.2) })); board.position.set(-.2, 3.1, -7.74); g.add(board);
  const bg2 = glow('#a8c8ff', 4.5, .2); bg2.position.set(-.2, 3.1, -7.3); g.add(bg2);
  // bancos e caixotes decorativos
  for (const x of [-9, 9]) { const b = box(2.4, .5, .7, wood); b.position.set(x, 0, -2); g.add(b); }
  g.add(mesh(new THREE.BoxGeometry(34, .1, 2).translate(0, .04, 5), mat(cobbles(64, 64, { seed: 6, cell: 14, cols: ['#3a4260', '#566080', '#6e7a9c', '#8a96b8'] })), { cast: false }));
  // luz: fria de dia, janelas altas
  const hemi = new THREE.HemisphereLight('#cfe4ff', '#5a6a8a', 1.3); g.add(hemi);
  const sun = sunLight(g, '#e8f2ff', 1.5, V3(-4, 14, 12), 14);
  const fill = new THREE.PointLight('#e8f2ff', 1.1, 9, 2); g.add(fill);
  const coins = particles(24, (i, t, o) => { const T = t - (g.userData.coinT ?? -99) - i * .05; if (T < 0 || T > 1.2) { o.a = 0; o.x = 0; o.y = 0; o.z = 0; return; } o.x = (h2(i, 1, 1) - .5) * .5; o.y = 1.15 - T * T * 1.6 + 0.4 * Math.max(0, .4 - T); o.z = -3.2 + (h2(i, 2, 1)) * .8; o.a = 1; o.s = .055; o.r = 1; o.g = .8; o.b = .25; }, {});
  g.add(coins);
  g.userData.price = { g: pg, tex: ptex, canvas: pc };
  return {
    group: g,
    apply(env, focus, t, st) {
      fill.position.set(focus.x - .5, 1.8, focus.z + 2.6); g.userData.coinT = st.coinT ?? -99; coins.userData.update(t);
      const p = g.userData.price; drawPanel(p.g, 'banca', st.price || {}, t); p.tex.needsUpdate = true;
      sun.target.position.set(focus.x, 0, focus.z); sun.target.updateMatrixWorld(); sun.position.set(focus.x - 4, 14, focus.z + 12);
      return { fog: new THREE.Color('#b4d2ee'), fd: .02, exp: 1.2 };
    },
  };
}

// ============ CASA (cozinha + corredor), vida real ============
function tileFloor() { const P = new PX(64, 64), R = ramp(['#8a7a58', '#a89870', '#c4b48a', '#d8caa0']); P.fill((x, y) => { const cx = (x >> 4), cy = (y >> 4), alt = (cx + cy) & 1, e = (x & 15) === 0 || (y & 15) === 0; if (e) return hex('#6a5c40'); return R((alt ? .35 : .62) + (h2(x, y, 3) - .5) * .12 + (fbm(x * .3, y * .3, 4) - .5) * .12, x, y); }); return P.done(); }
function wallpaper() { const P = new PX(64, 64), R = ramp(['#8a7656', '#a8936c', '#c4ae84', '#dccaa0']); P.fill((x, y) => { const st = (x % 8) < 1 ? -.05 : 0, dot = ((x % 8 === 4) && (y % 8 === 4)) ? -.06 : 0; return R(.58 + st + dot + (fbm(x * .2, y * .2, 5) - .5) * .1, x, y); }); return P.done(); }
function clockTex(hh, mm) { const P = new PX(32, 32); P.fill((x, y) => { const d = Math.hypot(x - 15.5, y - 15.5); if (d > 15.5) return null; if (d > 13.5) return hex('#2a1c14'); if (d > 12) return hex('#6a4a2a'); return hex('#f2ead6'); }); for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; P.rect(15.5 + Math.sin(a) * 11 - .5, 15.5 - Math.cos(a) * 11 - .5, 1.5, 1.5, hex('#2a1c14')); } const ha = ((hh % 12) + mm / 60) / 12 * Math.PI * 2, ma = mm / 60 * Math.PI * 2; P.line(15, 15, 15 + Math.sin(ha) * 7, 15 - Math.cos(ha) * 7, hex('#1a1410')); P.line(15, 15, 15 + Math.sin(ma) * 11, 15 - Math.cos(ma) * 11, hex('#1a1410')); P.rect(14, 14, 3, 3, hex('#a8281a')); return canvasTex(P.done()); }
export function buildCasa() {
  const g = new THREE.Group(), M = mats();
  const fl = mat(tileFloor()), wl = mat(wallpaper()), wood = M.plank, dark = M.plankDark;
  g.add(mesh(new THREE.BoxGeometry(30, .4, 16).translate(2, -.2, -1), fl));
  g.add(mesh(new THREE.BoxGeometry(30, 3.6, .3).translate(2, 1.8, -3.2), wl)); g.add(mesh(new THREE.BoxGeometry(30, .3, 16).translate(2, 3.75, -1), mat(plaster(64, 64, { seed: 2, wall: ['#9a8a68', '#b4a47e', '#cdbd96', '#e0d2ac'] }))));
  g.add(mesh(new THREE.BoxGeometry(.3, 3.6, 16).translate(-10, 1.8, -1), wl));
  // rodape
  g.add(mesh(new THREE.BoxGeometry(30, .22, .1).translate(2, .11, -3.0), dark, { cast: false }));
  // corredor: parede um pouco mais escura a partir de x=2.2, batente da passagem
  const corr = mat((() => { const P = new PX(64, 64), R = ramp(['#5e4e36', '#7a6648', '#957e5a', '#ad946c']); P.fill((x, y) => R(.5 + (x % 8 < 1 ? -.1 : 0) + (fbm(x * .2, y * .2, 7) - .5) * .2, x, y)); return P.done(); })());
  g.add(mesh(new THREE.BoxGeometry(11, 3.6, .3).translate(8, 1.8, -3.05), corr));
  for (const [x, w] of [[2.1, .3], [-.1, .1]]) { const j = box(w, 3.2, .5, dark); j.position.set(x, 0, -2.9); g.add(j); }
  const hd = box(2.6, .3, .5, dark); hd.position.set(1, 3.0, -2.9); g.add(hd);
  // mesa e cadeiras (cozinha)
  const table = new THREE.Group(); const top = box(1.9, .07, 1.0, wood); top.position.y = .74; table.add(top);
  for (const [x, z] of [[-.82, -.4], [.82, -.4], [-.82, .4], [.82, .4]]) { const l = box(.07, .74, .07, dark); l.position.set(x, 0, z); table.add(l); }
  table.position.set(-3.4, 0, -1.6); g.add(table);
  const chair = (x, z, s) => { const c = new THREE.Group(); const seat = box(.55, .06, .55, dark); seat.position.y = .5; c.add(seat); const back = box(.06, .55, .55, dark); back.position.set(-.25 * s, .45, 0); c.add(back); for (const [a, b] of [[-.22, -.22], [.22, -.22], [-.22, .22], [.22, .22]]) { const l = box(.05, .45, .05, dark); l.position.set(a, 0, b); c.add(l); } c.position.set(x, 0, z); g.add(c); };
  chair(-5.0, -1.6, 1); chair(-1.8, -1.6, -1);
  // bancada com pia e cafeteira + geladeira + relogio de parede
  const cab = box(2.6, .9, .65, mat(woodPlanks(64, 64, { pw: 8, len: 64, seed: 5, nails: false, cols: ['#4a3a2a', '#6a543a', '#8a7048', '#a88a5c'] }))); cab.position.set(.6, 0, -2.8); g.add(cab);
  const cat = box(2.7, .06, .7, mat(cobbles(64, 64, { seed: 8, cell: 16, cols: ['#8a8070', '#a89c88', '#c8bca4'] }))); cat.position.set(.6, .9, -2.8); g.add(cat);
  const sink = box(.9, .05, .45, M.beam); sink.position.set(.0, .96, -2.8); g.add(sink);
  const cafe = box(.28, .4, .26, mat(woodPlanks(32, 32, { pw: 32, len: 32, seed: 2, nails: false, cols: ['#15100c', '#241a14', '#3a2c20'] }))); cafe.position.set(1.3, .96, -2.8); g.add(cafe);
  const cafeL = new THREE.Mesh(new THREE.BoxGeometry(.14, .12, .02), new THREE.MeshBasicMaterial({ color: new THREE.Color(3, 1.6, .3) })); cafeL.position.set(1.3, 1.2, -2.66); g.add(cafeL); const cg = glow('#ffa030', .7, .8); cg.position.set(1.3, 1.2, -2.5); g.add(cg);
  const fridge = box(.95, 1.9, .75, mat(cobbles(32, 32, { seed: 1, cell: 30, cols: ['#8a8c8a', '#aaaca8', '#c8cac6', '#dcdedb'] }))); fridge.position.set(-7.6, 0, -2.7); g.add(fridge);
  const clockM = new THREE.Mesh(new THREE.CircleGeometry(.36, 20), new THREE.MeshBasicMaterial({ map: clockTex(8, 0), fog: false })); clockM.position.set(-4.7, 2.3, -3.0); g.add(clockM);
  // janela da cozinha (luz bege pálida) e quadro no corredor
  const win = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.1), new THREE.MeshBasicMaterial({ color: new THREE.Color('#fff0cc').multiplyScalar(1.5), fog: false })); win.position.set(-6.2, 2.1, -3.0); g.add(win); const wf = box(1.5, .08, .12, dark); wf.position.set(-6.2, 1.52, -2.98); g.add(wf);
  for (const [x, y, w, h, c] of [[3.4, 2.2, .7, .9, '#6a8a76'], [4.3, 2.1, .5, .7, '#8a6a5a'], [9.6, 2.1, .8, .6, '#5a6a8a']]) { const f = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: c, fog: true })); f.position.set(x, y, -2.88); g.add(f); const fr = box(w + .1, h + .1, .04, dark); fr.position.set(x, y - (h + .1) / 2, -2.92); g.add(fr); }
  // porta do quarto (corredor) com macaneta
  const door = box(1.0, 2.1, .1, mat(woodPlanks(32, 64, { pw: 6, len: 32, seed: 12, nails: false, cols: ['#3a2418', '#5a3a26', '#7a5236', '#94684a'] }))); door.position.set(6.7, 0, -2.86); g.add(door);
  const knob = new THREE.Mesh(new THREE.SphereGeometry(.05, 8, 6), new THREE.MeshStandardMaterial({ color: '#d8b050', metalness: .6, roughness: .4 })); knob.position.set(6.25, .95, -2.78); g.add(knob);
  const doorFr = box(1.2, 2.25, .08, dark); doorFr.position.set(6.7, 0, -2.91); g.add(doorFr); door.position.z = -2.84;
  // luzes: lampada incandescente de teto (quente) + hemisferio quente dessaturado
  const hemi = new THREE.HemisphereLight('#f0d9a8', '#7a6240', 1.0); g.add(hemi);
  const key = sunLight(g, '#ffcf8a', 1.35, V3(-2, 8, 8), 12);
  const lampK = new THREE.PointLight('#ffc277', 2.4, 12, 2); lampK.position.set(-3, 3.1, .4); g.add(lampK);
  const lampC = new THREE.PointLight('#ffb866', .8, 7, 2); lampC.position.set(7, 3.0, .2); g.add(lampC);
  const bulbK = glow('#ffd090', 1.1, .8); bulbK.position.set(-3, 3.35, -.4); g.add(bulbK); const bulbC = glow('#ffc070', .7, .5); bulbC.position.set(7, 3.3, -.8); g.add(bulbC);
  const fill = new THREE.PointLight('#ffe2b0', .9, 8, 2); g.add(fill);
  return {
    group: g,
    apply(env, focus, t, st) {
      lampK.intensity = 2.4 * flick(t, 1); bulbK.material.opacity = .9; fill.position.set(focus.x - .4, 1.7, focus.z + 2.5); key.target.position.set(focus.x, 0, focus.z); key.target.updateMatrixWorld(); key.position.set(focus.x - 2, 8, focus.z + 8);
      return { fog: new THREE.Color('#d6c59c'), fd: (env.corredor ? .03 : .022) * (env.fogK ?? 1), exp: env.corredor ? 1.05 : 1.2 };
    },
  };
}

// ============ QUARTO (vida real) ============
export function buildQuarto() {
  const g = new THREE.Group(), M = mats();
  const fl = M.plankDark, wl = mat(wallpaper()), dark = M.plankDark;
  g.add(mesh(new THREE.BoxGeometry(18, .4, 12).translate(0, -.2, 0), fl));
  g.add(mesh(new THREE.BoxGeometry(18, 3.4, .3).translate(0, 1.7, -3.2), wl)); g.add(mesh(new THREE.BoxGeometry(.3, 3.4, 12).translate(-6, 1.7, 0), wl));
  g.add(mesh(new THREE.BoxGeometry(18, .22, .1).translate(0, .11, -3.0), dark, { cast: false }));
  // cama
  const blanket = new PX(48, 24); const BR = ramp(['#2a3042', '#3c4560', '#52607e', '#6a7a9a']); blanket.fill((x, y) => { const st = ((x + y) % 12 < 2) ? .2 : 0; return BR(.5 + st + (fbm(x * .2, y * .2, 8) - .5) * .3, x, y); });
  const bedF = box(2.4, .35, 1.2, dark); bedF.position.set(1.4, 0, -2.2); g.add(bedF);
  const matt = box(2.3, .22, 1.1, mat(blanket.done())); matt.position.set(1.4, .35, -2.2); g.add(matt);
  const pil = box(.6, .14, .8, mat(cobbles(32, 32, { seed: 3, cell: 30, cols: ['#8a8a96', '#aaaab6', '#cacad4', '#e0e0ea'] }))); pil.position.set(.5, .57, -2.2); g.add(pil);
  const head = box(.1, .95, 1.2, dark); head.position.set(.18, 0, -2.2); g.add(head);
  // mesinha, abajur, prato
  const mes = box(.8, .6, .6, dark); mes.position.set(-.6, 0, -2.6); g.add(mes);
  const sh = new THREE.Mesh(new THREE.CylinderGeometry(.14, .22, .26, 10, 1, true), new THREE.MeshStandardMaterial({ color: '#ffd8a0', emissive: '#ffb050', emissiveIntensity: 2.4, side: THREE.DoubleSide })); sh.position.set(-.35, 1.0, -2.8); g.add(sh);
  const base = box(.08, .26, .08, dark); base.position.set(-.35, .6, -2.8); g.add(base);
  const lg = glow('#ffb450', 1.6, .9); lg.position.set(-.35, 1.0, -2.7); g.add(lg);
  const lampL = new THREE.PointLight('#ffa840', 1.8, 8, 2); lampL.position.set(-.35, 1.1, -2.2); g.add(lampL);
  // janela: ceu cinza-claro (luz fria, fraca)
  const wp = new PX(16, 20), WR = ramp(['#9aa0a6', '#b4babe', '#cdd2d4', '#e0e4e4']); wp.fill((x, y) => (x < 1 || x > 14 || y < 1 || y > 18 || x === 7 || x === 8 || y === 9) ? hex('#4a3a2a') : WR(.5 + (1 - y / 20) * .35, x, y));
  const win = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.9), new THREE.MeshBasicMaterial({ map: canvasTex(wp.done()), color: new THREE.Color(1.4, 1.4, 1.35), fog: false })); win.position.set(3.9, 1.9, -3.0); g.add(win);
  const wg = glow('#c8ccd0', 3, .22); wg.position.set(3.9, 1.9, -2.5); g.add(wg);
  // poster, estante, tapete
  const pp = new PX(20, 28); const PR = ramp(['#1a2036', '#2a3a66', '#3f5ea0', '#78a0e0']); pp.fill((x, y) => { if (x < 1 || x > 18 || y < 1 || y > 26) return hex('#14161c'); const d = Math.hypot(x - 10, y - 12); if (d < 5) return hex(d < 3 ? '#ffd270' : '#e89a3a'); return PR(.3 + (1 - y / 28) * .3 + (h2(x, y, 9) > .96 ? .5 : 0), x, y); });
  const post = new THREE.Mesh(new THREE.PlaneGeometry(.8, 1.1), new THREE.MeshBasicMaterial({ map: canvasTex(pp.done()), fog: true })); post.position.set(-3.4, 2.0, -3.0); g.add(post);
  const shelf = box(1.6, .05, .3, dark); shelf.position.set(-2.2, 1.4, -3.0); g.add(shelf);
  for (let i = 0; i < 6; i++) { const b = box(.1, .3 + (i % 3) * .05, .22, mat(cobbles(16, 16, { seed: i, cell: 16, cols: [['#7a2a2a', '#9a4a3a'], ['#2a4a7a', '#3a64a0'], ['#2a6a4a', '#3a8a60']][i % 3].concat(['#c8b08a']) }))); b.position.set(-2.8 + i * .2, 1.45, -3.0); g.add(b); }
  const rug = mesh(new THREE.CylinderGeometry(1.4, 1.4, .03, 20).translate(-2, .01, -1), mat(cobbles(64, 64, { seed: 22, cell: 10, cols: ['#4a2a2a', '#6a3a34', '#8a4e40', '#a86a50'] })), { cast: false }); g.add(rug);
  const hemi = new THREE.HemisphereLight('#e8d4a8', '#6a5238', .95); g.add(hemi);
  const key = sunLight(g, '#ffc880', 1.1, V3(-3, 8, 8), 10);
  const fill = new THREE.PointLight('#ffe0b0', .9, 8, 2); g.add(fill);
  return {
    group: g,
    apply(env, focus, t) {
      lampL.intensity = 1.8 * flick(t, 3); lg.material.opacity = .85 * flick(t, 3); fill.position.set(focus.x - .4, 1.7, focus.z + 2.6); key.target.position.set(focus.x, 0, focus.z); key.target.updateMatrixWorld(); key.position.set(focus.x - 3, 8, focus.z + 8);
      return { fog: new THREE.Color('#cdbf9c'), fd: .026, exp: 1.15 };
    },
  };
}
