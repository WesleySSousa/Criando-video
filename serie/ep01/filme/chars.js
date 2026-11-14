// LOGADO ep.1: personagens em pixel art com TABELAS DE POSE (dados), itens e slime.
// Vistas: side (perfil, olhando p/ a direita), front, back, lying. Uma pose nova = uma entrada em POSES.
import { mkk, limb, C, INK, rf2, bb, SPX } from './art.js';
import { ramp, hex, h2 } from './px.js';
const R = (c, dz = .22) => ramp(c, dz);

export const PAL = {
  ...C,
  tee: R(['#202328', '#343840', '#4b515a', '#646b75']),        // camiseta cinza-grafite
  shorts: R(['#08090b', '#121317', '#1f2127', '#2e3138']),    // bermuda preta
  chin: R(['#050505', '#101010', '#1c1c1c']),                // chinelo preto
  polo: R(['#0e2d33', '#18454f', '#255f6c', '#35808f']),      // polo azul-petroleo
  jeans: R(['#0d111c', '#171f33', '#232e4a', '#33426a']),     // jeans escuro
  mustard: R(['#6a4c0c', '#a67a14', '#d49f24', '#eec24a']),   // blusa mostarda
  apron: R(['#767d88', '#9ea5b0', '#c4c9d1', '#e4e7ec']),     // avental cinza-claro
  skinD: R(['#3e2216', '#63391f', '#8a5a3a', '#a87550']),     // pele mais escura (pai)
  skinM: R(['#4a2a1c', '#74462e', '#9a6542', '#b87f56']),
  grey: R(['#4a4a50', '#76767e', '#a2a2aa', '#cacad0']),
  curly: R(['#1c120c', '#3a2416', '#5a3a22', '#7a5230']),
  slimeB: R(['#2f6fb8', '#4aa0e6', '#8fd2ff', '#d8f2ff'], .3),
  plate: R(['#aeb4bc', '#d4d8de', '#eef0f3']),
  rice: R(['#d8d2c0', '#efe9d8', '#fffaf0']),
  egg: R(['#e0a820', '#ffd24a', '#fff0a0']),
  khaki: R(['#6a5c40', '#8d7c58', '#b09c74']),
  visor: R(['#8a919c', '#b6bcc6', '#dde1e8', '#f3f5f8']),
  band: R(['#3c4046', '#5a6068', '#7a828c']),
  mug: R(['#9a3a24', '#c85a3a', '#e88a60']),
  bark: R(['#3a2610', '#62421e', '#8c6a38', '#b8935a']),
};

// ---- especificações de personagem (vestuário, cabelo, volume) ----
export const SPEC = {
  teco_real: { skin: PAL.skin, top: PAL.tee, pants: PAL.shorts, bare: true, shoe: PAL.chin, hair: 'messy', bulk: 1, bags: 0 },
  teco_av: { skin: PAL.skin, top: PAL.shirt, vest: true, pants: PAL.pants, shoe: PAL.boot, hair: 'spiky', bulk: 1, scarf: true, pack: true },
  rogerio: { skin: PAL.skinD, top: PAL.polo, pants: PAL.jeans, shoe: PAL.leather, hair: 'grey', beard: true, glasses: true, bulk: 1.3, k: 1.03 },
  sandra: { skin: PAL.skinM, top: PAL.mustard, apron: true, pants: PAL.jeans, shoe: PAL.leather, hair: 'bun', bulk: .95, k: .94 },
  // figurantes (jogadores/clientes): variam so a roupa
  npc1: { skin: PAL.skinM, top: R(['#3a2a5a', '#5a3f8a', '#7a5ab0']), vest: false, pants: PAL.pants, shoe: PAL.boot, hair: 'spiky', bulk: 1, k: 1 },
  npc2: { skin: PAL.skin, top: R(['#6a2a1a', '#9a4a2a', '#c86a3a']), pants: PAL.khaki, shoe: PAL.boot, hair: 'bun', bulk: .95, k: .95, hairCol: PAL.braid },
  npc3: { skin: PAL.skinD, top: R(['#1a4a3a', '#2a7a5a', '#4aa07a']), pants: PAL.pants, shoe: PAL.boot, hair: 'grey', bulk: 1.1, k: 1.02 },
  npc4: { skin: PAL.skinM, top: R(['#4a4a52', '#767a86', '#a0a4b0']), vest: true, pants: PAL.jeans, shoe: PAL.boot, hair: 'messy', bulk: 1, k: .98 },
};

// ---- esqueleto base (perfil a direita), em px logicos 44x58 ----
const BASE = { head: [22, 7], sh: [21.5, 15], hip: [21, 31], ne: [22.5, 24], nh: [24, 31.5], fe: [21, 24], fh: [23, 31], nk: [22.5, 43], na: [22.5, 52], fk: [19.5, 43], fa: [19.5, 52], face: 'n', hand: 'open', fhand: 'open' };
const P_ = (o = {}) => ({ ...BASE, ...o });
export const POSES = {
  stand: P_(), stand_b: P_({ head: [22, 7.6], sh: [21.5, 15.6] }),
  walk: P_({ nk: [25, 42.5], na: [28, 51], fk: [17, 43], fa: [14.5, 51], ne: [20.5, 24], nh: [18.5, 30], fe: [23, 24], fh: [25.5, 30] }),
  walk_b: P_({ nk: [18, 43], na: [15.5, 51.5], fk: [24, 42.5], fa: [27, 51], ne: [23.5, 24], nh: [26, 30], fe: [20, 24], fh: [18, 30] }),
  // ---- Teco (vida real) ----
  hold_mug: P_({ ne: [25, 22], nh: [28.5, 22], item: 'mug', fe: [21.5, 24.5], fh: [24, 31] , faixa: 'near'}),
  grab_visor: P_({ ne: [23, 24], nh: [24.5, 31], fe: [27, 21.5], fh: [32.5, 22.5], fhand: 'open', faixa: 'near' }),
  visor_arm: P_({ ne: [22, 24], nh: [24, 31], fe: [21.5, 24.5], fh: [24.5, 29.5], fitem: 'visor_hip', faixa: 'near' }),
  door: P_({ head: [23, 7], ne: [26, 22.5], nh: [30.5, 25], faixa: 'near', fitem: 'visor_hip', fe: [21, 24.5], fh: [23.5, 30], face: 'worry', dream: 1 }),
  door_whisper: P_({ head: [23.5, 7.2], ne: [26, 22.5], nh: [30.5, 25], faixa: 'near', fitem: 'visor_hip', fe: [21, 24.5], fh: [23.5, 30], face: 'whisper' }),
  sit_visor: P_({ head: [22.5, 12.5], sh: [21.5, 20.5], hip: [18.5, 36.5], ne: [26, 28], nh: [31, 25], fe: [24, 29], fh: [29.5, 26], item: 'visor_up', faixa: 'near', nk: [29.5, 37.5], na: [29, 51], fk: [27, 38.5], fa: [26.5, 51], face: 'n' }),
  sit_dad: P_({ head: [22, 10.5], sh: [21, 18.5], hip: [17.5, 35], nk: [29, 36], na: [29, 50.5], fk: [27, 37], fa: [26.5, 50.5], ne: [25.5, 26], nh: [31, 29], fe: [24.5, 27], fh: [30, 29.5], hand: 'flat', face: 'stern' }),
  sit_dad_nod: P_({ head: [22, 11.4], sh: [21, 18.8], hip: [17.5, 35], nk: [29, 36], na: [29, 50.5], fk: [27, 37], fa: [26.5, 50.5], ne: [25.5, 26], nh: [31, 29], fe: [24.5, 27], fh: [30, 29.5], hand: 'flat', face: 'stern' }),
  // ---- avatar: galho (mao direita = braco proximo) ----
  idle_g: P_({ ne: [24, 23], nh: [27, 28], item: 'galho', gang: -25, hand: 'fist', face: 'n' }),
  idle_g_b: P_({ head: [22, 7.6], sh: [21.5, 15.6], ne: [24, 23.6], nh: [27, 28.6], item: 'galho', gang: -22, hand: 'fist' }),
  ready: P_({ head: [22.5, 7.3], ne: [26, 21], nh: [29, 16.5], item: 'galho', gang: -80, hand: 'fist', face: 'focus', nk: [24, 43], na: [26, 52], fk: [18, 43], fa: [16.5, 52] }),
  wind: P_({ head: [21.5, 7.4], sh: [20.8, 15.4], ne: [19, 17], nh: [16.5, 11.5], item: 'galho', gang: -150, hand: 'fist', face: 'focus', nk: [24.5, 43], na: [26.5, 52], fk: [18, 43], fa: [16, 52] }),
  strike: P_({ head: [23.5, 7.8], sh: [22.8, 15.8], hip: [20.4, 31], ne: [28, 22], nh: [33.5, 24.5], item: 'galho', gang: 18, hand: 'fist', face: 'effort', nk: [25.5, 43], na: [28.5, 52], fk: [18, 43], fa: [15.5, 52] }),
  strike_tip: P_({ head: [23.8, 8], sh: [23, 16], hip: [20.2, 31], ne: [27, 22.5], nh: [31, 22], item: 'galho', gang: 28, grip: 'base', hand: 'fist', face: 'effort', nk: [25.5, 43], na: [28.5, 52], fk: [18, 43], fa: [15.5, 52] }),
  wind_tip: P_({ head: [21.2, 7.4], sh: [20.5, 15.4], ne: [19, 18], nh: [15.5, 13.5], item: 'galho', gang: -155, grip: 'base', hand: 'fist', face: 'focus', nk: [24.5, 43], na: [26.5, 52], fk: [18, 43], fa: [16, 52] }),
  miss: P_({ head: [24.5, 8.6], sh: [23.6, 16.4], hip: [20.4, 31], ne: [28.5, 23], nh: [34.5, 26.5], item: 'galho', gang: 55, hand: 'fist', face: 'effort', nk: [26, 43], na: [29, 52], fk: [17.5, 43], fa: [15, 52] }),
  hurt: P_({ head: [20.5, 8.4], sh: [20.3, 16], hip: [21, 31], ne: [22.5, 25], nh: [25, 31], item: 'galho', gang: -10, hand: 'fist', face: 'wince', nk: [21.5, 43], na: [21, 52], fk: [18.5, 43], fa: [17.5, 52] }),
  pant: P_({ head: [23, 9.6], sh: [22, 17.2], hip: [20.5, 32], ne: [24, 25], nh: [26, 31], item: 'galho', gang: -55, hand: 'fist', face: 'pant', nk: [22.5, 43], na: [22.5, 52], fk: [18.5, 43], fa: [18, 52] }),
  pant_b: P_({ head: [23, 10.2], sh: [22, 17.8], hip: [20.5, 32], ne: [24, 25.6], nh: [26, 31.6], item: 'galho', gang: -55, hand: 'fist', face: 'pant', nk: [22.5, 43], na: [22.5, 52], fk: [18.5, 43], fa: [18, 52] }),
  whisper_g: P_({ head: [23.4, 9], sh: [22, 16.6], hip: [20.8, 31.5], ne: [24.5, 24], nh: [27, 29], item: 'galho', gang: -60, hand: 'fist', face: 'whisper', nk: [22.5, 43], na: [22.5, 52], fk: [18.5, 43], fa: [18, 52] }),
  crouch: P_({ head: [25, 15], sh: [23, 22.5], hip: [18, 37], nk: [28, 40], na: [27, 51.5], fk: [26, 41], fa: [25, 52], ne: [26.5, 30], nh: [31.5, 40], hand: 'open', face: 'n', item: 'galho', gang: -40 }),
  pickup: P_({ head: [27, 14], sh: [24, 22], hip: [18.5, 36], nk: [27.5, 41], na: [27, 51.5], fk: [25, 42], fa: [24, 52], ne: [28, 31], nh: [32, 41], hand: 'open', face: 'n', fitem: 'galho_far', fe: [21, 29], fh: [22, 37] }),
  menu_g: P_({ head: [22.5, 7.2], ne: [26, 22], nh: [33, 21], hand: 'point', fitem: 'galho_far', fe: [21, 25], fh: [24, 31], face: 'n' }),
  smile: P_({ ne: [24, 23], nh: [27, 28], item: 'galho', gang: -25, hand: 'fist', face: 'smile' }),
  swing_air: P_({ ne: [26, 21.5], nh: [30, 18], item: 'galho', gang: -30, hand: 'fist', face: 'focus', nk: [24, 43], na: [26, 52], fk: [18, 43], fa: [16.5, 52] }),
  whistle: P_({ face: 'whistle', ne: [24, 23], nh: [27, 28], item: 'galho', gang: -25, hand: 'fist' }),
  hold_gosma: P_({ head: [24, 12], sh: [22.5, 19], hip: [19, 34], nk: [24, 43.5], na: [24, 52], fk: [17.5, 43.5], fa: [16.5, 52], ne: [27, 27], nh: [29.5, 32], hand: 'open', item: 'gosma', face: 'n' }),
  sit: P_({ head: [22, 10.5], sh: [21, 18.5], hip: [17.5, 35], nk: [29, 36], na: [29, 50.5], fk: [27, 37], fa: [26.5, 50.5], ne: [25.5, 26], nh: [31, 29], fe: [24.5, 27], fh: [30, 29.5], face: 'stern' }),
  // ---- mae ----
  point_clock: P_({ ne: [26, 17.5], nh: [31, 11.5], hand: 'point', face: 'worry', fe: [21, 24.5], fh: [23, 30] }),
  point_clock_b: P_({ ne: [26.4, 17.2], nh: [31.4, 11.2], hand: 'point', face: 'worry', fe: [21, 24.5], fh: [23, 30] }),
  worry: P_({ head: [22.5, 7.2], ne: [24, 24], nh: [24.5, 29], fe: [22, 24.5], fh: [24, 29], hand: 'fist', face: 'worry' }),
  plate: P_({ head: [22.8, 7.4], ne: [26.5, 24], nh: [31, 25.5], item: 'prato', fe: [24, 24.5], fh: [29, 26], face: 'worry', nk: [24.5, 43], na: [26, 52], fk: [17.5, 43], fa: [16, 52] }),
  plate_b: P_({ head: [22.8, 7.4], ne: [26.5, 24], nh: [31, 25.5], item: 'prato', fe: [24, 24.5], fh: [29, 26], face: 'worry', nk: [18, 43], na: [15.5, 52], fk: [24, 42.5], fa: [27, 51] }),
  // ---- pai ----
  arms_crossed: P_({ ne: [25, 24], nh: [21.5, 22], fe: [22, 24], fh: [26, 22], hand: 'fist', face: 'stern', xarms: 1 }),
  shake: P_({ head: [21.2, 7.2], ne: [25, 24], nh: [21.5, 22], fe: [22, 24], fh: [26, 22], hand: 'fist', face: 'stern', xarms: 1 }),
  shake_b: P_({ head: [23, 7.2], ne: [25, 24], nh: [21.5, 22], fe: [22, 24], fh: [26, 22], hand: 'fist', face: 'stern', xarms: 1 }),
};

// ---------------- desenho do perfil ----------------
const faceDraw = (P, hx, hy, face, spec) => {
  const brow = (dy = 0, a = 0) => P.rect(hx + 1.4, hy - 1.6 + dy + a, 2.5, .6, (spec.hairC || PAL.hair)(.2, 0, 0));
  const eye = (cl) => { if (cl) { P.rect(hx + 1.9, hy - .1, 2, .5, INK); return; } P.rect(hx + 2.1, hy - .4, 1, 1.5, INK); P.set(hx + 2.5, hy - .4, hex('#f2e8dc')); };
  const mouth = (w = 1.4, dy = 3, col = '#5a2a22', h = .5) => P.rect(hx + 2.4, hy + dy, w, h, hex(col));
  if (face === 'smile') { eye(); brow(0); P.rect(hx + 2.2, hy + 3, 2, .5, hex('#5a2a22')); P.set(hx + 4.2, hy + 2.6, hex('#5a2a22')); }
  else if (face === 'pant') { eye(); brow(.7, 0); P.rect(hx + 2.5, hy + 2.9, 1.5, 1.1, hex('#3a1612')); }
  else if (face === 'effort') { P.rect(hx + 1.9, hy - .2, 2, .6, INK); brow(.5); P.rect(hx + 2.4, hy + 2.8, 1.8, .9, hex('#3a1612')); }
  else if (face === 'wince') { P.rect(hx + 1.9, hy - .1, 2, .5, INK); brow(.7); P.rect(hx + 2.2, hy + 3.2, 1.8, .5, hex('#3a1612')); }
  else if (face === 'whisper') { eye(); brow(0); P.rect(hx + 3, hy + 3, .8, .8, hex('#4a1c16')); }
  else if (face === 'worry') { eye(); P.rect(hx + 1.4, hy - 1.9, 2.5, .6, (spec.hairC || PAL.hair)(.2, 0, 0)); P.set(hx + 3.4, hy - 2.3, (spec.hairC || PAL.hair)(.2, 0, 0)); mouth(1.2, 3.2); }
  else if (face === 'stern') { eye(); brow(.4); mouth(1.6, 3.1, '#4a221a'); }
  else if (face === 'whistle') { eye(); brow(0); P.rect(hx + 3.4, hy + 2.9, .8, .8, hex('#3a1612')); }
  else if (face === 'focus') { eye(); brow(.4); mouth(1.2, 3.1); }
  else { eye(); brow(0); mouth(1.4, 3); }
  P.set(hx + 2.6, hy + 2.1, hex('#bc6a58'));  // bochecha
};
function hairDraw(P, hx, hy, spec) {
  const st = spec.hair, hc = spec.hairCol || (st === 'grey' ? PAL.grey : st === 'bun' ? PAL.curly : PAL.hair);
  spec.hairC = hc;
  const cap = [[hx - 4.2, hy + 2.2], [hx - 4.6, hy - 2], [hx - 2.4, hy - 5], [hx + 1.8, hy - 5.4], [hx + 3.4, hy - 3.6], [hx + 1.6, hy - 2.7], [hx - .6, hy - 1.6], [hx - 1.6, hy + 1.2]];
  P.poly(cap, (x, y) => hc(.4 - (y - hy) * .03 + (h2(x * 2 | 0, y * 2 | 0, 3) > .85 ? .2 : 0), x, y));
  if (st === 'spiky') for (const [dx, h] of [[-3.5, 2], [-2, 3], [-.5, 3.4], [1, 3], [2.4, 2.2], [-4, 1.4]]) P.poly([[hx + dx - .9, hy - 4.6], [hx + dx + .2, hy - 4.8 - h], [hx + dx + 1.1, hy - 4.4]], hc(.5, 0, 0));
  if (st === 'messy') { for (const [dx, h, sl] of [[-3.8, 1.6, -1], [-2.2, 2.2, -.6], [-.4, 2, .2], [1.2, 1.6, .8], [2.6, 1.2, 1]]) P.poly([[hx + dx - 1, hy - 4.6], [hx + dx + sl * 1.6, hy - 4.8 - h], [hx + dx + 1.2, hy - 4.2]], hc(.5, 0, 0)); P.rect(hx - 4.6, hy - 1, 1.2, 4, hc(.35, 0, 0)); }
  if (st === 'grey') { P.poly([[hx - 4.4, hy + 3], [hx - 4.8, hy - 2], [hx - 2.4, hy - 4.6], [hx + 1.8, hy - 4.8], [hx + 3, hy - 3.2], [hx + 1.4, hy - 2.4], [hx - 1.2, hy - 1.4]], hc(.55, 0, 0)); }
  if (st === 'bun') { P.ellipse(hx - 2.8, hy - 6.6, 2.8, 2.5, (x, y, dx, dy) => hc(.55 - dy * .25 + (h2(x * 3 | 0, y * 3 | 0, 2) > .8 ? .2 : 0), x, y)); P.ellipse(hx - .4, hy - 3.2, 5.4, 3.8, (x, y, dx, dy) => hc(.5 - dy * .3 + (h2(x * 3 | 0, y * 3 | 0, 7) > .78 ? .25 : 0), x, y)); P.ellipse(hx - 4, hy + .6, 2.4, 4, (x, y, dx, dy) => hc(.4 - dx * .1 + (h2(x * 3 | 0, y * 3 | 0, 4) > .8 ? .2 : 0), x, y)); }
}
function headSideDraw(P, hx, hy, spec, pose) {
  const sk = (x, y) => spec.skin(.68 - (x - hx) * .02 - (y - hy) * .015, x, y);
  P.rect(hx - 1.6, hy + 2.5, 3.6, 4.4, spec.skin(.4, 0, 0));   // pescoco
  P.poly([[hx - 3.2, hy - 3.6], [hx + 1.6, hy - 4.2], [hx + 3.2, hy - 2.6], [hx + 3.4, hy - .2], [hx + 4.5, hy + 1.4], [hx + 3.5, hy + 1.9], [hx + 3.7, hy + 2.8], [hx + 3.1, hy + 4.1], [hx + .8, hy + 4.9], [hx - 2.2, hy + 4.1], [hx - 3.6, hy + 1.2]], sk);
  if (spec.beard) P.poly([[hx - 1, hy + 1.2], [hx + 3.4, hy + 1.6], [hx + 3.9, hy + 3.4], [hx + 3.1, hy + 5.2], [hx + .6, hy + 5.8], [hx - 2.4, hy + 4.6]], (x, y) => PAL.grey(.62 - (y - hy) * .03 + (h2(x * 3 | 0, y * 3 | 0, 6) > .7 ? .15 : 0), x, y));
  hairDraw(P, hx, hy, spec);
  faceDraw(P, hx, hy, pose.face || 'n', spec);
  if (spec.beard) P.rect(hx + 2.4, hy + 3.2, 1.6, .5, hex('#2a1612'));
  if (spec.glasses) { P.rect(hx + 1.2, hy - 1.2, 3.4, 2.4, hex('#0a0a0e')); P.rect(hx + 1.8, hy - .7, 2.2, 1.4, hex('#7aa0b8')); P.rect(hx - 3, hy - .5, 4.2, .6, hex('#0a0a0e')); }
  if (spec.scar) { }
  // olheiras leves (vida real)
  if (spec.bare && pose.face !== 'wince') P.rect(hx + 1.9, hy + .9, 2.2, .45, spec.skin(.34, 0, 0));
}
function itemDraw(P, E, it, hx, hy, pose, spec, ang) {
  if (it === 'galho') {
    const a = (ang ?? pose.gang ?? -25) * Math.PI / 180, L = 22, bx = hx - Math.cos(a) * 3.2 * (pose.grip === 'base' ? 0 : 1), by = hy - Math.sin(a) * 3.2 * (pose.grip === 'base' ? 0 : 1);
    const tx = bx + Math.cos(a) * L, ty = by + Math.sin(a) * L;
    // galho torto: dois segmentos levemente curvos
    const mx = (bx + tx) / 2 - Math.sin(a) * 1.6, my = (by + ty) / 2 + Math.cos(a) * 1.6;
    limb(P, bx, by, mx, my, 2.3, 2, PAL.bark, .6); limb(P, mx, my, tx, ty, 2, 1.4, PAL.bark, .6);
    P.line(mx, my, mx + Math.cos(a - 1) * 3.2, my + Math.sin(a - 1) * 3.2, PAL.bark(.5, 0, 0));
    if (spec.crack) { P.line(tx - Math.cos(a) * 4, ty - Math.sin(a) * 4, tx + 1, ty + 1.4, hex('#1a0c06')); P.line(tx - Math.cos(a) * 2.5 + .6, ty - Math.sin(a) * 2.5 + .6, tx + .8, ty - .8, hex('#e9d2a4')); }
    if (pose.grip === 'base') { P.rect(bx - 1.2, by - 1.2, 2, 2, PAL.bark(.2, 0, 0)); }
  } else if (it === 'galho_far') { limb(P, hx - 1, hy - 2, hx + 4, hy + 15, 2, 1.6, PAL.bark, .45); }
  else if (it === 'mug') { P.rect(hx - 1.6, hy - 3, 3.6, 4.4, PAL.mug(.65, 0, 0)); P.rect(hx - 1.6, hy - 3, 3.6, .8, PAL.mug(.95, 0, 0)); P.rect(hx + 2, hy - 2, 1.2, 2.4, PAL.mug(.35, 0, 0)); }
  else if (it === 'visor_up') { limb(P, hx - 3, hy - 2, hx + 3.4, hy - 2, 4.6, 4.2, PAL.visor, .66); P.rect(hx - 3.6, hy - 3.8, 7.6, 1, PAL.band(.55, 0, 0)); P.rect(hx - 1.6, hy - 2.8, 4, 1.4, hex('#2a3038')); }
  else if (it === 'visor_hip') { limb(P, hx - 2.4, hy + .6, hx + 2.6, hy + .6, 4.2, 4, PAL.visor, .6); P.rect(hx - 2.8, hy - .6, 5.6, .8, PAL.band(.5, 0, 0)); }
  else if (it === 'prato') { P.ellipse(hx, hy - .6, 5, 1.5, PAL.plate(.75, 0, 0)); P.ellipse(hx - 1.2, hy - 1.8, 2.4, 1.2, (x, y) => PAL.rice(.8, x, y)); P.ellipse(hx + 1.6, hy - 1.7, 1.8, 1, PAL.egg(.8, 0, 0)); P.set(hx + 1.6, hy - 1.9, hex('#ffe9a0')); }
  else if (it === 'gosma') { P.ellipse(hx, hy - 2.4, 2.6, 2.6, (x, y, dx, dy) => PAL.slimeB(.75 - dy * .3, x, y)); P.rect(hx - 2.6, hy - 2.4, 5.2, .6, PAL.steel(.9, 0, 0)); }
}
function handDraw(P, x, y, kind, spec, v = .8) {
  if (kind === 'fist') { P.ellipse(x, y, 1.9, 1.8, spec.skin(v, 0, 0)); P.rect(x - .6, y - .2, 1.8, .45, spec.skin(.32, 0, 0)); }
  else if (kind === 'point') { P.ellipse(x, y, 1.7, 1.6, spec.skin(v, 0, 0)); P.rect(x + 1, y - .6, 3, 1, spec.skin(v - .05, 0, 0)); P.rect(x + 1, y + .4, 2.2, .35, spec.skin(.32, 0, 0)); }
  else if (kind === 'flat') { P.rect(x - 2.2, y - .8, 4.4, 1.7, spec.skin(v - .05, 0, 0)); P.rect(x - 2, y + .6, 4, .3, spec.skin(.32, 0, 0)); P.rect(x + 1.2, y - .8, .4, 1.6, spec.skin(.4, 0, 0)); }
  else { P.ellipse(x, y, 1.9, 1.7, spec.skin(v, 0, 0)); P.rect(x + .6, y + .6, 1.4, .4, spec.skin(.34, 0, 0)); P.rect(x + 1.8, y - .5, .7, 1.4, spec.skin(v - .1, 0, 0)); }
}
function shoeDraw(P, ax, ay, spec, v, near) {
  if (spec.shoe === PAL.chin) { P.poly([[ax - 2.2, ay - .4], [ax + 2.2, ay - .4], [ax + 5.6, ay + 2.2], [ax + 5.6, ay + 4.8], [ax - 2.6, ay + 4.8]], PAL.chin(.35, 0, 0)); if (near) P.rect(ax - 1.4, ay - .6, 4, .9, hex('#2a2a2c')); }
  else P.poly([[ax - 2.2, ay - 1], [ax + 2.4, ay - 1], [ax + 3, ay + 1.6], [ax + 8, ay + 2.4], [ax + 8, ay + 5], [ax - 3, ay + 5]], (x, y) => spec.shoe(v - (y - ay) * .06, x, y));
}
function legDraw(P, hip, k, a, spec, near) {
  const v = near ? .66 : .36;
  if (spec.bare) { limb(P, hip[0], hip[1], k[0], k[1], 5.4 * spec.bulk * .9, 4.4, spec.skin, v * .9); limb(P, k[0], k[1], a[0], a[1], 4.2, 3, spec.skin, v * .85); limb(P, hip[0], hip[1], k[0] + .2, k[1] - 5, 6 * spec.bulk * .92, 5.2, spec.pants, v); }
  else { limb(P, hip[0], hip[1], k[0], k[1], 5.8 * spec.bulk * .92, 4.6, spec.pants, v); limb(P, k[0], k[1], a[0], a[1], 4.6, 3.3, spec.pants, v - .02); }
  shoeDraw(P, a[0], a[1], spec, v, near);
}
function armDraw(P, sh, e, w, spec, near, pose, itemKey) {
  const v = near ? .66 : .38, sleeve = spec.top;
  const bw = spec.bulk > 1.1 ? 1.15 : 1;
  limb(P, sh[0], sh[1], e[0], e[1], 4.2 * bw, 3.6 * bw, sleeve, near ? .66 : .4);
  const sleeveShort = spec.bare || spec.hair === 'spiky' || spec.top === PAL.polo || spec.top === PAL.mustard;
  const ex = e[0] + (w[0] - e[0]) * .08, ey = e[1] + (w[1] - e[1]) * .08;
  limb(P, ex, ey, w[0], w[1], 3.3 * bw, 2.5 * bw, spec.skin, v - .04);
  if (spec.top === PAL.mustard && !near) { }
  if (spec.vest && spec.top === PAL.shirt) { /* manga de camisa */ }
  const faixa = (pose.faixa === (near ? 'near' : 'far'));
  if (faixa) { const dx = w[0] - e[0], dy = w[1] - e[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L; const fx = w[0] - ux * 2.4, fy = w[1] - uy * 2.4; limb(P, fx - ux * .8, fy - uy * .8, fx + ux * .8, fy + uy * .8, 3.5, 3.5, PAL.ruby, .6); P.line(fx + uy * 1.6, fy - ux * 1.6, fx + uy * 3.4 + ux * 2, fy - ux * 3 + uy * 2, PAL.ruby(.7, 0, 0)); }
  handDraw(P, w[0], w[1], near ? pose.hand : (pose.fhand || pose.hand), spec, near ? .8 : .5);
}
export function drawSide(P, E, spec, pose) {
  const [hx, hy] = pose.head, S = pose.sh, H = pose.hip, bw = 4.4 * spec.bulk, fw = 4.2 * spec.bulk;
  // braco longe (atras)
  const farItemKey = pose.fitem;
  if (!pose.xarms) armDraw(P, [S[0] + 1, S[1] + .6], pose.fe, pose.fh, spec, false, pose);
  // item no braco longe
  if (farItemKey) itemDraw(P, E, farItemKey, pose.fh[0], pose.fh[1], pose, spec);
  legDraw(P, [H[0] - .5, H[1]], pose.fk, pose.fa, spec, false);
  // cachecol: ponta longa atras
  if (spec.scarf) for (let t = 0; t < 1; t += .02) { const x = S[0] - 3 - Math.sin(t * 2.3 + (pose.gang ? 0 : 0)) * 6.2 - (pose === POSES.walk || pose === POSES.walk_b ? t * 3 : 0), y = S[1] - 1.2 + t * 17; P.rect(x, y, 2.8, 1.2, PAL.ruby(.62 + (t % .25 < .05 ? .14 : 0) - ((t * 40 | 0) % 7 === 0 ? .1 : 0), 0, 0)); }
  // mochila de pano (costas)
  if (spec.pack) { P.poly([[S[0] - bw - 5.4, S[1] + 1.6], [S[0] - bw + .2, S[1] + 1], [H[0] - bw + .6, H[1] - 1], [H[0] - bw - 4.6, H[1] - 1.6]], (x, y) => PAL.canvas(.55 - (x - (S[0] - bw - 5)) / 6 * .25 + (y < S[1] + 3 ? .1 : 0) - (y > H[1] - 3 ? .15 : 0), x, y)); P.line(S[0] - bw - 4, S[1] + 6, S[0] - bw, S[1] + 6, PAL.leather(.5, 0, 0)); }
  // torso
  const tx0 = S[0] - bw, tx1 = S[0] + fw;
  P.poly([[tx0, S[1] - .5], [tx1 - 1, S[1] - .3], [tx1 + .6, (S[1] + H[1]) / 2], [H[0] + fw - .6, H[1]], [H[0] - bw + .6, H[1] + .4], [tx0 - .4, (S[1] + H[1]) / 2]],
    (x, y) => spec.top(.74 - (x - tx0) / (tx1 - tx0) * .3 - (y - S[1]) / 18 * .08 + ((((x * 1.3 + (y >> 1)) | 0) % 7 === 0 && y > S[1] + 4) ? -.1 : 0), x, y));
  if (spec.vest) { P.poly([[tx0 + .5, S[1] + 1], [tx1 - 1.2, S[1] + 1.2], [tx1, H[1] - 1], [H[0] - bw + .6, H[1] + .2]], (x, y) => PAL.vest(.76 - (x - tx0) / (tx1 - tx0) * .3 + (((x * 1.3 + (y >> 1)) | 0) % 7 === 0 && y > S[1] + 4 ? -.14 : 0), x, y)); for (const [a, b, c, d] of [[tx0 + 2, S[1] + 8, tx0 + 6, S[1] + 13], [tx0 + 4, S[1] + 6, tx0 + 8, S[1] + 10]]) P.line(a, b, c, d, PAL.vest(.2, 0, 0)); P.rect(H[0] - bw + .6, H[1] - 1.6, bw + fw - 1, 1.6, PAL.leather(.7, 0, 0)); P.rect(H[0] + 1.4, H[1] - 1.6, 1.6, 1.6, PAL.brass(.9, 0, 0)); }
  if (spec.apron) P.poly([[S[0] - 1.5, S[1] + 4], [tx1 + .4, S[1] + 4.4], [H[0] + fw + 1, H[1] + 10], [H[0] - bw + 1, H[1] + 10]], (x, y) => PAL.apron(.78 - (x - tx0) / (tx1 - tx0) * .25 - (y - S[1]) / 26 * .1 + (((x + (y >> 1)) | 0) % 9 === 0 ? -.08 : 0), x, y));
  if (spec.beltless) { }
  if (spec.bulk > 1.1) { /* barriga */ P.ellipse(H[0] + fw - 2.2, H[1] - 4.6, 3.2, 4.8, (x, y, dx, dy) => spec.top(.76 - dx * .1 - dy * .12, x, y)); }
  legDraw(P, H, pose.nk, pose.na, spec, true);
  headSideDraw(P, hx, hy, spec, pose);
  // Visor no rosto
  if (pose.visorOn) { P.rect(hx - 4, hy - 1.8, 9.4, 3.6, PAL.visor(.8, 0, 0)); P.rect(hx - 4, hy - 1.8, 9.4, .6, PAL.visor(.35, 0, 0)); P.rect(hx - 4, hy + 1.2, 9.4, .6, PAL.visor(.4, 0, 0)); P.rect(hx - 4.4, hy - 1.2, 1.4, 6, PAL.band(.5, 0, 0)); }
  // cachecol (gola) + ponta
  if (spec.scarf) { P.ellipse(hx - .6, hy + 5.8, 4.8, 2.3, (x, y, dx, dy) => PAL.ruby(.64 - dy * .3 + ((x * 2 + y) % 5 < 1 ? -.1 : 0), x, y)); P.rect(hx + 2, hy + 5.6, 2.6, 2.6, PAL.ruby(.5, 0, 0)); }
  // bracos de perto: cruzados (pai) ou normal
  if (pose.xarms) { limb(P, S[0] + 1, S[1] + 1, pose.ne[0] + 1, pose.ne[1], 4.4, 4, spec.top, .66); limb(P, pose.ne[0] + 1, pose.ne[1], pose.nh[0], pose.nh[1] + .4, 3.8, 3.4, spec.top, .6); handDraw(P, pose.nh[0] - .5, pose.nh[1], 'fist', spec, .75); }
  else armDraw(P, [S[0], S[1] + .6], pose.ne, pose.nh, spec, true, pose);
  if (pose.item) itemDraw(P, E, pose.item, pose.nh[0], pose.nh[1], pose, spec);
}
const W_ = 46, H_ = 60;
const cache = {};
function mkSide(specName, poseName, extra = {}) {
  const spec = { ...SPEC[specName], ...extra }, pose = POSES[poseName];
  return mkk(W_, H_, (P, E) => { const off = pose.dream ? 0 : 0; drawSide(P, E, spec, pose); });
}

// ---------------- frente / costas ----------------
export const FPOSES = {
  stand: { a: [0, 0, 0, 0] }, menu: { raise: 1 }, point: { point: 1 }, look: { look: 1 }, tired: { tired: 1 },
};
function drawFront(P, E, spec, pose, back = false) {
  const cx = 20, hy = 8, v = (n) => n;
  const bw = 6.4 * spec.bulk;
  // pernas
  for (const s of [-1, 1]) { limb(P, cx + s * 2.6, 31, cx + s * 3, 43, 5, 4.2, spec.pants, .62 - (s > 0 ? .1 : 0)); limb(P, cx + s * 3, 43, cx + s * 3.2, 52, 4.2, 3.4, spec.pants, .6 - (s > 0 ? .1 : 0)); P.poly([[cx + s * 3.2 - 2.4, 51], [cx + s * 3.2 + 2.4, 51], [cx + s * 3.2 + 3.4, 55.6], [cx + s * 3.2 - 3.4, 55.6]], (x, y) => spec.shoe(.6 - (y - 51) * .06, x, y)); }
  // cachecol longo (cai no lado esquerdo do personagem = direita da imagem?) pontas caindo
  if (spec.scarf && !back) { /* ponta longa atras: aparece ao lado */ }
  // bracos (atras do tronco se descem)
  const arm = (s, up, pt) => {
    const sx = cx + s * (bw + .6), sy = 16;
    if (up) { limb(P, sx, sy, sx + s * 4, 24, 4.2, 3.6, spec.top, .6); limb(P, sx + s * 4, 24, sx + s * 3, 17.5, 3.4, 2.8, spec.skin, .62); P.ellipse(sx + s * 2.6, 15.6, 1.9, 1.9, spec.skin(.8, 0, 0)); }
    else if (pt) { limb(P, sx, sy, sx + s * 2, 23, 4.2, 3.6, spec.top, .6); limb(P, sx + s * 2, 23, sx + s * 1, 29, 3.3, 2.7, spec.skin, .6); P.ellipse(sx + s * 1, 29.6, 1.9, 1.9, spec.skin(.8, 0, 0)); }
    else { limb(P, sx, sy, sx + s * 1.4, 24, 4.2, 3.6, spec.top, .6 - (s > 0 ? .08 : 0)); limb(P, sx + s * 1.4, 24, sx + s * 1.6, 31, 3.3, 2.7, spec.skin, .6 - (s > 0 ? .08 : 0)); P.ellipse(sx + s * 1.6, 31.6, 1.9, 1.9, spec.skin(.78, 0, 0)); }
  };
  // torso
  P.poly([[cx - bw, 14.5], [cx + bw, 14.5], [cx + bw - .6, 32], [cx - bw + .6, 32]], (x, y) => spec.top(.7 - Math.abs(x - cx) / bw * .22 - (y - 14) / 18 * .08 + ((((x + y) | 0) % 8 === 0 && y > 20) ? -.1 : 0), x, y));
  if (spec.vest) { P.poly([[cx - bw + .4, 15], [cx - .8, 15.4], [cx - 1.2, 32], [cx - bw + .8, 32]], (x, y) => PAL.vest(.76 - Math.abs(x - cx) / bw * .2 + (((x * 1.3 + (y >> 1)) | 0) % 7 === 0 ? -.12 : 0), x, y)); P.poly([[cx + .8, 15.4], [cx + bw - .4, 15], [cx + bw - .8, 32], [cx + 1.2, 32]], (x, y) => PAL.vest(.68 - Math.abs(x - cx) / bw * .2 + (((x * 1.3 + (y >> 1)) | 0) % 7 === 0 ? -.12 : 0), x, y)); P.rect(cx - 1, 15, 2, 17, spec.top(.5, 0, 0)); P.rect(cx - bw + .6, 30.6, bw * 2 - 1.2, 1.6, PAL.leather(.7, 0, 0)); P.rect(cx - .8, 30.6, 1.6, 1.6, PAL.brass(.9, 0, 0)); }
  if (spec.pack && !back) { P.rect(cx - bw + 1.4, 15.4, 1.2, 9, PAL.leather(.5, 0, 0)); P.rect(cx + bw - 2.6, 15.4, 1.2, 9, PAL.leather(.5, 0, 0)); }
  if (spec.pack && back) { P.rect(cx - bw + 1, 17, bw * 2 - 2, 13, (x, y) => PAL.canvas(.55 + (y < 20 ? .1 : 0) - (y > 28 ? .15 : 0), x, y)); }
  arm(-1, false, false);
  arm(1, !!pose.raise, !!pose.point);
  if (pose.point) { // galho apontando p/ a camera: braco direito (da imagem = esquerda) estendido, galho em perspectiva
    const px = cx - bw - 1.2; limb(P, px + 1, 16, px - 1, 22, 4, 3.4, spec.top, .66); limb(P, px - 1, 22, px - 2, 26, 3.4, 3, spec.skin, .66); P.ellipse(px - 2.2, 26, 2.3, 2.3, spec.skin(.82, 0, 0)); limb(P, px - 2.2, 26.6, px - 4.4, 17, 2.6, 2.4, PAL.bark, .6); P.ellipse(px - 4.6, 16.8, 1.8, 1.8, PAL.bark(.85, 0, 0)); if (spec.crack) { P.line(px - 5.4, 16.2, px - 3.6, 18.6, hex('#1a0c06')); P.set(px - 4.2, 17, hex('#e9d2a4')); }
  }
  // pescoco/cabeca
  const hx = cx + (pose.look ? 1.6 : 0) + (pose.tilt || 0);
  P.rect(cx - 2, 11.4, 4, 4, spec.skin(.42, 0, 0));
  P.poly([[hx - 4.4, hy - 3], [hx - 3, hy - 5], [hx + 3, hy - 5], [hx + 4.4, hy - 3], [hx + 4.6, hy + 1], [hx + 3.4, hy + 4], [hx + 1, hy + 5.5], [hx - 1, hy + 5.5], [hx - 3.4, hy + 4], [hx - 4.6, hy + 1]], (x, y) => spec.skin(.7 - Math.abs(x - hx) * .02 - (y - hy) * .012, x, y));
  if (!back) {
    // cabelo espetado
    const hc = PAL.hair;
    P.poly([[hx - 4.8, hy + .5], [hx - 4.8, hy - 3.6], [hx - 3, hy - 5.6], [hx + 3, hy - 5.6], [hx + 4.8, hy - 3.6], [hx + 4.8, hy + .5], [hx + 3.4, hy - 1.8], [hx + .6, hy - 2.6], [hx - 2.4, hy - 1.8]], (x, y) => hc(.42 - (y - hy) * .03 + (h2(x * 2 | 0, y * 2 | 0, 3) > .85 ? .2 : 0), x, y));
    for (const [dx, h] of [[-4, 2], [-2.4, 3.2], [-.6, 3.6], [1.2, 3.2], [3, 2.4]]) P.poly([[hx + dx - 1, hy - 5], [hx + dx + .2, hy - 5.2 - h], [hx + dx + 1.2, hy - 4.8]], hc(.5, 0, 0));
    const ex = pose.look ? 1.4 : 0;
    for (const s of [-1, 1]) { P.rect(hx + s * 2.2 - .5 + ex, hy - .2, 1.2, 1.7, INK); P.set(hx + s * 2.2 + ex + (s > 0 ? 0 : 0), hy - .2, hex('#f2e8dc')); P.rect(hx + s * 2.2 - 1 + ex, hy - 1.7, 2.2, .5, hc(.2, 0, 0)); }
    P.rect(hx - .6 + ex, hy + 1.6, 1.2, 1.6, spec.skin(.5, 0, 0));
    P.rect(hx - 1.2 + ex, hy + 3.6, 2.4, .5, hex(pose.tired ? '#3a1612' : '#5a2a22'));
    P.set(hx - 3.2, hy + 2, hex('#bc6a58')); P.set(hx + 3.2, hy + 2, hex('#bc6a58'));
    if (spec.scarf) { P.ellipse(cx, 13.6, 7, 2.6, (x, y, dx, dy) => PAL.ruby(.64 - dy * .3 + ((x * 2 + y) % 5 < 1 ? -.1 : 0), x, y)); for (const s of [-1, 1]) { const len = s < 0 ? 18 : 9; limb(P, cx + s * 3.4, 14.8, cx + s * 3.6 - s * 0.5, 14.8 + len, 3.4, 3, PAL.ruby, .62 - (s > 0 ? .08 : 0)); } }
  } else {
    const hc = spec.hair === 'messy' ? PAL.hair : PAL.hair;
    P.poly([[hx - 5, hy + 2], [hx - 5, hy - 3.6], [hx - 3, hy - 5.8], [hx + 3, hy - 5.8], [hx + 5, hy - 3.6], [hx + 5, hy + 2], [hx + 3, hy + 3.4], [hx - 3, hy + 3.4]], (x, y) => hc(.4 - (y - hy) * .03 + (h2(x * 2 | 0, y * 2 | 0, 3) > .85 ? .2 : 0), x, y));
    for (const [dx, h, sl] of [[-4, 1.6, -1], [-2.2, 2.4, -.5], [-.2, 2.2, .2], [1.8, 1.8, .8], [3.6, 1.4, 1]]) P.poly([[hx + dx - 1, hy - 5.2], [hx + dx + sl * 1.6, hy - 5.4 - h], [hx + dx + 1.2, hy - 4.8]], hc(.5, 0, 0));
  }
}
function mkFront(specName, poseName, back, extra = {}) {
  const spec = { ...SPEC[specName], ...extra }, pose = FPOSES[poseName] || {};
  return mkk(40, 58, (P, E) => drawFront(P, E, spec, pose, back));
}
// costas (real): camiseta, bermuda, chinelo, Visor sob o braco direito, faixa no pulso esquerdo
function mkBackReal(poseName) {
  const spec = { ...SPEC.teco_real };
  return mkk(40, 58, (P, E) => {
    const cx = 20, bw = 6.2;
    for (const s of [-1, 1]) { limb(P, cx + s * 2.6, 31, cx + s * 3, 42, 5.8, 5, PAL.shorts, .6); limb(P, cx + s * 3, 40, cx + s * 3.2, 51, 4.2, 3.2, PAL.skin, .6 - (s > 0 ? .1 : 0)); P.poly([[cx + s * 3.2 - 2.4, 50.6], [cx + s * 3.2 + 2.4, 50.6], [cx + s * 3.2 + 3, 55.6], [cx + s * 3.2 - 3, 55.6]], PAL.chin(.4, 0, 0)); }
    P.poly([[cx - bw, 14.5], [cx + bw, 14.5], [cx + bw - .6, 33], [cx - bw + .6, 33]], (x, y) => PAL.tee(.66 - Math.abs(x - cx) / bw * .2 + (((x + y) | 0) % 9 === 0 ? -.08 : 0) - (y > 30 ? .08 : 0), x, y));
    // bracos: esquerdo (esq. da imagem) com faixa; direito (dir.) segura Visor sob o braco
    limb(P, cx - bw - .4, 16, cx - bw - 1.2, 24, 4.4, 3.8, PAL.tee, .6); limb(P, cx - bw - 1.2, 24, cx - bw - 1, 31, 3.4, 2.8, PAL.skin, .6); limb(P, cx - bw - 1, 28.6, cx - bw - 1, 30.8, 3.6, 3.6, PAL.ruby, .6); P.ellipse(cx - bw - 1, 32, 1.9, 1.9, PAL.skin(.78, 0, 0));
    limb(P, cx + bw + .4, 16, cx + bw + 1.4, 24, 4.4, 3.8, PAL.tee, .6); limb(P, cx + bw + 1.4, 24, cx + bw - .6, 30, 3.4, 2.8, PAL.skin, .6);
    limb(P, cx + bw - 3.2, 26.4, cx + bw + 2.4, 26.6, 3.2, 3, PAL.visor, .66); P.rect(cx + bw - 3.4, 25.2, 6, .7, PAL.band(.5, 0, 0)); P.ellipse(cx + bw - .6, 30.8, 1.8, 1.8, PAL.skin(.76, 0, 0));
    P.rect(cx - 2, 11.4, 4, 4, PAL.skin(.4, 0, 0));
    P.poly([[cx - 5, hy0(0) + 2], [cx - 5, 3], [cx - 3, 1.6], [cx + 3, 1.6], [cx + 5, 3], [cx + 5, 10], [cx + 3, 12.4], [cx - 3, 12.4]], (x, y) => PAL.hair(.4 - (y - 8) * .03 + (h2(x * 2 | 0, y * 2 | 0, 3) > .85 ? .2 : 0), x, y));
    for (const [dx, h, sl] of [[-4, 1.8, -1.4], [-2.2, 2.6, -.8], [-.2, 2.2, .3], [1.8, 2.2, 1.2], [3.6, 1.6, 1.6]]) P.poly([[cx + dx - 1, 2.8], [cx + dx + sl * 1.6, 2.4 - h], [cx + dx + 1.2, 3.2]], PAL.hair(.5, 0, 0));
    P.rect(cx - 5.4, 6, 1.2, 2.6, PAL.skin(.5, 0, 0)); P.rect(cx + 4.2, 6, 1.2, 2.6, PAL.skin(.5, 0, 0));
  });
}
const hy0 = () => 8;

// ---------------- deitado (cama) ----------------
function mkLying(visor) {
  return mkk(72, 22, (P) => {
    const sp = SPEC.teco_real;
    // pernas e bermuda
    limb(P, 40, 14, 62, 14, 7, 5.5, PAL.shorts, .5); limb(P, 58, 14.5, 68, 15, 4.6, 3.4, PAL.skin, .55); P.poly([[66, 13], [71.4, 15.4], [71.4, 18], [66, 18]], PAL.chin(.4, 0, 0));
    limb(P, 40, 11.6, 60, 11.2, 6.6, 5, PAL.shorts, .66); limb(P, 58, 11.4, 67, 11.8, 4.4, 3.2, PAL.skin, .66); P.poly([[65, 9.6], [70.4, 12.2], [70.4, 15], [65, 15]], PAL.chin(.5, 0, 0));
    // tronco
    limb(P, 14, 12, 42, 12.2, 9.6, 9.2, PAL.tee, .7);
    // braco sobre o peito, faixa
    limb(P, 22, 8.4, 32, 8.6, 3.8, 3.4, PAL.tee, .8); limb(P, 30, 8.6, 38, 9.2, 3.2, 2.6, PAL.skin, .72); limb(P, 33.4, 8.8, 35.2, 9, 3.4, 3.4, PAL.ruby, .62); P.ellipse(39, 9.4, 1.8, 1.7, PAL.skin(.8, 0, 0));
    // pescoco e cabeca (de lado, no travesseiro)
    P.ellipse(8, 11, 6.2, 5.4, (x, y, dx, dy) => PAL.skin(.7 - dy * .15, x, y));
    P.poly([[2, 11], [2.6, 6], [6, 4.6], [11, 5], [13, 8], [8, 7.6]], (x, y) => PAL.hair(.4 + (h2(x * 2 | 0, y * 2 | 0, 3) > .8 ? .2 : 0), x, y)); P.poly([[1.4, 7], [-0.4, 5], [3, 4.6]], PAL.hair(.5, 0, 0));
    P.rect(6.8, 10.6, 2, .5, INK);
    if (visor) { P.rect(3.6, 9, 8.6, 3.8, PAL.visor(.82, 0, 0)); P.rect(3.6, 9, 8.6, .6, PAL.visor(.4, 0, 0)); P.rect(3.6, 12.2, 8.6, .6, PAL.visor(.4, 0, 0)); P.rect(10.8, 8.4, 4.4, 4.4, PAL.band(.55, 0, 0)); }
  }, .3);
}

// ---------------- slime Gosmim ----------------
function mkSlime(state, f = 0) {
  const w = 34, h = 26;
  return mkk(w, h, (P, E) => {
    const base = 24;
    let rx = 11, ry = 8, cy = base - 8, sx = 0;
    if (state === 'idle') { if (f) { rx = 11.8; ry = 7.2; cy = base - 7.2; } }
    else if (state === 'jump') { rx = 9.4; ry = 11; cy = base - 14; }
    else if (state === 'hit') { rx = 13; ry = 5.4; cy = base - 5.4; }
    else if (state === 'heal') { rx = 11.4; ry = 8.4; cy = base - 8.4; }
    else if (state === 'dying') { rx = [13.6, 15][f] || 14; ry = [4, 2.6][f] || 3; cy = base - ry; }
    const white = state === 'hit', glow = state === 'heal';
    const col = (x, y, dx, dy) => { let v = .62 - dy * .34 - dx * .1 + ((x + y) % 7 === 0 ? -.05 : 0) + (glow ? .14 : 0); if (white) v = .98 - Math.abs(dy) * .06; return PAL.slimeB(Math.min(.99, v), x, y); };
    if (state === 'dying' && f === 1) {
      P.ellipse(17, base - 1.4, 15, 1.7, col);
      for (const [x, y, r] of [[5, 16, 2.2], [9, 11, 1.7], [15, 8, 2.4], [21, 10, 1.8], [27, 14, 2.2], [30, 19, 1.5], [3, 21, 1.4], [12, 17, 1.3], [24, 17, 1.5]]) P.ellipse(x, y, r, r, (xx, yy, dx, dy) => PAL.slimeB(.8 - dy * .3, xx, yy));
      return;
    }
    P.ellipse(17, cy, rx, ry, col);
    P.ellipse(17 - rx * .35, cy - ry * .5, rx * .26, ry * .22, hex('#f4fbff'));  // brilho
    P.set(17 + rx * .5, cy - ry * .3, hex('#f4fbff'));
    // olhos e boca
    const ey = cy - ry * .05;
    if (state === 'hit') { P.rect(17 - 4.6, ey - .4, 2.4, .7, hex('#10203a')); P.rect(17 + 2.4, ey - .4, 2.4, .7, hex('#10203a')); }
    else if (state === 'dying') { P.rect(17 - 4.6, ey - .4, 2.4, .6, hex('#10203a')); P.rect(17 + 2.4, ey - .4, 2.4, .6, hex('#10203a')); }
    else { P.rect(17 - 4.4, ey - 1.2, 1.9, 2.4, hex('#10203a')); P.rect(17 + 2.6, ey - 1.2, 1.9, 2.4, hex('#10203a')); P.set(17 - 4, ey - 1.2, hex('#ffffff')); P.set(17 + 3, ey - 1.2, hex('#ffffff')); P.rect(17 - 1, ey + 2, 2, .6, hex('#10203a')); }
    if (state === 'heal') for (const [x, y] of [[6, 7], [27, 6], [29, 13], [4, 14]]) { P.rect(x, y - 1.4, .8, 2.8, hex('#e8fbff')); P.rect(x - 1.4, y - .4, 2.8, .8, hex('#e8fbff')); }
  }, .3);
}
function mkPuddle() { return mkk(40, 8, (P) => { P.ellipse(20, 4.6, 18, 2.6, (x, y, dx, dy) => PAL.slimeB(.72 - dy * .3 + (h2(x, y, 3) > .85 ? .15 : 0), x, y)); P.ellipse(13, 3.8, 3, .8, hex('#e4f6ff')); }, .25); }
function mkGosma(gold = false) {
  const pal = gold ? R(['#7a4a00', '#d49a00', '#ffd24a', '#fff4b0'], .3) : PAL.slimeB;
  return mkk(14, 14, (P, E) => { P.ellipse(7, 8, 5.4, 5, (x, y, dx, dy) => pal(.7 - dy * .36 - dx * .1, x, y)); P.poly([[7, 1.6], [9, 4.6], [5, 4.6]], pal(.68, 0, 0)); P.ellipse(5.4, 6.4, 1.2, 1, hex('#f4fbff')); for (let a = 0; a < 6.28; a += .35) P.set(7 + Math.cos(a) * 6.2, 8 + Math.sin(a) * 5.8, PAL.steel(.85 - (Math.sin(a) > .4 ? .3 : 0), 0, 0)); if (gold) { E.ellipse(7, 8, 4.4, 4, hex('#ffd24a')); } }, .3);
}
function mkPo() { return mkk(12, 10, (P, E) => { P.ellipse(6, 7, 4.8, 2.6, (x, y, dx, dy) => R(['#8a60c8', '#c49aff', '#f0d8ff'])(.7 - dy * .3, x, y)); for (const [x, y] of [[3, 4], [6, 2], [9, 4], [5, 5]]) { P.set(x, y, hex('#ffffff')); E.set(x, y, hex('#ffffff')); } }, .3); }
function mkMug() { return mkk(10, 10, (P) => { P.rect(1.4, 1.4, 6, 7.6, (x, y) => PAL.mug(.65 - (x - 1.4) / 6 * .3, x, y)); P.rect(1.4, 1.4, 6, 1, hex('#3a1c10')); P.rect(7.4, 3, 1.6, 4, PAL.mug(.35, 0, 0)); }, .3); }
function mkVisorItem() { return mkk(18, 12, (P) => { P.poly([[1, 3], [17, 3], [17, 9], [1, 9]], (x, y) => PAL.visor(.8 - (y - 3) * .06 - (x - 1) / 16 * .18, x, y)); P.rect(3, 4.4, 12, 2.6, hex('#28303a')); P.rect(0, 2, 18, 1.2, PAL.band(.6, 0, 0)); P.rect(0, 9, 18, 1.2, PAL.band(.4, 0, 0)); }, .3); }
function mkPlate() { return mkk(18, 9, (P) => { P.ellipse(9, 6, 8.4, 2.6, PAL.plate(.7, 0, 0)); P.ellipse(9, 5.2, 7, 2, PAL.plate(.9, 0, 0)); P.ellipse(6.6, 4.6, 3.6, 1.7, (x, y) => PAL.rice(.8 - (y - 4) * .05, x, y)); P.ellipse(12, 4.6, 2.6, 1.4, PAL.egg(.85, 0, 0)); P.set(12, 4.2, hex('#fff0b0')); }, .3); }
function mkCoin() { return mkk(6, 6, (P, E) => { P.ellipse(3, 3, 2.4, 2.6, (x, y, dx, dy) => PAL.brass(.9 - dy * .3 + dx * .1, x, y)); E.set(3, 3, hex('#ffd060')); P.set(2, 2, hex('#fff2b0')); }, .3); }
function mkTree(seed = 1, kind = 0) {
  return mkk(44, 70, (P) => {
    const gr = kind ? R(['#16341f', '#245a32', '#3a8a48', '#68bb68']) : R(['#143a34', '#1f5f52', '#32907a', '#62c4a2']);
    limb(P, 22, 70, 22, 38, 7, 5, PAL.wood, .5); P.rect(19, 62, 6, 8, PAL.wood(.3, 0, 0));
    for (const [cx, cy, r] of [[22, 26, 14], [12, 34, 9], [32, 34, 9], [22, 12, 9], [15, 20, 8], [29, 20, 8]]) P.ellipse(cx, cy, r, r * .92, (x, y, dx, dy) => gr(.6 - dy * .4 - dx * .08 + (h2(x * 2 | 0, y * 2 | 0, seed) > .8 ? .14 : -.04 * (h2(x, y, 2) > .8)), x, y));
  }, .3);
}
function mkBush() { return mkk(30, 16, (P) => { const gr = R(['#14402c', '#22703c', '#3ea055', '#7ad088']); for (const [cx, cy, r] of [[9, 10, 6.4], [17, 8, 7.4], [24, 11, 5.8]]) P.ellipse(cx, cy, r, r * .8, (x, y, dx, dy) => gr(.6 - dy * .4 + (h2(x * 2 | 0, y * 2 | 0, 5) > .82 ? .16 : 0), x, y)); for (const [x, y] of [[8, 7], [19, 5], [24, 9]]) P.rect(x, y, 1.4, 1.4, hex('#ffe6f0')); }, .3); }
function mkTuft(v = 0) { return mkk(14, 12, (P) => { const gr = R(['#1a5a34', '#2a8a4a', '#58c070', '#a0e8a0']); for (let i = 0; i < 6; i++) { const x = 2 + i * 1.8, h = 5 + h2(i, v, 4) * 6; P.poly([[x - 1, 12], [x + (i - 2.5) * .6, 12 - h], [x + 1, 12]], gr(.5 + h2(i, v, 5) * .45, 0, 0)); } }, .25); }
function mkMarker() { return mkk(8, 16, (P) => { P.rect(3, 4, 2, 12, PAL.wood(.6, 0, 0)); P.rect(0, 1, 8, 5, PAL.wood(.8, 0, 0)); P.rect(1, 2, 6, 1, PAL.wood(.3, 0, 0)); }, .3); }

const SPRITE_BUILD = {
  side: (id, pose, o) => mkSide(id, pose, o), front: (id, pose, o) => mkFront(id, pose, false, o), back: (id, pose) => id === 'teco_real' ? mkBackReal(pose) : mkFront(id, pose, true),
};
export function sprite(kind, id, pose = 'stand', o = {}) {
  const key = [kind, id, pose, o.crack ? 'c' : '', o.visorOn ? 'v' : ''].join(':');
  if (cache[key]) return cache[key];
  let s;
  if (kind === 'slime') s = mkSlime(id, +pose || 0);
  else if (kind === 'lying') s = mkLying(id === 'visor');
  else if (kind === 'item') s = { puddle: mkPuddle, gosma: () => mkGosma(), gosmaD: () => mkGosma(true), po: mkPo, mug: mkMug, visor: mkVisorItem, plate: mkPlate, coin: mkCoin, bush: mkBush, marker: mkMarker, tree0: () => mkTree(1, 0), tree1: () => mkTree(4, 1), tuft0: () => mkTuft(0), tuft1: () => mkTuft(3) }[id]();
  else s = SPRITE_BUILD[kind](id, pose, o);
  return (cache[key] = s);
}
// retorna o desenho para (tipo, personagem, pose) no instante t (alternando quadros _b a `rate` Hz)
export function poseFrame(name, t, rate = 1.6) {
  if (POSES[name + '_b']) return (Math.floor(t * (name === 'walk' || name === 'plate' ? 7 : name.startsWith('pant') ? 3 : rate)) % 2) ? name + '_b' : name;
  if (name.endsWith('_b') || POSES[name]) return name;
  return name;
}
export { bb, SPX };
export const specK = (id) => SPEC[id]?.k ?? 1;
