// LOGADO ep.1: pagina main (contrato: READY, render(t), DUR, TEXTS(t)). 1080x1920.
// Linha do tempo em shots.json (planos, camera, atores, HUD, textos, legendas). ?dbg=sprites mostra a folha de sprites.
import * as THREE from 'three';
import { makePost } from './post_ts.js';
import { blob, billboard, glow } from './px.js';
import * as CH from './chars.js';
import * as H from './hud.js';
import * as S from './sets.js';

const W = innerWidth, HH = innerHeight, SC = W / 1080, Q = new URLSearchParams(location.search), SS = +(Q.get('ss') ?? 2), DBG = Q.get('dbg');
const DATA = await (await fetch('shots.json')).json();
const SHOTS = DATA.shots, SUBS = DATA.subs, SPK = DATA.speakers || {};
window.DUR = DATA.meta.dur;
const ov = document.getElementById('ov'); ov.width = W; ov.height = HH; const og = ov.getContext('2d');
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), ss = x => { x = clamp(x); return x * x * (3 - 2 * x); }, lerp = (a, b, t) => a + (b - a) * t;
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const FONT_SERIF = '"Cormorant Garamond","Liberation Serif","Times New Roman",serif', FONT_CAPS = 'Cinzel,"Liberation Serif",serif';

// ---------------- WebGL ----------------
const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, HH);
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('stage').appendChild(renderer.domElement);
renderer.domElement.style.width = W + 'px'; renderer.domElement.style.height = HH + 'px';
const camera = new THREE.PerspectiveCamera(30, W / HH, .3, 600);
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2('#ffffff', .02); scene.background = new THREE.Color('#ffffff');
const SETS = { campina: S.buildCampina(), banca: S.buildBanca(), casa: S.buildCasa(), quarto: S.buildQuarto() };
for (const k in SETS) { scene.add(SETS[k].group); SETS[k].group.visible = false; }
SETS.casa.group.userData.set = 'casa';
// menu/painel em mundo
const panelC = document.createElement('canvas'), panelG = panelC.getContext('2d'), panelTex = new THREE.CanvasTexture(panelC); panelTex.magFilter = THREE.NearestFilter; panelTex.minFilter = THREE.LinearFilter; panelTex.colorSpace = THREE.SRGBColorSpace;
const panelMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: panelTex, transparent: true, opacity: .96, color: new THREE.Color(1.1, 1.12, 1.18), fog: false, depthWrite: false })); panelMesh.renderOrder = 6; scene.add(panelMesh); panelMesh.visible = false;
const panelGlow = glow('#b6ccf4', 1.5, .5); scene.add(panelGlow); panelGlow.visible = false;
// pool de atores
const pool = []; let used = 0; const sid = new WeakMap(); let sidN = 0;
function slot() { if (used >= pool.length) { const g = new THREE.Group(), sh = blob(.4, .5); sh.position.y = .015; g.add(sh); g.userData.cam = true; scene.add(g); const gl = glow('#ffd070', .9, .8); gl.visible = false; g.add(gl); pool.push({ g, sh, gl, meshes: new Map() }); } return pool[used++]; }
function place(sl, sp, k, o) {
  const key = (sid.get(sp) ?? (sid.set(sp, ++sidN), sidN)) + ':' + k + ':' + (o.ay ?? 0);
  for (const m of sl.meshes.values()) m.visible = false;
  let m = sl.meshes.get(key); if (!m) { m = billboard(sp.tex, sp.w * CH.SPX * k, sp.h * CH.SPX * k, { em: sp.em, emCol: '#ffffff', emI: 2, shadow: o.shadow ?? true, receive: false, ay: o.ay ?? 0 }); sl.g.add(m); sl.meshes.set(key, m); }
  m.visible = true; m.scale.x = o.flip ? -1 : 1; return m;
}
const post = makePost(renderer, scene, camera, W, HH, { ssaa: SS });

// ---------------- utilidades de linha do tempo ----------------
function step(arr, t) { if (arr == null) return null; if (!Array.isArray(arr)) return arr; let v = arr[0][1]; for (const [k, x] of arr) { if (k <= t) v = x; else break; } return v; }
function lin(arr, t) { if (arr == null) return null; if (!Array.isArray(arr)) return arr; if (t <= arr[0][0]) return arr[0][1]; for (let i = 0; i < arr.length - 1; i++) { const [a, va] = arr[i], [b, vb] = arr[i + 1]; if (t <= b) { return lerp(va, vb, (t - a) / Math.max(1e-6, b - a)); } } return arr[arr.length - 1][1]; }
const fmtMoney = c => (Math.round(c) / 100).toFixed(2).replace('.', ',');
const fmtCron = s => { s = Math.max(0, Math.floor(s + 1e-6)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
function evalState(st, t) { const o = {}; for (const k in st) { const v = st[k]; if (k === 'blinkFrom') o.cartaBlink = (t >= v && Math.floor(t * 4) % 2 === 0) ? 1 : 0; else if (k === 'moneyLin') o.money = fmtMoney(lin(v, t)); else if (Array.isArray(v) && Array.isArray(v[0])) o[k] = step(v, t); else o[k] = v; } return o; }
const findShot = t => SHOTS.find(s => t >= s.t0 && t < s.t1) || (t < SHOTS[0].t0 ? SHOTS[0] : SHOTS[SHOTS.length - 1]);
function camAt(keys, t) {
  let a = keys[0], b = keys[0], u = 0;
  if (t >= keys[keys.length - 1].t) a = b = keys[keys.length - 1];
  else if (t > keys[0].t) for (let i = 0; i < keys.length - 1; i++) if (t <= keys[i + 1].t) { a = keys[i]; b = keys[i + 1]; u = (t - a.t) / Math.max(1e-6, b.t - a.t); if (!(b.ease === 'lin' || a.ease === 'lin')) u = ss(u); break; }
  const L = (x, y) => lerp(x, y, u);
  const tg = [0, 1, 2].map(i => L(a.tgt[i], b.tgt[i])), d = L(a.d, b.d), az = L(a.az, b.az) * Math.PI / 180, el = L(a.el, b.el) * Math.PI / 180;
  return { tgt: V3(...tg), pos: V3(tg[0] + d * Math.sin(az) * Math.cos(el), tg[1] + d * Math.sin(el), tg[2] + d * Math.cos(az) * Math.cos(el)), fov: L(a.fov, b.fov), d };
}
function posAt(keys, t) { if (!keys) return [0, 0, 0]; if (!Array.isArray(keys[0])) return keys; if (t <= keys[0][0]) return [keys[0][1], keys[0][3] ?? 0, keys[0][2]]; for (let i = 0; i < keys.length - 1; i++) { const A = keys[i], B = keys[i + 1]; if (t <= B[0]) { const u = (t - A[0]) / Math.max(1e-6, B[0] - A[0]); return [lerp(A[1], B[1], u), lerp(A[3] ?? 0, B[3] ?? 0, u), lerp(A[2], B[2], u)]; } } const Z = keys[keys.length - 1]; return [Z[1], Z[3] ?? 0, Z[2]]; }

// ---------------- render do mundo ----------------
const hudC = document.createElement('canvas'); hudC.width = 150; hudC.height = 20; const hudG = hudC.getContext('2d');
const chipC = document.createElement('canvas'); chipC.width = 70; chipC.height = 16; const chipG = chipC.getContext('2d');
const mapC = document.createElement('canvas'); mapC.width = 108; mapC.height = 192; const mapG = mapC.getContext('2d');
let floatsNow = [], textsNow = [], trailsNow = [], projCam = camera;
const proj = (p) => { const v = V3(p[0], p[1], p[2]).project(camera); return [(v.x * .5 + .5) * 1080, (1 - (v.y * .5 + .5)) * 1920]; };

function renderWorld(t, sh) {
  const setName = sh.set;
  for (const k in SETS) SETS[k].group.visible = (k === setName);
  if (setName === 'mapa') { scene.background = new THREE.Color('#1a1640'); scene.fog.density = 0; }
  used = 0; floatsNow = [];
  // camera
  const ck = camAt(sh.cam, t); camera.position.copy(ck.pos); camera.up.set(0, 1, 0); camera.lookAt(ck.tgt); camera.fov = ck.fov; camera.updateProjectionMatrix(); camera.updateMatrixWorld();
  // atores
  const E = {}; let focus = null;
  for (const a of (sh.actors || [])) {
    if (a.show && (t < a.show[0] || t >= a.show[1])) continue;
    const [x, y, z] = posAt(a.pos, t), poseName = step(a.pose, t) || 'stand';
    let sp, k = a.k ?? 1, ay = 0, flip = (a.face ?? 1) < 0, sh0 = true;
    const spec = a.spec, face = step(a.face_k, t); if (face != null) flip = face < 0;
    if (a.kind === 'slime') { const stt = poseName; let f = 0, ss_ = stt; if (stt === 'idle') f = Math.floor(t * 3) % 2; if (stt.startsWith('dying')) { f = +stt.slice(5) || 0; ss_ = 'dying'; } if (stt === 'gone') continue; if (stt === 'puddle') sp = CH.sprite('item', 'puddle'); else sp = CH.sprite('slime', ss_, f); k = (a.k ?? .72); ay = 2 / 26; if (stt === 'puddle') { k = .6; ay = 0; sh0 = false; } }
    else if (a.kind === 'lying') { sp = CH.sprite('lying', step(a.pose, t) || 'visor'); k = a.k ?? .73; sh0 = false; }
    else if (a.kind === 'item') { sp = CH.sprite('item', a.id); k = a.k ?? .6; sh0 = a.shadow ?? false; }
    else { const pn = a.kind === 'side' ? CH.poseFrame(poseName, t) : poseName; sp = CH.sprite(a.kind, spec, pn, { crack: a.crack, visorOn: false }); if (a.kind === 'side' && CH.POSES[pn].visorOn) sp = CH.sprite('side', spec, pn, { crack: a.crack, visorOn: true }); k = (a.k ?? 1) * .9 * CH.specK(spec); ay = 3 / 60; }
    const sl = slot(), m = place(sl, sp, k, { flip, ay, shadow: sh0 && (a.shadow ?? true) });
    sl.g.position.set(x, y, z); sl.sh.visible = sh0 && (a.blob ?? true); sl.sh.scale.set(k * (a.kind === 'slime' ? .9 : 1.1), 1, k); sl.g.visible = true;
    E[a.id || ''] = { x, y, z, k, g: sl.g, a };
    if (a.focus) focus = V3(x, y + (a.fy ?? .9), z);
    sl.gl.visible = !!a.glow; if (a.glow) { sl.gl.position.set(0, .3, .1); sl.gl.scale.set(1.1, 1.1, 1); }
  }
  for (let i = used; i < pool.length; i++) pool[i].g.visible = false;
  const fp = sh.focus ? V3(...sh.focus) : (focus || ck.tgt.clone());
  // billboards de frente para a camera
  scene.traverse(g => { if (g.userData.cam && g.visible) g.rotation.y = Math.atan2(camera.position.x - g.position.x, camera.position.z - g.position.z); });
  // set (luz, nevoa, ceu)
  const hour = lin(sh.hour, t) ?? 8, st = {};
  if (sh.price) st.price = evalState(sh.price, t); if (sh.coinT != null) st.coinT = sh.coinT;
  const env = SETS[setName] ? SETS[setName].apply({ hour, camPos: camera.position, corredor: !!sh.corredor, fogK: sh.fogK }, fp, t, st) : { fog: '#1a1640', fd: 0 };
  // brilho no personagem real/ gosma (brilho aditivo)
  // flash de impacto
  let flash = 0, flashCol = '#9ad8ff';
  for (const f of (sh.flash || [])) { const u = (t - f[0]) / f[1]; if (u >= 0 && u < 1) { flash = Math.max(flash, (1 - u) * (f[3] ?? .5)); flashCol = f[2] || flashCol; } }
  scene.fog.color.set(env.fog || '#fff'); scene.fog.density = env.fd ?? .02; scene.background = new THREE.Color(env.fog || '#fff'); renderer.toneMappingExposure = (env.exp ?? 1.15) * (lin(sh.exposure, t) ?? 1);
  // menu (painel em mundo)
  const mn = sh.menu; panelMesh.visible = panelGlow.visible = false;
  if (mn && t >= (mn.show?.[0] ?? -1) && t < (mn.show?.[1] ?? 1e9)) {
    const scr = step(mn.screen, t), [pw, ph] = H.panelSize(scr); if (panelC.width !== pw) { panelC.width = pw; panelC.height = ph; }
    const stt = evalState(mn.state || {}, t); H.drawPanel(panelG, scr, stt, t); panelTex.needsUpdate = true;
    const p = posAt(mn.pos, t), w = mn.w ?? .7; panelMesh.visible = true; panelMesh.scale.set(w, w * ph / pw, 1); panelMesh.position.set(p[0], p[1], p[2]);
    panelMesh.rotation.set(0, Math.atan2(camera.position.x - p[0], camera.position.z - p[2]) + (mn.yaw ?? 0) * Math.PI / 180, 0);
    panelGlow.visible = true; panelGlow.position.set(p[0], p[1], p[2] - .1); panelGlow.scale.set(w * 1.8, w * 1.8 * ph / pw, 1);
  }
  // overlay do mundo: flutuantes
  for (const f of (sh.floats || [])) { const u = (t - f.t) / (f.dur ?? .9); if (u < 0 || u > 1) continue; const base = typeof f.at === 'string' ? E[f.at] : { x: f.at[0], y: f.at[1], z: f.at[2] }; if (!base) continue; const hgt = (typeof f.at === 'string' ? (f.at === 'slime' ? .55 : 1.9) : 0); const pp = proj([base.x, (base.y || 0) + hgt + u * .5, base.z]); floatsNow.push({ ...f, x: pp[0], y: pp[1], u }); }
  // barra do slime
  // rastro da mao (curto) e da ponta do galho (longo): amostra as poses recentes do ator
  trailsNow = [];
  if (sh.trails && E[sh.trails.actor]) { const e = E[sh.trails.actor], a = e.a, flipS = (a.face ?? 1) < 0 ? -1 : 1, sc = (a.k ?? 1) * .9 * CH.specK(a.spec) / 30;
    const W_ = (px, py) => [e.x + flipS * (px - 23) * sc, e.y + (57 - py) * sc, e.z], ks = (a.pose || []).filter(k => CH.POSES[k[1]] && CH.POSES[k[1]].nh);
    const pts = { hand: [], tip: [] };
    for (let i = 0; i < ks.length - 1; i++) { const A = ks[i], B = ks[i + 1]; if (B[0] < t - .9 || A[0] > t) continue; const PA = CH.POSES[A[1]], PB = CH.POSES[B[1]]; for (let s = 0; s <= 6; s++) { const u = s / 6, tt = lerp(A[0], B[0], u); if (tt > t || tt < t - .9) continue; const hx = lerp(PA.nh[0], PB.nh[0], u), hy = lerp(PA.nh[1], PB.nh[1], u), ang = lerp(PA.gang ?? -25, PB.gang ?? -25, u) * Math.PI / 180; pts.hand.push({ t: tt, p: proj(W_(hx, hy)) }); pts.tip.push({ t: tt, p: proj(W_(hx + Math.cos(ang) * 22, hy + Math.sin(ang) * 22)) }); } }
    trailsNow = [{ pts: pts.hand, col: '#ffe9a8', w: 6 }, { pts: pts.tip, col: '#ffffff', w: 10 }].filter(x => x.pts.length > 1).map(x => ({ ...x, now: t })); }
  const sb = sh.slimebar; let slimeBar = null;
  if (sb && E[sb.actor] && !(step(E[sb.actor].a.pose, t) === 'gone' || ['puddle'].includes(step(E[sb.actor].a.pose, t)))) { const e = E[sb.actor], pp = proj([e.x, e.y + .62, e.z]); slimeBar = { x: pp[0], y: pp[1], hp: step(sb.hp, t), max: sb.max ?? 20 }; }
  // post
  const o = { exposure: renderer.toneMappingExposure, bloom: sh.bloom ?? [.5, .8, .85], vig: sh.vig ?? .5, warm: sh.warm ?? .08, sat: sh.sat ?? 1.05, tilt: sh.tilt ?? [10, .16, .3], aper: (sh.aper ?? 120) };
  post.bloom.strength = o.bloom[0]; post.bloom.radius = o.bloom[1]; post.bloom.threshold = o.bloom[2];
  const Vu = post.vig.uniforms; Vu.amt.value = o.vig; Vu.warm.value = o.warm; Vu.sat.value = o.sat; Vu.contrast.value = .26; Vu.fade.value = 1;
  const pj = fp.clone().project(camera);
  post.dof.focus = camera.position.distanceTo(fp); post.dof.aper = o.aper; post.dof.maxCoc = sh.maxCoc ?? 24;
  post.dof.tiltAmt = o.tilt[0]; post.dof.tiltC = pj.y * .5 + .5; post.dof.tiltW = o.tilt[1]; post.dof.tiltF = o.tilt[2];
  post.composer.render();
  return { flash, flashCol, slimeBar };
}

// ---------------- overlay 2D (HUD, textos, legendas) ----------------
const pix = (src, x, y, sc) => { og.imageSmoothingEnabled = false; og.drawImage(src, x, y, src.width * sc, src.height * sc); };
function wrap(g, text, maxW) { const ws = text.split(' '); const lines = []; let cur = ''; for (const w of ws) { const t2 = cur ? cur + ' ' + w : w; if (g.measureText(t2).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t2; } if (cur) lines.push(cur); return lines; }
function drawSubtitle(t) {
  const s = SUBS.find(x => t >= x.t0 - .35 && t < x.t1); if (!s) return;
  const a = clamp((t - (s.t0 - .35)) / .12) * (1 - clamp((t - (s.t1 - .06)) / .06)), whisper = s.kind === 'whisper';
  og.save(); og.globalAlpha = a; og.textAlign = 'center'; og.textBaseline = 'alphabetic'; og.lineJoin = 'round';
  const fs = whisper ? 50 : 60; og.font = `italic ${whisper ? 500 : 600} ${fs}px ${FONT_SERIF}`;
  const text = whisper ? '“' + s.text + '”' : s.text, lines = wrap(og, text, 840 * SC / SC).slice(0, 2), lh = fs * 1.13, cx = 465, base = 1478;
  const y0 = base - (lines.length - 1) * lh;
  if (s.speaker) {   // plaquinha com o nome (cor do figurino), acima da legenda
    const col = SPK[s.speaker]?.color || '#ffffff', nm = (SPK[s.speaker]?.name || s.speaker).toUpperCase();
    og.font = `700 30px ${FONT_CAPS}`; const w = og.measureText(nm).width + 40, py = y0 - fs * .95 - 56;
    og.fillStyle = 'rgba(12,10,18,.78)'; og.strokeStyle = col; og.lineWidth = 3; og.beginPath(); og.roundRect(cx - w / 2, py, w, 46, 8); og.fill(); og.stroke();
    og.fillStyle = col; og.textBaseline = 'middle'; og.fillText(nm, cx, py + 24); og.textBaseline = 'alphabetic'; og.font = `italic ${whisper ? 500 : 600} ${fs}px ${FONT_SERIF}`;
  }
  lines.forEach((ln, i) => { const y = y0 + i * lh; og.lineWidth = 9; og.strokeStyle = 'rgba(14,9,16,.92)'; og.strokeText(ln, cx, y); og.shadowColor = 'rgba(0,0,0,.6)'; og.shadowBlur = 8; og.fillStyle = whisper ? '#d9e4ff' : '#fbf3e2'; og.fillText(ln, cx, y); og.shadowBlur = 0; });
  og.restore();
}
function drawExtras(t, sh) {
  textsNow = [];
  for (const x of (DATA.texts || [])) {
    if (t < x.t0 || t >= x.t1) continue;
    const a = clamp((t - x.t0) / .25) * (1 - clamp((t - (x.t1 - .25)) / .25)), cx = (x.x0 + x.x1) / 2, cy = (x.y0 + x.y1) / 2;
    og.save(); og.globalAlpha = a; og.textAlign = 'center'; og.textBaseline = 'middle'; og.lineJoin = 'round';
    if (x.kind === 'title') { og.font = `700 ${x.size ?? 150}px ${FONT_CAPS}`; og.letterSpacing = '14px'; og.lineWidth = 12; og.strokeStyle = 'rgba(20,10,26,.9)'; og.strokeText(x.text, cx + 7, cy); og.fillStyle = '#fff3d6'; og.shadowColor = 'rgba(224,16,48,.7)'; og.shadowBlur = 28; og.fillText(x.text, cx + 7, cy); }
    else if (x.kind === 'card') { og.fillStyle = 'rgba(14,16,30,.62)'; og.strokeStyle = '#cfd5de'; og.lineWidth = 3; og.beginPath(); og.roundRect(x.x0, x.y0, x.x1 - x.x0, x.y1 - x.y0, 10); og.fill(); og.stroke(); og.strokeStyle = 'rgba(207,213,222,.5)'; og.lineWidth = 1.5; og.strokeRect(x.x0 + 10, x.y0 + 10, x.x1 - x.x0 - 20, x.y1 - x.y0 - 20); og.fillStyle = '#f4f7fb'; og.font = `600 ${x.size ?? 96}px ${FONT_CAPS}`; og.letterSpacing = '8px'; og.fillText(x.text, cx + 4, cy + 4); }
    else if (x.kind === 'label') { og.font = `700 ${x.size ?? 34}px ${FONT_CAPS}`; og.letterSpacing = '6px'; const w = og.measureText(x.text).width + 48; og.fillStyle = 'rgba(12,16,30,.66)'; og.strokeStyle = '#cfd5de'; og.lineWidth = 2; og.beginPath(); og.roundRect(cx - w / 2, cy - 30, w, 60, 6); og.fill(); og.stroke(); og.fillStyle = '#f4f7fb'; og.fillText(x.text, cx + 3, cy + 2); }
    else { og.font = `italic 700 ${x.size ?? 64}px ${FONT_SERIF}`; og.lineWidth = 10; og.strokeStyle = 'rgba(14,9,16,.9)'; const lines = wrap(og, x.text, x.x1 - x.x0), lh = (x.size ?? 64) * 1.1, y0 = cy - (lines.length - 1) * lh / 2; lines.forEach((ln, i) => { og.strokeText(ln, cx, y0 + i * lh); og.fillStyle = x.color || '#ffe9a8'; og.fillText(ln, cx, y0 + i * lh); }); }
    og.restore();
    textsNow.push({ id: x.id, text: x.text, x0: x.x0, y0: x.y0, x1: x.x1, y1: x.y1 });
  }
}
function overlay(t, sh, wr) {
  og.setTransform(SC, 0, 0, SC, 0, 0); og.clearRect(0, 0, 1080, 1920);
  if (wr.flash > 0) { og.globalAlpha = wr.flash; og.fillStyle = wr.flashCol; og.fillRect(0, 0, 1080, 1920); og.globalAlpha = 1; }
  const hud = sh.hud;
  if (hud && hud.show !== false) {
    H.drawHUD(hudG, { lvl: step(hud.lvl, t) ?? 1, hp: step(hud.hp, t), hpMax: step(hud.hpMax, t) ?? 40, xp: step(hud.xp, t) ?? 0, xpMax: step(hud.xpMax, t) ?? 30, clock: step(hud.clock, t) ?? '08:12' });
    pix(hudC, 40, 280, 4);
    if (sh.cron) { H.drawChip(chipG, 'cron', fmtCron(lin(sh.cron, t))); pix(chipC, 40, 372, 4); }
    if (sh.cnt) { H.drawChip(chipG, 'cnt', step(sh.cnt, t)); pix(chipC, 340, 372, 4); }
    if (sh.bag && step(sh.bag, t)) { H.drawChip(chipG, 'bag', step(sh.bag, t)); pix(chipC, 640, 372, 4); }
  }
  if (sh.set === 'mapa') { H.drawMap(mapG, { lvl: 3 }); pix(mapC, 0, 0, 10); }
  // flutuantes (dano, cura)
  og.imageSmoothingEnabled = false;
  for (const f of floatsNow) { const sc = f.sc ?? 6, a = 1 - ss((f.u - .6) / .4), w = H.textW(f.text, sc); og.globalAlpha = a; H.ptext(og, f.text, f.x - w / 2, f.y - f.u * 40, f.color || '#ffffff', sc, '#10182a'); og.globalAlpha = 1; }
  if (wr.slimeBar) { const b = wr.slimeBar; const w = 100, x = b.x - w / 2, y = b.y - 30; og.fillStyle = '#10182a'; og.fillRect(x - 4, y - 4, w + 8, 24); og.fillStyle = '#4a2a2a'; og.fillRect(x, y, w, 16); og.fillStyle = '#e0604a'; og.fillRect(x, y, w * clamp(b.hp / b.max), 16); og.fillStyle = '#ff9a82'; og.fillRect(x, y, w * clamp(b.hp / b.max), 4); H.ptext(og, b.hp + '/' + b.max, b.x - H.textW(b.hp + '/' + b.max, 3) / 2, y - 30, '#ffffff', 3, '#10182a'); }
  for (const tr of trailsNow) { og.lineCap = 'round'; og.lineJoin = 'round'; for (let i = 1; i < tr.pts.length; i++) { const a = tr.pts[i - 1], b = tr.pts[i], age = tr.now - b.t, al = clamp(1 - age / .85); og.globalAlpha = al * .85; og.strokeStyle = tr.col; og.lineWidth = tr.w * al; og.beginPath(); og.moveTo(a.p[0], a.p[1]); og.lineTo(b.p[0], b.p[1]); og.stroke(); } og.globalAlpha = 1; }
  drawExtras(t, sh);
  drawSubtitle(t);
  if (Q.get('safe')) { og.strokeStyle = 'rgba(255,0,0,.8)'; og.lineWidth = 3; og.strokeRect(0, 250, 930, 1290); og.strokeStyle = 'rgba(0,200,255,.8)'; og.beginPath(); og.moveTo(0, 1250); og.lineTo(1080, 1250); og.moveTo(0, 1500); og.lineTo(1080, 1500); og.stroke(); }
}

// ---------------- folha de sprites (debug) ----------------
function spriteSheet(page) {
  renderer.domElement.style.visibility = 'hidden'; og.setTransform(1, 0, 0, 1, 0, 0); og.fillStyle = '#7a9a8a'; og.fillRect(0, 0, W, HH); og.imageSmoothingEnabled = false;
  const L = [
    [['side', 'teco_real', 'stand'], ['side', 'teco_real', 'hold_mug'], ['side', 'teco_real', 'grab_visor'], ['side', 'teco_real', 'visor_arm'], ['side', 'teco_real', 'door'], ['side', 'teco_real', 'sit_visor'], ['back', 'teco_real', 'stand'], ['lying', 'visor'], ['lying', 'plain'],
    ['side', 'rogerio', 'sit_dad'], ['side', 'rogerio', 'arms_crossed'], ['side', 'rogerio', 'shake'], ['side', 'sandra', 'point_clock'], ['side', 'sandra', 'worry'], ['side', 'sandra', 'plate'], ['side', 'teco_av', 'stand']],
    [['side', 'teco_av', 'idle_g'], ['side', 'teco_av', 'ready'], ['side', 'teco_av', 'wind'], ['side', 'teco_av', 'strike'], ['side', 'teco_av', 'strike_tip'], ['side', 'teco_av', 'wind_tip'], ['side', 'teco_av', 'miss'], ['side', 'teco_av', 'hurt'], ['side', 'teco_av', 'pant'], ['side', 'teco_av', 'whisper_g'], ['side', 'teco_av', 'crouch'], ['side', 'teco_av', 'menu_g'], ['side', 'teco_av', 'smile'], ['side', 'teco_av', 'walk'], ['side', 'teco_av', 'walk_b'], ['side', 'teco_av', 'hold_gosma']],
    [['front', 'teco_av', 'stand'], ['front', 'teco_av', 'menu'], ['front', 'teco_av', 'point', { crack: 1 }], ['front', 'teco_av', 'look'], ['slime', 'idle', 0], ['slime', 'idle', 1], ['slime', 'jump', 0], ['slime', 'hit', 0], ['slime', 'heal', 0], ['slime', 'dying', 0], ['slime', 'dying', 1], ['item', 'puddle'], ['item', 'gosma'], ['item', 'gosmaD'], ['item', 'po'], ['item', 'mug'], ['item', 'visor'], ['item', 'plate'], ['item', 'coin'], ['item', 'tree0'], ['item', 'tree1'], ['item', 'bush'], ['item', 'tuft0'], ['side', 'npc1', 'stand'], ['side', 'npc2', 'stand'], ['side', 'npc3', 'stand'], ['side', 'npc4', 'stand'], ['back', 'npc1', 'stand']],
  ][page] || [];
  let x = 20, y = 20, rowH = 0;
  for (const a of L) { let sp; if (a[0] === 'slime') sp = CH.sprite('slime', a[1], a[2]); else if (a[0] === 'lying') sp = CH.sprite('lying', a[1]); else if (a[0] === 'item') sp = CH.sprite('item', a[1]); else sp = CH.sprite(a[0], a[1], a[2], a[3] || {}); const sc = sp.w > 50 ? 2.6 : 3.2, w = sp.canvas.width * sc / 2.5, h = sp.canvas.height * sc / 2.5; if (x + w > W - 10) { x = 20; y += rowH + 24; rowH = 0; } og.drawImage(sp.canvas, x, y, w, h); og.strokeStyle = 'rgba(255,255,255,.25)'; og.strokeRect(x, y, w, h); og.fillStyle = '#fff'; og.font = '14px monospace'; og.fillText(a.slice(0, 3).join(':'), x, y + h + 14); x += w + 14; rowH = Math.max(rowH, h); }
}

// ---------------- contrato ----------------
window.render = (t) => {
  if (DBG === 'sprites') { spriteSheet(Math.floor(t)); return; }
  const sh = findShot(t); const wr = renderWorld(t, sh); overlay(t, sh, wr);
};
window.TEXTS = (t) => { const sh = findShot(t); overlay(t, sh, { flash: 0 }); return textsNow; };
window.SHOTS = SHOTS;
await Promise.all(['italic 600 40px "Cormorant Garamond"', '700 40px Cinzel', 'italic 600 40px "Liberation Serif"', '700 40px "Liberation Serif"'].map(f => document.fonts.load(f).catch(() => 0)));
window.READY = true;
