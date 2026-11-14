// Gera filme/shots.json (40 planos) e filme/legenda_ep01.srt.
// Tempos: usa filme/tempos.json (outro agente) quando existir; senao os do roteiro. Legendas: usa audio/vo_times.json quando existir.
// Uso: node filme/tools/gen_shots.mjs   (de qualquer pasta)
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const HERE = path.dirname(fileURLToPath(import.meta.url)), ROOT = path.resolve(HERE, '..'), EP = path.resolve(ROOT, '..');

// ---------- tempos dos planos ----------
// Segmentos de projeto (tempo do roteiro rev.2) -> janelas finais. Planos 3 e 5 divididos (rev.3): 3a/3b/3c, 5a/5b.
const SEG = [['1', 0, 2.8], ['2', 2.8, 5.6], ['3a', 5.6, 6.9], ['3b', 6.9, 8.2], ['3c', 8.2, 9.4], ['4', 9.4, 13.2], ['5a', 13.2, 15], ['5b', 15, 16.8]];
const RS0 = [16.8, 19.8, 22, 25, 28, 31, 34, 36, 39, 42, 45, 48, 51, 53, 56, 59, 61.8, 63.6, 66.6, 69.6, 72.6, 75, 77.5, 80.5, 83.5, 85.5, 88.5, 91.5, 94.5, 97.5, 100.5, 103.5, 106.5, 109.5, 113, 116];
RS0.slice(0, -1).forEach((a, i) => SEG.push([String(6 + i), a, RS0[i + 1]]));
let NEW = {}, SRC = 'roteiro';   // id -> [ini, fim]
SEG.forEach(([id, a, b]) => { NEW[id] = [a, b]; });
try {
  const f = path.join(ROOT, 'tempos.json');
  if (fs.existsSync(f)) {
    let j = JSON.parse(fs.readFileSync(f, 'utf8')); j = Array.isArray(j) ? j : (j.planos || j.shots || j.tempos || Object.values(j).find(Array.isArray));
    const by = {}, byN = {};
    for (const e of j) { const id = String(e.id ?? e.plano ?? e.n), n = parseInt(e.plano ?? e.n ?? id), a = +(e.inicio ?? e.ini ?? e.t0 ?? e.start ?? e.t), b = +(e.fim ?? e.t1 ?? e.end); if (!(n >= 1 && n <= 40) || isNaN(a) || isNaN(b)) continue; by[id] = [a, b]; byN[n] = byN[n] ? [Math.min(byN[n][0], a), Math.max(byN[n][1], b)] : [a, b]; }
    const N = {};
    for (const [id] of SEG) { const n = parseInt(id); if (by[id]) N[id] = by[id]; else if (/^\d+$/.test(id) && byN[n]) N[id] = byN[n]; }
    // 3a/3b/3c e 5a/5b ausentes (tempos antigos): divide o plano pai na proporcao do projeto
    for (const [par, subs] of [[3, ['3a', '3b', '3c']], [5, ['5a', '5b']]]) if (!subs.every(s => N[s]) && byN[par]) { const [a, b] = byN[par], d0 = NEW[subs[0]][0], d1 = NEW[subs[subs.length - 1]][1]; for (const s of subs) N[s] = [a + (NEW[s][0] - d0) / (d1 - d0) * (b - a), a + (NEW[s][1] - d0) / (d1 - d0) * (b - a)]; }
    if (SEG.every(([id]) => N[id])) { NEW = N; SRC = 'tempos.json'; }
  }
} catch (e) { console.error('tempos.json ignorado:', e.message); }
const W = (t) => { let s = SEG.find(([, a, b]) => t >= a && t < b); if (!s) s = t < 0 ? SEG[0] : SEG[SEG.length - 1]; const [id, a, b] = s, [n0, n1] = NEW[id]; return n0 + (t - a) / (b - a) * (n1 - n0); };
const K = (a) => a.map(([t, ...r]) => [+W(t).toFixed(3), ...r]);
const cam = (ks) => ks.map(k => ({ ...k, t: +W(k.t).toFixed(3) }));
const R3 = (x) => +x.toFixed(3);

// ---------- predefinicoes ----------
const C = (t, tx, ty, tz, d, az, el, fov = 30, ease) => ({ t, tgt: [tx, ty, tz], d, az, el, fov, ...(ease ? { ease } : {}) });
const TECO = (o) => ({ id: 'teco', kind: 'side', spec: 'teco_av', focus: true, crack: false, ...o });
const SLIME = (o) => ({ id: 'slime', kind: 'slime', ...o });
const HUDG = { show: true };
const hudBase = {
  lvl: K([[0, 3], [51, 1], [52.4, 2], [79.9, 3]]), hp: K([[0, 56]]), hpMax: K([[0, 56]]), xp: K([[0, 0]]), xpMax: K([[0, 120]]), clock: K([[0, '18:35']]),
};
const HUD_EARLY = (extra = {}) => ({
  show: true, lvl: K([[0, 1]]), hp: K([[0, 40], [29.2, 36], [31.4, 32], [40, 33], [45, 34], [50, 35]]), hpMax: K([[0, 40]]), xp: K([[0, 0], [35, 3], [42, 6], [46.9, 9]]), xpMax: K([[0, 30]]), clock: K([[0, '08:12']]), ...extra,
});
const HUD_L2 = (clock, xp = 39) => ({ show: true, lvl: K([[0, 2]]), hp: K([[0, 48]]), hpMax: K([[0, 48]]), xp: K([[0, xp]]), xpMax: K([[0, 84]]), clock: K([[0, clock]]) });
const HUD_END = (clock = '18:35') => ({ show: true, lvl: K([[0, 3]]), hp: K([[0, 56]]), hpMax: K([[0, 56]]), xp: K([[0, 2]]), xpMax: K([[0, 120]]), clock: K([[0, clock]]) });

// ---------- luta: gera poses do Teco, estados do slime, flutuantes ----------
function fight(o) {
  const { x = 1.12, hits = [], hurts = [], heals = [], die = null, base = 'ready', tip = false, t0 = 0, t1 = 99, hp0 = 20, hideBar = false } = o;
  const tp = [[t0, base]], sp = [[t0, 'idle']], sx = [[t0, x, 0, 0]], fl = [], shp = [[t0, hp0]];
  const ev = [];
  for (const h of hits) { const a = h.tip ?? tip; ev.push([h.t - .6, 'ready'], [h.t - .32, a ? 'wind_tip' : 'wind'], [h.t - .08, h.miss ? 'miss' : (a ? 'strike_tip' : 'strike')], [h.t + .3, base]); }
  for (const u of hurts) ev.push([u.t, 'hurt'], [u.t + .38, base]);
  for (const k of (o.extraTeco || [])) ev.push(k);
  ev.sort((a, b) => a[0] - b[0]);
  // remove sobreposicoes: mantem a ultima entrada de cada instante
  for (const e of ev) if (e[0] >= t0 && e[0] < t1) tp.push(e);
  const sev = [];
  for (const h of hits) if (!h.miss) { sev.push([h.t, 'hit'], [h.t + .22, 'idle']); if (h.dmg) fl.push({ t: h.t + .04, dur: .9, text: String(h.dmg), at: 'slime', color: '#ffffff', sc: 7 }); shp.push([h.t, h.hp]); }
  for (const u of hurts) { sx.push([u.t - .5, x, 0, 0], [u.t - .22, x - .22, 0, .22], [u.t, x - .42, 0, 0], [u.t + .45, x, 0, 0]); sev.push([u.t - .4, 'jump'], [u.t, 'idle']); fl.push({ t: u.t + .04, dur: .9, text: '-' + u.dmg, at: 'teco', color: '#ff5a4a', sc: 7 }); }
  for (const e of heals) { sev.push([e.t, 'heal'], [e.t + .55, 'idle']); fl.push({ t: e.t + .05, dur: .9, text: '+1', at: 'slime', color: '#cfe6ff', sc: 6 }); shp.push([e.t, e.hp]); }
  const flash = [];
  if (die != null) { sev.push([die, 'dying0'], [die + .15, 'dying1'], [die + .5, 'puddle'], [die + (o.puddleFor ?? 2), 'gone']); flash.push([die, .35, '#9ad8ff', .45]); shp.push([die, 0]); }
  sev.sort((a, b) => a[0] - b[0]); for (const e of sev) sp.push(e);
  sx.sort((a, b) => a[0] - b[0]);
  const hurtT = hurts.map(h => h.t);
  return { tp, sp, sx, fl, shp, flash, hurtT };
}
const ucfg = (arr) => K(arr);
const menuAt = (tx, o = {}) => ({ pos: [tx + .99, 1.2, .1], w: .83, ...o });

// ---------- planos ----------
const S = [];
const add = (n, sh) => S.push({ n, t0: R3(NEW[String(n)][0]), t1: R3(NEW[String(n)][1]), ...sh });

// 1: quadro-chave do loop. Teco a esquerda, Menu aberto (Carteira 0,68; Carta com 1 fixo)
const loopCam = C(0, .7, .65, 0, 8.0, 14, 14);
const menuLoop = (o = {}) => ({ screen: 'menu', pos: [.99, 1.2, .1], w: .83, state: { money: '0,68', carta: 1, cartaBlink: 0 }, ...o });
add(1, { set: 'campina', hour: 18.58, cam: cam([C(0, .7, .65, 0, 8.0, 14, 14), C(2.8, .7, .65, 0, 7.3, 14, 14)]), actors: [TECO({ pos: [0, 0, 0], pose: K([[0, 'menu_r']]), crack: true, face: 1 })], hud: HUD_END(), menu: menuLoop(), aper: 110 });
// 2: Banca (explicacao): jogador de costas poe item brilhante
add(2, { set: 'banca', cam: cam([C(2.8, 0, 1.15, -3, 7.6, 8, 10), C(5.6, 0, 1.2, -3, 6.2, 6, 9)]), focus: [0, 1.2, -3], coinT: R3(W(3.7)),
  actors: [{ id: 'npc', kind: 'back', spec: 'npc1', pos: [-.15, 0, -2.3], pose: K([[2.8, 'stand']]) }, { id: 'it', kind: 'item', id2: 'g', ...{ id: 'gd' }, kind: 'item', id: 'gosmaD', k: .85, pos: K([[2.8, .1, -3.5, 1.0], [3.4, .1, -3.5, 1.6], [3.7, .1, -3.5, 1.24]]), show: K([[3.2, 5.6]]), glow: 1 },
    { id: 'npc3', kind: 'side', spec: 'npc3', pos: [4.8, 0, -2.2], pose: K([[2.8, 'stand']]), face: -1 }],
  floats: [{ t: R3(W(3.75)), dur: R3(W(5.6) - W(3.75)), text: 'R$ 3,00', at: [.15, 1.55, -3.5], color: '#ffd24a', sc: 9 }], aper: 100 });
// 3: cozinha 08:00
const kit3 = (tx) => [
  { id: 'dad', kind: 'side', spec: 'rogerio', pos: [-4.3, -.1, -1.3], pose: K([[5.6, 'sit_dad'], [8.0, 'sit_dad_nod']]), face: 1, noBlob: 1 },
  { id: 'mom', kind: 'side', spec: 'sandra', pos: [-5.7, 0, -2.0], pose: K([[5.6, 'point_clock'], [6.4, 'point_clock_b']]), face: 1 },
  { id: 'visor', kind: 'item', id2: 0, ...{ id: 'visor' }, kind: 'item', k: .55, pos: [-3.85, .8, -1.5] }];
const mom3 = (pose) => ({ id: 'mom', kind: 'side', spec: 'sandra', pos: [-5.5, 0, -1.9], pose, face: 1 });
const dad3 = (pose) => ({ id: 'dad', kind: 'side', spec: 'rogerio', pos: [-4.3, -.1, -1.3], pose, face: 1 });
const visor3 = { id: 'visor', kind: 'item', ...{ id: 'visor' }, kind: 'item', k: .55, pos: [-3.85, .8, -1.5] };
add('3a', { set: 'casa', cam: cam([C(5.6, -4.3, .75, -1.5, 10.6, 10, 13), C(6.9, -3.9, .75, -1.5, 10.2, 11, 13)]), focus: [-3.4, 1, -1.2], aper: 90,
  actors: [dad3(K([[5.6, 'sit_dad']])), mom3(K([[5.6, 'point_clock'], [6.2, 'point_clock_b']])), visor3, TECO({ pos: [-2.6, 0, -.9], pose: K([[5.6, 'hold_mug']]), face: -1, focus: false })] });
add('3b', { set: 'casa', cam: cam([C(6.9, -4.2, 1.05, -1.3, 5.4, 12, 9), C(8.2, -4.1, 1.05, -1.3, 5.0, 12, 9)]), focus: [-4.2, 1.2, -1.3], aper: 120,
  actors: [dad3(K([[6.9, 'sit_dad_talk']])), mom3(K([[6.9, 'worry']])), visor3, TECO({ pos: [-2.9, 0, -2.3], pose: K([[6.9, 'hold_mug']]), face: -1, focus: false })] });
add('3c', { set: 'casa', cam: cam([C(8.2, -5.2, 1.0, -1.9, 5.8, 12, 9), C(9.4, -5.1, 1.0, -1.9, 5.4, 12, 9)]), focus: [-5.4, 1.1, -1.9], aper: 120,
  actors: [dad3(K([[8.2, 'sit_dad']])), mom3(K([[8.2, 'point_clock_talk']])), visor3, TECO({ pos: [-2.6, 0, -.9], pose: K([[8.2, 'hold_mug']]), face: -1, focus: false })] });
// 4: Teco pega o Visor (mao direita), mug na pia (esq.), sai de costas
add(4, { set: 'casa', cam: cam([C(9.4, -3.6, .8, -1.5, 8.6, 10, 12), C(11.3, -1.8, .8, -1.5, 8.2, 12, 12), C(13.2, .4, .8, -1.5, 8.0, 12, 12)]), focus: [-1.6, 1, -1], aper: 90, fogK: .9,
  actors: [
    { id: 'dad', kind: 'side', spec: 'rogerio', pos: [-4.3, -.1, -1.3], pose: K([[9.4, 'sit_dad'], [10.6, 'shake'], [11.6, 'sit_dad']]), face: 1 },
    { id: 'mom', kind: 'side', spec: 'sandra', pos: [-5.7, 0, -2.0], pose: K([[9.4, 'worry']]), face: 1 },
    { id: 'visor', kind: 'item', id2: 1, ...{ id: 'visor' }, kind: 'item', k: .55, pos: [-3.85, .8, -1.5], show: K([[9.4, 10.35]]) },
    TECO({ spec: 'teco_real', pos: K([[9.4, -3.4, -.9], [10.4, -3.4, -.9], [11.9, -.35, -.9], [12.2, -.35, -.9], [13.2, 1.2, -.9]]), pose: K([[9.4, 'grab_visor'], [10.4, 'walk_mug'], [11.95, 'sink'], [12.4, 'walk_mug']]), face: 1, face_k: K([[9.4, -1], [10.4, 1]]), focus: true, show: K([[9.4, 12.45]]) }),
    { id: 'tecoB', kind: 'back', spec: 'teco_real', pos: K([[12.45, -.2, -1.0], [13.2, .9, -1.2]]), pose: K([[12.45, 'stand']]), show: K([[12.45, 13.2]]), focus: true }] });
// 5: porta do quarto (quadro-chave)
const par5 = (t) => [{ id: 'dad', kind: 'side', spec: 'rogerio', pos: [4.3, 0, -2.0], pose: K([[t, 'arms_crossed'], [15.4, 'shake'], [15.9, 'arms_crossed']]), face: 1 }, { id: 'mom', kind: 'side', spec: 'sandra', pos: [5.0, 0, -2.0], pose: K([[t, 'worry']]), face: 1 }];
add('5a', { set: 'casa', corredor: true, cam: cam([C(13.2, 4.8, .75, -.5, 9.6, -8, 14), C(15, 5.4, .75, -.5, 9.0, -8, 14)]), focus: [5.4, 1.1, -.2], aper: 150,
  actors: [...par5(13.2), TECO({ spec: 'teco_real', pos: K([[13.2, 3.6, -.2], [14.5, 5.95, -.2]]), pose: K([[13.2, 'walk'], [14.5, 'door']]), face: -1, face_k: K([[13.2, 1], [14.5, -1]]) })] });
add('5b', { set: 'casa', corredor: true, cam: cam([C(15, 5.4, .75, -.5, 9.0, -8, 14), C(16.8, 5.4, .75, -.5, 8.4, -6, 14)]), focus: [6, 1.1, -.2], aper: 150,
  actors: [...par5(15), TECO({ spec: 'teco_real', pos: [5.95, 0, -.2], pose: K([[15, 'door'], [15.2, 'door_whisper'], [16.6, 'door']]), face: -1 })] });
// 6: quarto, deita e poe o Visor
add(6, { set: 'quarto', cam: cam([C(16.8, 1.4, .95, -2, 8.6, 10, 8), C(19.8, .9, .85, -2.2, 5.4, 12, 6)]), focus: [1.2, .9, -2], exposure: ucfg([[16.8, 1], [19.8, .62]]), aper: 120,
  actors: [{ id: 'teco', kind: 'side', spec: 'teco_real', pos: [1.95, .0, -1.45], pose: K([[16.8, 'sit_visor']]), face: -1, show: K([[16.8, 18.2]]), focus: true },
    { id: 'tecoL', kind: 'lying', pose: K([[18.2, 'plain'], [19.0, 'visor']]), pos: [1.4, .64, -2.2], show: K([[18.2, 19.8]]), focus: true }] });
// 7: campina, abre os olhos; cartao Nivel 1
add(7, { set: 'campina', hour: 8.2, cam: cam([C(19.8, .5, .68, 0, 8.4, 18, 14), C(22, .45, .68, 0, 7.8, 16, 14)]), hud: HUD_EARLY(),
  actors: [TECO({ pos: [0, 0, 0], pose: K([[19.8, 'idle_closed'], [20.5, 'idle_g']]) })] });
// ---- lutas: luta 1 (13 s, HP do slime conferido golpe a golpe)
const F1 = fight({ x: 1.12, t0: 22.0, hits: [{ t: 25.2, dmg: 3, hp: 17 }, { t: 26.2, dmg: 2, hp: 15 }, { t: 27.1, miss: 1 }, { t: 28.6, dmg: 4, hp: 12 }, { t: 29.9, dmg: 3, hp: 9 }, { t: 31.0, miss: 1 }, { t: 34.1, dmg: 3, hp: 7 }, { t: 34.55, dmg: 4, hp: 3 }, { t: 35.0, dmg: 3, hp: 0 }],
  heals: [{ t: 27.7, hp: 16 }, { t: 31.15, hp: 10 }], hurts: [{ t: 29.2, dmg: 4 }, { t: 31.4, dmg: 4 }], die: 35.0, base: 'ready', puddleFor: 2.4,
  extraTeco: [[22.0, 'idle_g'], [23.9, 'ready'], [31.75, 'pant'], [32.4, 'whisper_g'], [33.9, 'ready']] });
const slimeIn = [[22.1, 3.8, 0, 0], [22.4, 3.2, 0, .55], [22.7, 2.6, 0, 0], [23.0, 2.0, 0, .5], [23.3, 1.12, 0, 0]];
const luta1 = (a, b, extra = {}) => {
  const sel = (arr) => arr.filter(e => e[0] >= a - 1.2 && e[0] <= b + .01);
  const lastBefore = (arr, t) => { let v = arr[0]; for (const e of arr) if (e[0] <= t) v = e; return v; };
  const tp = [[a, lastBefore(F1.tp, a)[1]], ...F1.tp.filter(e => e[0] > a && e[0] <= b)];
  const sp = [[a, lastBefore(F1.sp, a)[1]], ...F1.sp.filter(e => e[0] > a && e[0] <= b)];
  const sxk = F1.sx.filter(e => e[0] >= a - 1 && e[0] <= b + 1);
  return { teco: TECO({ pos: [0, 0, 0], pose: K(tp), ...extra }), slime: SLIME({ pos: K(sxk.length ? sxk : [[a, 1.12, 0, 0]]), pose: K(sp) }) };
};
{ // 8
  const slimePos = [...slimeIn, [23.4, 1.12, 0, 0]];
  add(8, { set: 'campina', hour: 8.3, cam: cam([C(22, .8, .7, 0, 7.8, 6, 10), C(25, .65, .7, 0, 7.4, 8, 10)]), hud: HUD_EARLY(), cron: K([[22, 0], [35, 13]]), floats: [],
    slimebar: { actor: 'slime', hp: K([[22, 20]]), max: 20 }, actors: [TECO({ pos: [0, 0, 0], pose: K([[22, 'idle_g'], [23.9, 'ready']]) }), SLIME({ pos: K(slimePos), pose: K([[22, 'gone'], [22.1, 'jump'], [23.3, 'idle']]) })] });
}
const fightShot = (n, a, b, camKeys, o = {}) => {
  const L = luta1(a, b);
  add(n, { set: 'campina', hour: o.hour ?? 8.4, cam: cam(camKeys), hud: HUD_EARLY(), cron: K([[22, 0], [35, 13]]), floats: FL(F1.fl.filter(f => f.t >= a - .1 && f.t < b)), flash: F1.flash.filter(f => f[0] >= a && f[0] < b).map(f => [R3(W(f[0])), f[1], f[2], f[3]]).map(x => x),
    slimebar: { actor: 'slime', hp: K(F1.shp.filter(e => e[0] <= b)), max: 20 }, actors: [L.teco, L.slime], ...o.extra });
};
for (const s of []) { }
// os flutuantes do F1 estao em tempo de projeto: converte
const FL = (arr) => arr.map(f => ({ ...f, t: R3(W(f.t)) }));
fightShot(9, 25, 28, [C(25, .6, .75, 0, 7.4, 6, 10), C(28, .55, .75, 0, 7.2, 10, 10)]);
fightShot(10, 28, 31, [C(28, .6, .7, 0, 7.4, 14, 14), C(28.95, .6, .7, 0, 7.4, 14, 14), C(28.97, .7, .7, 0, 6.6, -10, 12), C(29.9, .7, .7, 0, 6.6, -10, 12), C(29.92, .5, .7, 0, 7.0, 22, 14), C(31, .5, .7, 0, 7.0, 22, 14)]);
fightShot(11, 31, 34, [C(31, .55, .7, 0, 7.2, 14, 14), C(34, .55, .7, 0, 6.5, 14, 14)]);
fightShot(12, 34, 36, [C(34, .6, .75, 0, 7.4, 6, 10), C(36, .6, .75, 0, 7.0, 6, 10)]);
// 13: gosma na poca; Teco pega
add(13, { set: 'campina', hour: 8.5, cam: cam([C(36, .9, .6, 0, 6.2, 12, 6), C(39, .9, .6, 0, 5.2, 12, 6)]), hud: HUD_EARLY(), cnt: null, focus: [1.0, .35, 0],
  bag: K([[38.2, '1']]), floats: [{ t: R3(W(36.4)), dur: R3(W(37.6) - W(36.4)), text: '0,04', at: [1.12, .75, 0], color: '#ffd24a', sc: 6 }],
  actors: [TECO({ pos: K([[36, 0, 0], [37.3, .85, 0]]), pose: K([[36, 'ready'], [36.3, 'idle_g'], [36.9, 'walk'], [37.3, 'pickup'], [38.1, 'idle_g']]), focus: false }),
    SLIME({ pos: [1.12, 0, 0], pose: K([[36, 'puddle'], [37.4, 'gone']]) }),
    { id: 'gosma', kind: 'item', id2: 3, ...{ id: 'gosma' }, kind: 'item', k: .9, pos: K([[35.7, 1.12, 0, 0], [36.0, 1.12, 0, .55], [36.3, 1.12, 0, .05]]), show: K([[35.7, 37.95]]) }] });
// 14: Carteira 0,00 (por cima do ombro)
const shoulder = (a, b, screen, state, o = {}) => ({ set: 'campina', hour: o.hour ?? 8.6, cam: cam([C(a, 1.0, 1.25, 0, 3.4, -24, 5), C(b, 1.0, 1.25, 0, 3.0, -22, 5)]), focus: [1.0, 1.25, .1], aper: o.aper ?? 14, tilt: [2, .6, .3], maxCoc: 8,
  menu: { screen: [[R3(W(a)), screen]], pos: [1.0, 1.25, .1], w: o.w ?? .66, state, yaw: 0 }, actors: o.actors ?? [TECO({ pos: [.05, 0, -.5], pose: K([[a, 'menu_r']]), focus: false })], hud: o.hud, ...(o.extra || {}) });
add(14, shoulder(39, 42, 'carteira', { money: '0,00', meta: 0 }, { hud: HUD_EARLY() }));
add(15, shoulder(42, 45, 'drops', { pct: '65%', cnt: '0/3', dots: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }, { hud: HUD_EARLY() }));
// 16: terceira luta (sem drop); contador 1/3
{
  const F3 = fight({ x: 1.12, t0: 45, hits: [{ t: 45.5, dmg: 3, hp: 17 }, { t: 46.1, dmg: 4, hp: 13 }, { t: 46.6, dmg: 3, hp: 10 }, { t: 47.05, dmg: 4, hp: 6 }, { t: 47.5, dmg: 6, hp: 0 }], die: 47.5, puddleFor: 3, base: 'idle_g', extraTeco: [[45, 'idle_g']] });
  add(16, { set: 'campina', hour: 9.2, cam: cam([C(45, .2, .7, 0, 7.4, 10, 12), C(48, .8, .7, 0, 7.0, 12, 12)]), hud: HUD_EARLY(), cnt: K([[45, '0/3'], [47.5, '1/3']]), floats: FL(F3.fl), flash: F3.flash.map(f => [R3(W(f[0])), f[1], f[2], f[3]]),
    slimebar: { actor: 'slime', hp: K(F3.shp), max: 20 }, actors: [TECO({ pos: [0, 0, 0], pose: K(F3.tp) }), SLIME({ pos: K(F3.sx), pose: K(F3.sp) })] });
}
add(17, shoulder(48, 51, 'drops', { pct: '65%', cnt: '4/10', dots: [0, 1, 0, 0, 1, 0, 1, 0, 0, 1] }, { hud: HUD_EARLY(), w: .66 }));
// 18: montagem de golpes; relogio 09:20 -> 10:05; selo vira 2
{
  const hitsA = [{ t: 51.4, dmg: 5, hp: 15, tip: false }, { t: 51.95, dmg: 4, hp: 11 }, { t: 52.5, dmg: 4, hp: 7 }];
  const F = fight({ x: 1.12, t0: 51, hits: hitsA, die: 52.9, base: 'idle_g' });
  add(18, { set: 'campina', hour: [[R3(W(51)), 9.4], [R3(W(53)), 10.2]], cam: cam([C(51, .6, .7, 0, 6.8, 10, 12), C(51.62, .6, .7, 0, 6.8, 10, 12), C(51.64, .8, .7, 0, 5.6, -16, 10), C(52.25, .8, .7, 0, 5.6, -16, 10), C(52.27, .5, .7, 0, 7.2, 24, 14), C(53, .5, .7, 0, 7.2, 24, 14)]),
    hud: { show: true, lvl: K([[0, 1], [52.4, 2]]), hp: K([[0, 35], [52.4, 48]]), hpMax: K([[0, 40], [52.4, 48]]), xp: K([[0, 9], [52.4, 0]]), xpMax: K([[0, 30], [52.4, 84]]), clock: K([[0, '09:20'], [51.5, '09:40'], [52.1, '10:00'], [52.4, '10:05']]) },
    floats: FL(F.fl), flash: [...F.flash.map(f => [R3(W(f[0])), f[1], f[2], f[3]]), [R3(W(52.4)), .5, '#fff2b8', .4]], slimebar: { actor: 'slime', hp: K(F.shp), max: 20 }, actors: [TECO({ pos: [0, 0, 0], pose: K(F.tp) }), SLIME({ pos: K(F.sx), pose: K(F.sp) })] });
}
// 19-21: Banca, 13:08
const bancaNpc = [{ id: 'n3', kind: 'side', spec: 'npc3', pos: [4.4, 0, -2.2], pose: K([[53, 'stand']]), face: -1 }, { id: 'n2', kind: 'side', spec: 'npc2', pos: [-6.4, 0, -2.0], pose: K([[53, 'stand']]), face: 1 }];
add(19, { set: 'banca', cam: cam([C(53, -2.6, .75, -1.5, 8.6, 10, 12), C(56, .8, .75, -1.5, 8.6, 10, 12)]), hud: HUD_L2('13:08'), aper: 100,
  actors: [TECO({ pos: K([[53, -3.0, -1.4], [55.6, 0.5, -1.4]]), pose: K([[53, 'walk'], [55.6, 'stand']]) }), ...bancaNpc] });
const curve = [.5, .5, .5, .5, .5, .3, .3, .3, .3, .3, .3, .3, .3, .3, .3, .3, .3, .5, .5, .5, .5, .5, .5, .5];
add(20, { set: 'banca', cam: cam([C(56, -.2, 2.9, -7.7, 9.6, -6, 6, 40), C(59, -.2, 2.9, -7.7, 8.8, -6, 6, 40)]), focus: [-.2, 3.0, -7.7], aper: 40, hud: HUD_L2('13:08'),
  price: { curve, mark: 23, red: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], price: '0,04', fila: 2 },
  actors: [TECO({ pos: [-1.3, 0, -2.0], pose: K([[56, 'stand']]), focus: false })] });
{
  const items = []; const pos = [[-.9, 0], [-.6, 0], [-.3, 0], [0, 0], [.3, 0], [-.9, .25], [-.6, .25], [-.3, .25], [0, .25], [.3, .25], [-.75, .5], [-.45, .5], [-.15, .5], [.15, .5], [.45, .5]];
  pos.forEach(([x, dz], i) => items.push({ id: 'g' + i, kind: 'item', ...{ id: 'gosma' }, kind: 'item', k: .55, pos: [.3 + x, 1.17, -3.2 - dz * .5 + .1], show: K([[59.5 + i * .02, 60.3 + i * .0]]) }));
  add(21, { set: 'banca', cam: cam([C(59, .85, 1.25, -3, 6.6, 8, 8), C(61.8, .85, 1.25, -3, 6.0, 8, 8)]), focus: [.2, 1.3, -3], coinT: R3(W(60.4)), hud: HUD_L2('13:08'), aper: 80,
    menu: { screen: [[R3(W(59)), 'carteira']], pos: [1.55, 1.95, -2.6], w: .6, state: { moneyLin: K([[60.3, 0], [61.5, 68]]), meta: 0.68 } },
    actors: [TECO({ pos: [.05, 0, -2.2], pose: K([[59, 'stand'], [59.4, 'put'], [60.3, 'stand']]) }), { id: 'po', kind: 'item', ...{ id: 'po' }, kind: 'item', k: .6, pos: [.7, 1.17, -3.0], show: K([[59.5, 60.3]]) }, ...items] });
}
// 22: quarto 14:20
add(22, { set: 'quarto', cam: cam([C(61.8, .2, .95, -2, 7.2, 8, 8), C(63.6, 1.0, .95, -2, 7.0, 8, 8)]), focus: [.6, .9, -2.0], aper: 110, hud: null,
  actors: [{ id: 'tecoL', kind: 'lying', pose: K([[61.8, 'visor']]), pos: [1.4, .64, -2.2], focus: false },
    { id: 'mom', kind: 'side', spec: 'sandra', pos: K([[61.8, -3.4, -1.3], [62.7, -1.5, -1.3], [63.0, -1.5, -1.3], [63.6, -3.0, -1.3]]), pose: K([[61.8, 'plate'], [62.7, 'worry'], [63.1, 'worry']]), face: 1, face_k: K([[61.8, 1], [63.1, -1]]) },
    { id: 'prato', kind: 'item', ...{ id: 'plate' }, kind: 'item', k: .55, pos: [-.5, .62, -2.4], show: K([[62.8, 63.6]]) }] });
// 23-26: fisica do galho (campina, tarde)
const swingSlow = [[63.6, 'idle_g'], [64.2, 'ready'], [64.9, 'wind'], [65.6, 'strike'], [66.3, 'ready']];
add(23, { set: 'campina', hour: 15.6, cam: cam([C(63.6, .55, .8, 0, 7.0, 8, 8), C(66.6, .6, .8, 0, 6.6, 8, 8)]), hud: HUD_L2('14:40'), aper: 100,
  menu: { screen: [[R3(W(63.6)), 'diagrama']], pos: [.98, 1.95, .2], w: .66, state: {} }, actors: [TECO({ pos: [0, 0, 0], pose: K(swingSlow) })] });
add(24, { set: 'campina', hour: 15.8, cam: cam([C(66.6, .6, .7, 0, 7.4, 14, 14), C(69.6, .55, .7, 0, 7.0, 14, 14)]), hud: HUD_L2('14:41'), trails: { actor: 'teco', hand: 1, tip: 1 },
  actors: [TECO({ pos: [0, 0, 0], pose: K([[66.6, 'ready'], [67.2, 'wind'], [67.5, 'strike'], [67.9, 'ready'], [68.4, 'wind'], [68.7, 'strike'], [69.1, 'swing_air'], [69.4, 'ready']]) })] });
{
  const F = fight({ x: 1.12, t0: 69.6, tip: true, hits: [{ t: 70.0, dmg: 5, hp: 15 }, { t: 70.55, dmg: 4, hp: 11 }, { t: 71.1, dmg: 5, hp: 6 }, { t: 71.65, dmg: 6, hp: 0 }], die: 71.65, base: 'idle_g', puddleFor: 3 });
  add(25, { set: 'campina', hour: 16.0, cam: cam([C(69.6, .6, .7, 0, 6.6, 10, 12), C(70.2, .6, .7, 0, 6.6, 10, 12), C(70.22, .7, .7, 0, 5.6, -14, 10), C(70.9, .7, .7, 0, 5.6, -14, 10), C(70.92, .5, .7, 0, 7.0, 22, 14), C(72.6, .5, .7, 0, 7.0, 22, 14)]), hud: HUD_L2('14:42', 66), cron: K([[69.6, 2.6], [71.65, 8], [72.6, 8]]),
    floats: FL(F.fl), flash: F.flash.map(f => [R3(W(f[0])), f[1], f[2], f[3]]), slimebar: { actor: 'slime', hp: K(F.shp), max: 20 }, actors: [TECO({ pos: [0, 0, 0], pose: K([...F.tp, [72.0, 'smile']]) }), SLIME({ pos: K(F.sx), pose: K(F.sp) })] });
}
// 26: macro rachadura
add(26, { set: 'campina', hour: 16.2, cam: cam([C(72.6, .66, 1.02, 0, 2.2, 4, 3, 28), C(75, .66, 1.02, 0, 1.3, 4, 3, 28)]), focus: [.66, 1.02, 0], aper: 40, hud: HUD_L2('14:43', 69),
  actors: [TECO({ pos: [0, 0, 0], pose: K([[72.6, 'idle_g']]), crack: true })] });
// 27: plano geral elevado (passagem do dia)
{
  const crowd = []; const spots = [[-1.2, -.4], [4.5, -1.2], [-6.5, -2.2], [9, -3], [-3, -6], [2, -8], [-10, -7], [7, -10]];
  spots.forEach(([x, z], i) => { if (i === 0) return; for (let k = 0; k < 3 + (i % 3); k++) crowd.push({ id: 'c' + i + k, kind: 'side', spec: 'npc' + (1 + (i + k) % 4), pos: [x - .9 - k * .75, 0, z + .1 * k], pose: K([[75, 'stand']]), face: 1, blob: false }); });
  add(27, { set: 'campina', hour: [[R3(W(75)), 16.5], [R3(W(77.5)), 17.7]], cam: cam([C(75, 0, 0, -3, 46, 0, 52, 38), C(77.5, 0, 0, -3, 34, 0, 56, 38)]), fogK: .35, hud: HUD_L2('16:40'), focus: [0, .4, 0], aper: 15, tilt: [14, .2, .4],
    hudClock: 1, actors: [TECO({ pos: [-.7, 0, 0], pose: K([[75, 'ready'], [76, 'wind'], [76.4, 'strike'], [76.8, 'ready']]), k: 1.4 }), SLIME({ pos: [.4, 0, 0], pose: K([[75, 'idle']]), k: 1.0 }), ...crowd] });
  S[S.length - 1].hud.clock = K([[75, '16:40'], [75.6, '17:00'], [76.1, '17:20'], [76.6, '17:40'], [77.2, '17:50']]);
}
// 28: ultimo slime (38), nivel 3
{
  const F = fight({ x: 1.12, t0: 77.5, tip: true, hits: [{ t: 77.95, dmg: 5, hp: 15 }, { t: 78.55, dmg: 4, hp: 11 }, { t: 79.15, dmg: 5, hp: 6 }, { t: 79.75, dmg: 6, hp: 0 }], die: 79.8, base: 'idle_g', puddleFor: 2 });
  add(28, { set: 'campina', hour: 17.85, cam: cam([C(77.5, .3, .7, 0, 7.0, 12, 12), C(80.5, .8, .7, 0, 6.6, 12, 12)]), cron: K([[77.5, 1], [79.8, 8], [80.5, 8]]),
    hud: { show: true, lvl: K([[0, 2], [79.9, 3]]), hp: K([[0, 48], [79.9, 56]]), hpMax: K([[0, 48], [79.9, 56]]), xp: K([[0, 105], [79.9, 0]]), xpMax: K([[0, 84], [79.9, 120]]), clock: K([[0, '18:05']]) },
    floats: FL(F.fl), flash: [...F.flash.map(f => [R3(W(f[0])), f[1], f[2], f[3]]), [R3(W(79.9)), .6, '#fff2b8', .4]], slimebar: { actor: 'slime', hp: K(F.shp), max: 20 }, actors: [TECO({ pos: [0, 0, 0], pose: K([...F.tp, [80.1, 'smile']]) }), SLIME({ pos: K(F.sx), pose: K(F.sp) })] });
}
// 29-32: Menu (por cima do ombro / macro)
const priceNow = { curve: [.3, .3, .3, .3, .3, .3, .3, .3, .3, .3, .3, .3, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .3], mark: 23, red: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 23], price: '0,03', arrow: 1, fila: 6 };
add(29, shoulder(80.5, 83.5, 'banca', priceNow, { hour: 18.2, w: .6, hud: HUD_END('18:30'), actors: [TECO({ pos: [.05, 0, -.5], pose: K([[80.5, 'menu_r']]), focus: false })] }));
add(30, shoulder(83.5, 85.5, 'mochila', { gosma: 9, po: 1 }, { hour: 18.3, hud: HUD_END('18:30') })); S[S.length - 1].menu.screen = K([[83.5, 'mochila'], [85.0, 'menu']]); S[S.length - 1].menu.state = { gosma: 9, po: 1, money: '0,68', carta: 1 };
add(31, { ...shoulder(85.5, 88.5, 'carteira', { money: '0,68', meta: .68 }, { hour: 18.3, hud: HUD_END('18:30'), w: .7 }), cam: cam([C(85.5, 1.0, 1.25, 0, 2.6, -14, 4), C(88.5, 1.0, 1.25, 0, 2.2, -12, 4)]) });
add(32, { ...shoulder(88.5, 91.5, 'mochila', { gosma: 9, po: 1, tag: '0,44', tag2: '0,04' }, { hour: 18.3, hud: HUD_END('18:30'), w: .7 }), cam: cam([C(88.5, 1.0, 1.25, 0, 2.6, -14, 4), C(91.5, 1.0, 1.25, 0, 2.2, -12, 4)]) });
// 33: punho no peito (sair), a Carta pisca; ele para
add(33, { set: 'campina', hour: 18.58, cam: cam([C(91.5, .7, .65, 0, 8.0, 14, 14), C(94.5, .7, .65, 0, 7.6, 14, 14)]), hud: HUD_END(), aper: 110,
  menu: { screen: 'menu', pos: [.99, 1.2, .1], w: .83, state: { money: '0,68', carta: 1, blinkFrom: R3(W(92.6)) } },
  actors: [TECO({ pos: [0, 0, 0], pose: K([[91.5, 'menu_r'], [92.1, 'fist_chest'], [93.6, 'idle_g']]), crack: true })] });
add(34, shoulder(94.5, 97.5, 'cartas', { deadline: '08:00' }, { hour: 18.6, hud: HUD_END(), w: .6 }));
add(35, { set: 'mapa', cam: cam([C(97.5, 0, 0, 0, 8, 0, 14)]), actors: [], hud: { show: false } });
// 36: Teco de frente olha a mata escura a leste; Menu aberto (relogio da Carta 08:00)
add(36, { set: 'campina', hour: 18.72, cam: cam([C(100.5, .1, .95, 0, 10.0, 0, 12), C(103.5, .1, .95, 0, 9.2, 0, 12)]), hud: HUD_END(), aper: 110,
  menu: { screen: 'cartas', pos: [-.85, 1.2, .35], w: .56, state: { deadline: '08:00' } }, actors: [TECO({ kind: 'front', pos: [0, 0, 0], pose: K([[100.5, 'look']]) })] });
add(37, { set: 'campina', hour: 18.72, cam: cam([C(103.5, .1, .95, 0, 9.6, 0, 10), C(106.5, .1, .95, 0, 9.0, 0, 10)]), hud: HUD_END(), aper: 120,
  actors: [TECO({ kind: 'front', pos: [0, 0, 0], pose: K([[103.5, 'stand'], [104.0, 'point']]), crack: true })] });
// 38: Teco entre duas trilhas (A caverna / B cidade e Carta rasgada em cinzas)
add(38, { set: 'campina', hour: 18.72, cam: cam([C(106.5, 0, 1.1, -1, 12.5, -14, 13), C(109.5, 0, 1.1, -1, 12.5, 14, 13)]), hud: HUD_END(), aper: 90,
  actors: [TECO({ kind: 'front', pos: [0, 0, 0], pose: K([[106.5, 'look'], [108, 'stand']]) }),
    { id: 'cave', kind: 'item', ...{ id: 'cave' }, kind: 'item', k: 2.0, pos: [-3.4, 0, -3.2], shadow: true }, { id: 'city', kind: 'item', ...{ id: 'city' }, kind: 'item', k: 2.0, pos: [3.6, 0, -3.4], shadow: true },
    { id: 'l1', kind: 'item', ...{ id: 'lamp' }, kind: 'item', k: 1.1, pos: [1.8, 0, -1.2], shadow: false }, { id: 'l2', kind: 'item', ...{ id: 'lamp' }, kind: 'item', k: 1.1, pos: [2.9, 0, -.4], shadow: false }, { id: 'l3', kind: 'item', ...{ id: 'lamp' }, kind: 'item', k: 1.1, pos: [4.1, 0, 0.3], shadow: false },
    { id: 'ash', kind: 'item', ...{ id: 'ash' }, kind: 'item', k: .8, pos: [1.2, 0, .5] }] });
// 39: Teco reabre o Menu (Carteira, Carta com 1 fixo)
add(39, { set: 'campina', hour: 18.6, cam: cam([C(109.5, .4, .95, 0, 10.0, 0, 12), C(113, .5, .8, 0, 8.6, 4, 13)]), hud: HUD_END(), aper: 110,
  menu: { screen: 'menu', pos: [.95, 1.22, .1], w: .83, state: { money: '0,68', carta: 1 }, show: K([[110.6, 116]]) },
  actors: [TECO({ kind: 'front', pos: [0, 0, 0], pose: K([[109.5, 'stand'], [110.4, 'menu']]) })] });
// 40: dolly out e giro ate o enquadramento do plano 1 (loop)
add(40, { set: 'campina', hour: 18.58, cam: cam([C(113, .5, .8, 0, 8.6, 4, 13), C(116, .7, .65, 0, 8.0, 14, 14)]), hud: HUD_END(), aper: 110,
  menu: { screen: 'menu', pos: [.99, 1.2, .1], w: .83, state: { money: '0,68', carta: 1 } },
  actors: [TECO({ kind: 'front', pos: [0, 0, 0], pose: K([[113, 'menu']]), show: K([[113, 114.9]]) }), TECO({ pos: [0, 0, 0], pose: K([[114.9, 'menu_r']]), crack: true, show: K([[114.9, 117]]) })] });

// ---------- textos extras (zona segura) ----------
const T = (id, kind, text, a, b, box, extra = {}) => ({ id, kind, text, t0: R3(W(a)), t1: R3(W(b)), x0: box[0], y0: box[1], x1: box[2], y1: box[3], ...extra });
const texts = [
  T('titulo', 'title', 'LOGADO', 2.9, 5.5, [100, 420, 830, 560]),
  T('nivel1', 'card', 'Nível 1', 19.9, 21.9, [100, 800, 830, 950]),
  T('campina', 'label', 'CAMPINA MANSA', 22.2, 24.4, [100, 440, 830, 500]),
  T('banca', 'label', 'BANCA DE COMPRAS', 53.2, 55.4, [100, 440, 830, 500]),
  T('mapa1', 'label', 'PORTO MANSO', 97.8, 100.3, [150, 480, 560, 540], { size: 30 }),
  T('mapa2', 'label', 'CAVERNA DO BREJO', 97.8, 100.3, [380, 840, 930, 900], { size: 30 }),
  T('mapa3', 'label', 'CAMPINA MANSA', 97.8, 100.3, [100, 1010, 520, 1070], { size: 30 }),
  T('manda', 'call', 'manda pra quem duvida', 102.9, 106.4, [100, 400, 830, 500], { size: 66 }),
  T('ab', 'call', 'A ou B? comenta', 110.4, 115.6, [100, 400, 830, 500], { size: 72 }),
];

// ---------- legendas: voz real (audio/vo_times.json) ou janelas do roteiro ----------
const WIN = { 1: [.1, 2.7], 2: [2.8, 7.6], 3: [7.7, 12.5], 4: [13.4, 16.6], 5: [16.8, 21.2], 6: [21.3, 23.9], 7: [24, 28.8], 8: [28.9, 31.1], 9: [31.7, 34.3], 10: [35.8, 38.4], 11: [38.5, 41.5], 12: [41.6, 49], 13: [49.1, 52.1], 14: [52.2, 57.8], 15: [57.9, 61.8], 16: [61.9, 63.3], 17: [63.4, 69.5], 18: [69.6, 73], 19: [73.1, 74.9], 20: [75, 79.8], 21: [79.9, 80.9], 22: [81, 85.4], 23: [85.5, 91.1], 24: [91.2, 97.3], 25: [97.4, 102.2], 26: [102.3, 107.9], 27: [108, 115] };
const rot = fs.readFileSync(path.join(EP, 'ROTEIRO.md'), 'utf8');
const lines = {}; for (const m of rot.matchAll(/^(\d+)\. (.+)$/gm)) { const n = +m[1]; if (n >= 1 && n <= 27 && !lines[n] && /^\[|^[A-ZÀ-Ú]/.test(m[2])) lines[n] = m[2]; }
const subs = []; let subSrc = 'roteiro';
const clean = (s) => s.replace(/\[[^\]]*\]\s*/g, '').trim();
let vo = null; try { if (SRC !== 'tempos.json') throw 0; vo = JSON.parse(fs.readFileSync(path.join(EP, 'audio', 'vo_times.json'), 'utf8')); subSrc = 'audio/vo_times.json'; } catch { }
function chunk(text) {
  const w = text.split(/\s+/), out = []; let cur = [];
  for (let i = 0; i < w.length; i++) { cur.push(w[i]); const end = /[.!?:;,]$/.test(w[i]); const left = w.length - i - 1; if ((cur.length >= 7) || (end && cur.length >= 3 && left >= 2) || (cur.length >= 5 && end)) { out.push(cur.join(' ')); cur = []; } }
  if (cur.length) { if (out.length && cur.length < 2) out[out.length - 1] += ' ' + cur.join(' '); else out.push(cur.join(' ')); }
  return out;
}
for (let n = 1; n <= 27; n++) {
  let t0, t1, text, who = 'N', speaker = null;
  const v = vo?.lines?.find(l => l.linha === n);
  if (v) { t0 = v.t; t1 = v.end; text = v.texto; who = v.who; } else { [t0, t1] = WIN[n]; text = clean(lines[n] || ''); t0 = W(t0); t1 = W(t1); who = (n === 4 || n === 9) ? 'S' : 'N'; }
  if (!text) continue;
  const parts = chunk(text), tot = parts.reduce((s, p) => s + p.length, 0); let a = t0;
  parts.forEach((p, i) => { const d = (t1 - t0) * p.length / tot; subs.push({ t0: R3(a), t1: R3(a + d), text: p, kind: who === 'S' ? 'whisper' : 'narr', line: n, ...(speaker ? { speaker } : {}) }); a += d; });
}
// falas dos pais (rev.3): P1 Rogerio no plano 3b, P2 Sandra no plano 3c
const P = [['rogerio', '3b', 'Desliga isso, Mateus. Jogo não paga conta.', 3.04, /p0?1/i], ['sandra', '3c', 'Filho, sai um pouco dessa tela. Você nem almoçou.', 4.24, /p0?2/i]];
for (const [spk, id, text, d, re] of P) {
  const v = vo?.lines?.find(l => re.test(String(l.id)) || re.test(String(l.linha)) || String(l.who) === spk);
  const t0 = v ? v.t : NEW[id][0] + .15, t1 = v ? v.end : t0 + d, parts = chunk(text), tot = parts.reduce((s, p) => s + p.length, 0); let a = t0;
  parts.forEach(p => { const dd = (t1 - t0) * p.length / tot; subs.push({ t0: R3(a), t1: R3(a + dd), text: p, kind: 'narr', line: spk, speaker: spk }); a += dd; });
}
subs.sort((a, b) => a.t0 - b.t0);
const dur = R3(NEW['40'][1]);
const out = {
  meta: { w: 1080, h: 1920, dur, fps: 24, fonte_tempos: SRC, fonte_legendas: subSrc, nota: 'Gerado por filme/tools/gen_shots.mjs; tempos de plano de filme/tempos.json (se existir) e legendas de audio/vo_times.json (se existir).' },
  speakers: { teco: { name: 'Teco', color: '#E01030', plate: false }, rogerio: { name: 'Rogério', color: '#2a8a9a' }, sandra: { name: 'Sandra', color: '#e0a820' } },
  texts,
  shots: S.map(s => { const o = { ...s }; for (const k of Object.keys(o)) if (o[k] === undefined) delete o[k]; return o; }),
  subs,
};
fs.writeFileSync(path.join(ROOT, 'shots.json'), JSON.stringify(out));
// SRT
const ts = (t) => { const ms = Math.round(t * 1000), h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60; return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`; };
fs.writeFileSync(path.join(ROOT, 'legenda_ep01.srt'), subs.map((c, i) => `${i + 1}\n${ts(c.t0)} --> ${ts(c.t1)}\n${c.kind === 'whisper' ? '“' + c.text + '”' : c.text}\n`).join('\n'));
console.log('shots', out.shots.length, 'subs', subs.length, 'dur', dur, 'tempos:', SRC, 'legendas:', subSrc);
