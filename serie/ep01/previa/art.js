// BRASA VIVA: pixel sprites desenhados em codigo (Teco, Lira, Gritador, Ouvidor, menu, props)
import * as THREE from 'three';
import { PX, ramp, hex, h2, texOf, billboard, blob, glow } from './px.js';

export const SPX = 1 / 30;
const R = (c, dz = .22) => ramp(c, dz);
export const C = {
  skin: R(['#4e2a1c', '#7a4a32', '#a06844', '#bf8458']),
  hair: R(['#050408', '#120f18', '#231d2c', '#3a3248']),
  vest: R(['#5e4f38', '#8d7a56', '#b8a578', '#d6c697']),
  shirt: R(['#3a3f48', '#555b66', '#727987']),
  pants: R(['#1f2227', '#32363e', '#4a4f5a', '#626874']),
  boot: R(['#1f1209', '#3a2214', '#573420', '#704630']),
  // vermelho-rubi #E01030 e o miolo da rampa
  ruby: R(['#6e0a1c', '#b00c26', '#e01030', '#f0304c'], .16),
  steel: R(['#2a2e36', '#555b66', '#8a909c', '#c4c9d2']),
  brass: R(['#3e2a10', '#7a5a24', '#b88c3e', '#e6c26a']),
  leather: R(['#1a0f09', '#2f1c10', '#4a2e1b']),
  glass: R(['#ff7a14', '#ff9f2e', '#ffc860', '#fff0b0']),
  glassY: R(['#d8a830', '#f0c94a', '#ffe27a', '#fff5c0']),
  moss: R(['#1c2a1f', '#2e4430', '#42603f', '#58784f']),
  braid: R(['#26130a', '#472714', '#69401f', '#8a5a2c']),
  canvas: R(['#4d4130', '#74654a', '#9a8a66', '#b8a880']),
  wood: R(['#2a1608', '#47290f', '#6a4119']),
  blue: R(['#0c1330', '#16224a', '#223470', '#33498f']),
  ouv: R(['#232b38', '#3c4a60', '#5d708c', '#8a9fbe']),
  ear: R(['#0e5a3c', '#1fa874', '#5ff0a8', '#c8ffe2'], .2),
  ash: R(['#8d8794', '#b6b0bd', '#d9d4df', '#f2eef6']),
};
const INK = hex('#17101a');

const rf = (P, x, y, w, h, f) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) P.set(x + i, y + j, f(x + i, y + j)); };
function mk(w, h, draw, outline = .3) {
  const P = new PX(w, h), E = new PX(w, h); draw(P, E); if (outline) P.outline(outline, [18, 12, 22]);
  return { tex: texOf(P.done()), em: texOf(E.done()), canvas: P.c, w, h };
}
export function bb(sp, o = {}) { return billboard(sp.tex, sp.w * SPX * (o.k ?? 1), sp.h * SPX * (o.k ?? 1), { em: sp.em, emCol: '#ffffff', emI: o.emI ?? 2, shadow: o.shadow ?? true, receive: false, ax: o.ax }); }

// lanterna de mao: x,y canto superior esquerdo; w x h do vidro; lit 0..1; pal = paleta do vidro
function lantern(P, E, x, y, gw, gh, lit, pal = C.glass, dead = false) {
  P.set(x + (gw >> 1) + 1, y - 2, C.brass(.5, 0, 0)); P.set(x + (gw >> 1), y - 1, C.brass(.6, 0, 0)); P.set(x + (gw >> 1) + 2, y - 1, C.brass(.6, 0, 0));
  P.rect(x, y, gw + 2, 1, C.brass(.9, 0, 0));
  for (let j = 0; j < gh; j++) for (let i = 0; i < gw + 2; i++) {
    const edge = i === 0 || i === gw + 1;
    if (edge) { P.set(x + i, y + 1 + j, C.brass(i === 0 ? .7 : .3, i, j)); continue; }
    if (dead) { P.set(x + i, y + 1 + j, hex(j < 2 && i === 1 ? '#4a4452' : '#1e1a24')); continue; }
    const f = lit * (1.25 - Math.hypot((i - (gw + 1) / 2) * .9, (j - gh / 2) * .7) * .35), c = pal(Math.min(.99, f * .8), i, j);
    P.set(x + i, y + 1 + j, c); E && E.set(x + i, y + 1 + j, c);
  }
  P.rect(x, y + gh + 1, gw + 2, 1, C.brass(.5, 0, 0));
}

// —— Teco visto de costas (32x48) ——
export function tecoBack() {
  return mk(34, 48, (P, E) => {
    // pernas e botas
    for (const lx of [11, 18]) { for (let y = 34; y < 44; y++) for (let x = lx; x < lx + 5; x++) P.set(x, y, C.pants(.7 - (x === lx ? .25 : 0) - (y > 40 ? .1 : 0), x, y)); for (let y = 43; y < 48; y++) for (let x = lx - (lx < 15 ? 1 : 0); x < lx + 5 + (lx > 15 ? 1 : 0); x++) P.set(x, y, C.boot(y > 46 ? .1 : .7 - (x === lx ? .3 : 0), x, y)); }
    // torso: colete de couro bege curto
    P.poly([[9, 18], [24, 18], [23, 34], [10, 34]], (x, y) => { const s = (x - 9) / 15; let v = .72 - s * .3 + ((x + (y >> 2)) % 6 === 0 ? -.14 : 0); if (y > 31) v -= .15; return C.vest(v, x, y); });
    P.rect(10, 18, 13, 1, C.vest(.2, 0, 0));
    // cinto
    P.rect(10, 31, 13, 2, C.leather(.7, 0, 0)); P.set(16, 31, C.brass(.9, 0, 0)); P.set(17, 31, C.brass(.9, 0, 0));
    // bracos (mangas de camisa curtas + antebraco pardo)
    // braco esquerdo (esquerda da imagem): dobrado, punho no cachecol
    for (let y = 19; y < 25; y++) for (let x = 6; x < 10; x++) P.set(x, y, C.shirt(.7 - (x === 6 ? .25 : 0), x, y));
    for (let y = 25; y < 28; y++) for (let x = 6; x < 9; x++) P.set(x, y, C.skin(.55 - (x === 6 ? .2 : 0), x, y));
    P.rect(6, 27, 4, 3, C.skin(.8, 0, 0)); P.set(6, 29, C.skin(.35, 0, 0)); P.set(9, 27, C.skin(.5, 0, 0));
    // braco direito: pende
    for (let y = 19; y < 26; y++) for (let x = 24; x < 28; x++) P.set(x, y, C.shirt(.65 - (x === 27 ? .25 : 0), x, y));
    for (let y = 26; y < 32; y++) for (let x = 25; x < 28; x++) P.set(x, y, C.skin(.6 - (x === 27 ? .25 : 0), x, y));
    P.rect(25, 32, 3, 3, C.skin(.7, 0, 0));
    // Espeto: bainha em diagonal nas costas, cabo acima do ombro direito
    P.line(23, 18, 12, 36, C.leather(.5, 0, 0)); P.line(22, 18, 11, 36, C.leather(.75, 0, 0)); P.line(24, 17, 13, 36, C.leather(.3, 0, 0));
    P.set(10, 37, C.steel(.7, 0, 0)); P.set(11, 37, C.brass(.8, 0, 0)); P.set(10, 36, C.brass(.8, 0, 0));
    P.rect(24, 10, 2, 7, C.leather(.75, 0, 0)); P.rect(22, 15, 6, 1, C.steel(.85, 0, 0)); P.rect(24, 8, 2, 2, C.steel(.9, 0, 0));
    // pescoco + cabeca (cabelo preto curto espetado)
    P.rect(14, 12, 6, 4, C.skin(.5, 0, 0));
    P.ellipse(17, 8, 7.2, 6.6, (x, y, dx, dy) => C.hair(.5 - dx * .25 - dy * .35 + (h2(x, y, 3) > .85 ? .2 : 0), x, y));
    for (const [sx, sy, sh] of [[10, 3, 3], [12, 1, 4], [15, 0, 4], [18, 0, 5], [21, 1, 4], [23, 3, 3], [13, 3, 2], [19, 2, 3]]) for (let k = 0; k < sh; k++) P.set(sx, sy + k, C.hair(.55 - k * .1, sx, sy + k)), P.set(sx + 1, sy + k + 1, C.hair(.4, 0, 0));
    P.set(9, 9, C.skin(.5, 0, 0)); P.set(9, 10, C.skin(.4, 0, 0)); P.set(25, 9, C.skin(.5, 0, 0)); P.set(25, 10, C.skin(.4, 0, 0));
    // cachecol rubi: volta no pescoco, ponta esquerda comprida (punho a segura), ponta direita curta
    P.ellipse(17, 16.5, 8, 3, (x, y, dx, dy) => C.ruby(.62 - dy * .35 + (dx < -.4 ? .08 : 0) + ((x + y) % 5 === 0 ? -.1 : 0), x, y));
    rf(P, 21, 17, 3, 9, (x, y) => C.ruby(.6 + (x === 21 ? .15 : -.05) - ((y + 2) % 4 === 0 ? .1 : 0), x, y));
    for (let y = 18; y < 31; y++) { const x0 = y < 26 ? 8 : 9 + ((y - 26) >> 2); for (let x = x0; x < x0 + 3; x++) P.set(x, y, C.ruby(.62 + (x === x0 ? .15 : -.03) - ((y + 1) % 4 === 0 ? .12 : 0), x, y)); }
    P.rect(9, 31, 2, 2, C.ruby(.5, 0, 0)); P.set(9, 33, C.ruby(.4, 0, 0)); P.set(10, 32, C.ruby(.75, 0, 0));
    // Brasa de Teco: lanterna de ferro na cintura esquerda (esquerda da imagem)
    P.rect(7, 31, 3, 1, C.steel(.3, 0, 0));
    lantern(P, E, 3, 33, 4, 5, 1, C.glass);
  });
}

// —— Lira de costas (28x40) ——
export function liraBack() {
  return mk(30, 40, (P, E) => {
    for (const lx of [10, 15]) { for (let y = 30; y < 36; y++) for (let x = lx; x < lx + 4; x++) P.set(x, y, C.pants(.45 - (x === lx ? .15 : 0), x, y)); for (let y = 35; y < 40; y++) for (let x = lx - 1; x < lx + 5; x++) P.set(x, y, C.boot(y > 38 ? .1 : .5 - (x === lx - 1 ? .2 : 0), x, y)); }
    // manto curto verde-musgo
    P.poly([[7, 14], [21, 14], [23, 32], [5, 32]], (x, y) => { const u = (y - 14) / 18, s = (x - (7 - 2 * u)) / (14 + 4 * u); return C.moss(.62 - s * .3 + ((x + (y >> 2)) % 5 === 0 ? -.12 : 0), x, y); });
    // mochila quadrada de lona
    rf(P, 8, 16, 12, 11, (x, y) => C.canvas(.55 + (y < 19 ? .12 : 0) - (x === 8 || x === 19 ? .25 : 0) - (y === 26 ? .25 : 0), x, y));
    P.rect(8, 21, 12, 1, C.leather(.5, 0, 0)); P.rect(13, 21, 2, 2, C.brass(.8, 0, 0)); P.rect(7, 15, 14, 1, C.canvas(.2, 0, 0));
    // arco curto nas costas
    for (let t = 0; t <= 1; t += .04) { const x = 23 - Math.sin(t * Math.PI) * 2.6, y = 5 + t * 27; P.set(Math.round(x), Math.round(y), C.wood(.65, 0, 0)); P.set(Math.round(x) + 1, Math.round(y), C.wood(.3, 0, 0)); }
    P.line(23, 5, 23, 32, C.canvas(.5, 0, 0));
    // trança longa castanha descendo pelas costas
    for (let y = 12; y < 31; y++) { const x = 13 + Math.round(Math.sin(y * .7) * .8); P.set(x, y, C.braid(.7 - (y % 3 === 0 ? .25 : 0), x, y)); P.set(x + 1, y, C.braid(.5 - (y % 3 === 1 ? .2 : 0), x, y)); }
    P.rect(13, 31, 2, 2, hex('#7a6a3a'));
    // capuz
    P.ellipse(14, 8, 7, 7, (x, y, dx, dy) => C.moss(.7 - dx * .25 - dy * .3 + (y > 10 ? -.1 : 0), x, y));
    P.poly([[10, 13], [18, 13], [19, 16], [9, 16]], (x, y) => C.moss(.55, x, y));
    P.set(14, 0, C.moss(.5, 0, 0)); P.set(13, 1, C.moss(.45, 0, 0)); P.set(15, 1, C.moss(.45, 0, 0));
    // braco direito (direita da imagem) levantado, mao segurando a ponta do cachecol rubi
    for (let y = 16; y < 22; y++) for (let x = 21; x < 25; x++) if (x - 21 <= (y - 16) * 0 + 3) P.set(x, y, C.moss(.5 - (x === 24 ? .2 : 0), x, y));
    rf(P, 22, 11, 3, 6, () => C.moss(.5, 0, 0)); P.rect(22, 9, 3, 3, C.skin(.8, 0, 0));
    // segunda mao (esquerda da imagem) pende
    P.rect(5, 22, 3, 7, C.moss(.42, 0, 0)); P.rect(5, 29, 3, 2, C.skin(.7, 0, 0));
    // Brasa de Lira: menor, mais fraca, amarelada, cintura direita (direita da imagem)
    P.rect(21, 28, 3, 1, C.steel(.3, 0, 0)); lantern(P, E, 21, 30, 2, 3, .55, C.glassY);
  });
}

// —— O Gritador, deitado visto de cima (flat), se desfazendo em cinza ——
export function gritadorTop(seed = 4) {
  return mk(60, 34, (P, E) => {
    // pernas (direita), tronco, bracos abertos, cabeca a esquerda
    P.ellipse(40, 14, 9, 4, C.pants(.35, 0, 0)); P.rect(46, 9, 12, 4, C.boot(.5, 0, 0)); P.rect(46, 17, 12, 4, C.boot(.45, 0, 0));
    P.ellipse(30, 16, 10, 8, (x, y, dx, dy) => C.blue(.7 - dx * .1 - dy * .3 + (h2(x, y, 5) > .9 ? .2 : 0), x, y));
    P.rect(26, 11, 9, 1, C.steel(.5, 0, 0)); P.rect(26, 21, 9, 1, C.steel(.4, 0, 0));
    P.rect(22, 3, 4, 10, C.blue(.55, 0, 0)); P.rect(22, 20, 5, 11, C.blue(.5, 0, 0)); P.rect(21, 2, 3, 3, C.skin(.6, 0, 0)); P.rect(22, 30, 3, 3, C.skin(.55, 0, 0));
    P.ellipse(16, 16, 5.5, 5, (x, y, dx, dy) => C.skin(.62 - dx * .1 - dy * .2, x, y));
    P.ellipse(13, 16, 3, 4.6, (x, y) => C.hair(.55 + (h2(x, y, 2) - .5) * .4, x, y));
    P.set(18, 14, INK); P.set(18, 18, INK); P.rect(19, 16, 2, 1, hex('#5a1a1a'));
    // desintegracao: pixels apagados nas bordas, cinza
    for (let y = 0; y < 34; y++) for (let x = 0; x < 60; x++) { const c = P.get(x, y); if (!c) continue; const e = Math.max(0, (x - 38) / 22) * .9 + Math.abs(y - 16) / 40; if (h2(x, y, seed) < e * .55) { if (h2(x, y, seed + 1) < .55) P.d.data[(y * 60 + x) * 4 + 3] = 0; else P.set(x, y, C.ash(.4 + h2(x, y, 9) * .6, x, y)); } }
  }, .28);
}
export function axeFlat() {
  return mk(30, 12, (P) => {
    P.rect(2, 5, 22, 2, C.wood(.7, 0, 0)); P.rect(2, 6, 22, 1, C.wood(.3, 0, 0));
    P.poly([[20, 0], [29, 1], [29, 11], [20, 12], [22, 6]], (x, y) => C.steel(.8 - (x - 20) * .04 - (y > 6 ? .25 : 0), x, y));
    P.rect(19, 3, 3, 6, C.steel(.35, 0, 0));
  });
}
export function ashDot() { return mk(8, 8, (P) => { P.ellipse(4, 4, 3.4, 3, (x, y, dx, dy) => C.ash(.7 - dx * .2 - dy * .2, x, y)); }, 0); }
export function deadLantern() { return mk(9, 14, (P, E) => { lantern(P, E, 1, 3, 5, 6, 0, C.glass, true); }); }

// —— Ouvidor (40x124): alto, magro, cinza-azulado, sem olhos, orelhas gigantes de membrana verde, curvado ——
export function ouvidor() {
  return mk(60, 124, (P, E) => {
    const cx = 30;
    // pernas finas
    for (const [lx, w] of [[22, 3], [33, 3]]) for (let y = 66; y < 122; y++) { const bend = Math.sin((y - 66) / 56 * Math.PI) * (lx < 30 ? -3 : 3); for (let x = 0; x < w; x++) P.set(Math.round(lx + bend + x), y, C.ouv(.62 - x * .2 - (y % 9 === 0 ? .15 : 0), x, y)); }
    P.rect(18, 120, 8, 3, C.ouv(.3, 0, 0)); P.rect(32, 120, 8, 3, C.ouv(.25, 0, 0));
    // tronco curvado para a frente (costelas visiveis)
    P.poly([[22, 44], [40, 44], [37, 70], [24, 70]], (x, y) => C.ouv(.55 - (x - 22) / 18 * .3 + (y % 5 === 0 && x > 25 && x < 37 ? -.18 : 0), x, y));
    // bracos longos ate o chao, dedos compridos
    for (const [sx, dir] of [[21, -1], [40, 1]]) { for (let y = 46; y < 100; y++) { const x = sx + dir * Math.round(Math.sin((y - 46) / 54 * 1.6) * 5); P.set(x, y, C.ouv(.6, 0, 0)); P.set(x + dir, y, C.ouv(.35, 0, 0)); } for (let k = 0; k < 4; k++) P.line(sx + dir * 5, 99, sx + dir * (6 + k * 1.2), 108 + k, C.ouv(.5, 0, 0)); }
    // cabeca baixa, sem olhos, sem rosto, fenda de boca
    P.ellipse(cx + 1, 41, 6.5, 8, (x, y, dx, dy) => C.ouv(.7 - dx * .25 - dy * .2, x, y));
    P.rect(cx - 1, 45, 4, 1, hex('#0b0e14'));
    // orelhas gigantes: antenas de membrana fina que brilham verde
    for (const s of [-1, 1]) {
      const bx = cx + 1 + s * 4, by = 36;
      P.poly([[bx, by], [bx + s * 22, by - 30], [bx + s * 25, by - 26], [bx + s * 24, by - 8], [bx + s * 8, by + 4]], (x, y) => { const u = Math.abs(x - bx) / 26, v = 1 - (by - y) / 34; const vein = Math.abs(((y - by) + 30) * .8 - (x - bx) * s * .9) % 7 < 1; const c = C.ear(.95 - u * .35 - (vein ? .4 : 0) + (h2(x, y, 1) - .5) * .1, x, y); return c; });
      P.line(bx, by, bx + s * 24, by - 28, C.ouv(.8, 0, 0)); P.line(bx + s * 1, by + 1, bx + s * 24, by - 9, C.ouv(.6, 0, 0));
    }
    // emissivo das membranas: copia dos pixels verdes
    for (let y = 0; y < 124; y++) for (let x = 0; x < 60; x++) { const c = P.get(x, y); if (c && c[1] > c[0] + 25 && c[1] > c[2] - 10) E.set(x, y, c); }
  }, .3);
}

// —— Teco visto de cima (flat, deitado no chao): cabelo, ombros, cachecol, bracos, Brasa, Espeto ——
export function tecoTop() {
  return mk(64, 80, (P, E) => {
    // ombros / costas (colete) e cintura
    P.poly([[14, 28], [50, 28], [52, 36], [46, 62], [18, 62], [12, 36]], (x, y) => { const s = (x - 12) / 40; let v = .7 - Math.abs(s - .5) * .35 - (y > 54 ? .15 : 0) + ((x + (y >> 2)) % 6 === 0 ? -.12 : 0); return C.vest(v, x, y); });
    P.rect(18, 56, 28, 3, C.leather(.7, 0, 0));
    // bracos: direito (esq. da imagem) estendido para a frente (baixo), mao aberta, dois dedos; esquerdo (dir. da imagem) dobrado
    P.poly([[10, 30], [17, 30], [16, 50], [8, 50]], (x, y) => C.shirt(.7 - (x < 11 ? .2 : 0), x, y));
    P.poly([[8, 50], [16, 50], [15, 64], [9, 64]], (x, y) => C.skin(.6 - (x < 10 ? .2 : 0), x, y));
    P.rect(7, 64, 10, 6, C.skin(.8, 0, 0)); P.rect(7, 64, 1, 6, C.skin(.5, 0, 0));
    P.rect(8, 70, 3, 8, C.skin(.85, 0, 0)); P.rect(8, 70, 1, 8, C.skin(.5, 0, 0)); P.rect(12, 70, 3, 9, C.skin(.85, 0, 0)); P.rect(12, 70, 1, 9, C.skin(.5, 0, 0)); P.rect(8, 77, 3, 1, C.skin(.4, 0, 0)); P.rect(12, 78, 3, 1, C.skin(.4, 0, 0));
    P.rect(15, 66, 3, 2, C.skin(.6, 0, 0)); P.rect(15, 68, 2, 3, C.skin(.5, 0, 0)); P.rect(16, 71, 1, 1, C.skin(.4, 0, 0));
    P.poly([[47, 30], [54, 30], [56, 46], [48, 48]], (x, y) => C.shirt(.7 - (x > 52 ? .2 : 0), x, y));
    P.poly([[48, 46], [56, 44], [55, 54], [47, 54]], (x, y) => C.skin(.6, 0, 0));
    P.rect(45, 52, 11, 7, C.skin(.85, 0, 0)); P.rect(46, 53, 2, 5, C.skin(.45, 0, 0));
    // Espeto nas costas: bainha diagonal, cabo no ombro direito
    P.line(18, 26, 48, 56, C.leather(.55, 0, 0)); P.line(19, 26, 49, 56, C.leather(.75, 0, 0)); P.line(17, 26, 47, 56, C.leather(.3, 0, 0));
    P.rect(13, 21, 8, 2, C.steel(.9, 0, 0)); P.rect(15, 14, 3, 8, C.leather(.7, 0, 0)); P.rect(15, 11, 3, 3, C.steel(.85, 0, 0));
    // cabeca vista de cima: cabelo preto espetado
    P.ellipse(32, 17, 11, 12, (x, y, dx, dy) => { const spike = Math.sin(Math.atan2(dy, dx) * 9) * .5; return C.hair(.4 - Math.hypot(dx, dy) * .35 + spike * .35 + (h2(x, y, 7) > .9 ? .25 : 0) + (dy < -.3 && dx > -.1 ? .15 : 0), x, y); });
    for (let a = 0; a < 6.28; a += .55) { const x = 32 + Math.cos(a) * 12, y = 17 + Math.sin(a) * 13; P.set(Math.round(x), Math.round(y), C.hair(.5, 0, 0)); P.set(Math.round(32 + Math.cos(a) * 13.2), Math.round(17 + Math.sin(a) * 14.4), C.hair(.3, 0, 0)); }
    P.rect(20, 17, 2, 4, C.skin(.5, 0, 0)); P.rect(43, 17, 2, 4, C.skin(.5, 0, 0));
    // cachecol rubi: gola ao redor do pescoco + ponta longa pelo ombro esquerdo (dir. da imagem) ate o punho
    P.ellipse(32, 31, 14, 4.6, (x, y, dx, dy) => C.ruby(.62 - dy * .3 + (dx > .4 ? .1 : 0) + ((x + y) % 5 === 0 ? -.1 : 0), x, y));
    for (let t = 0; t <= 1; t += .02) { const x = 44 + Math.sin(t * 3) * 3 + t * 6, y = 31 + t * 22; P.rect(Math.round(x), Math.round(y), 4, 2, C.ruby(.6 + (t % .1 < .05 ? .1 : -.08), x, y)); }
    // punho esquerdo fechado na ponta do cachecol (por cima do Espeto)
    P.rect(45, 50, 11, 8, C.skin(.85, 0, 0)); P.rect(45, 50, 11, 1, C.skin(.4, 0, 0)); P.rect(46, 52, 1, 4, C.skin(.5, 0, 0)); P.rect(49, 54, 5, 1, C.skin(.5, 0, 0)); P.rect(50, 58, 4, 5, C.ruby(.55, 0, 0)); P.rect(50, 58, 1, 5, C.ruby(.8, 0, 0)); P.set(51, 63, C.ruby(.35, 0, 0));
    // Brasa de Teco: cintura esquerda (dir. da imagem), vista de cima: tampa e brilho
    P.rect(53, 63, 9, 9, C.steel(.45, 0, 0)); rf(P, 54, 64, 7, 7, (x, y) => { E.set(x, y, C.glass(.95, x, y)); return C.glass(.85 - (Math.hypot(x - 57.5, y - 67.5)) * .08, x, y); }); P.rect(56, 66, 3, 3, C.glass(.9, 0, 0)); E.rect(56, 66, 3, 3, C.glass(.9, 0, 0));
  }, .3);
}
// pessoa anonima vista de cima (cabeca + ombros)
export function crowdTop(hairCol, clothCol) {
  return mk(18, 20, (P) => {
    const cl = R(clothCol), hr = R(hairCol);
    P.ellipse(9, 14, 8, 5, (x, y, dx, dy) => cl(.65 - dy * .3 + (h2(x, y, 4) - .5) * .2, x, y));
    P.ellipse(9, 8, 4.5, 5, (x, y, dx, dy) => hr(.55 - dy * .3 + (h2(x, y, 6) - .5) * .25, x, y));
  });
}

// —— Menu: painel quadrado azul-ardosia, moldura prata, 4 icones e um espaco cinza liso (sem texto) ——
export function menuPanel() {
  const W = 96, P = new PX(W, W), F = R(['#6c7380', '#9aa2ae', '#cfd5de', '#f4f7fb'], .15), S = R(['#222c3e', '#2c3a52', '#38486a', '#48597e'], .2);
  P.fill((x, y) => { const e = Math.min(x, y, W - 1 - x, W - 1 - y); if (e < 3) return F(.55 + (e === 0 ? .4 : e === 2 ? -.3 : 0) + (x + y < 40 ? .15 : 0), x, y); return S(.5 + (1 - y / W) * .25 + (h2(x, y, 3) - .5) * .12 + ((x + y) % 24 < 3 ? .08 : 0), x, y); });
  for (const [cx, cy] of [[5, 5], [W - 6, 5], [5, W - 6], [W - 6, W - 6]]) P.rect(cx - 1, cy - 1, 3, 3, F(.95, 0, 0));
  const tile = (x, y, w, h) => { P.rect(x, y, w, h, S(.2, 0, 0)); P.rect(x, y, w, 1, S(.7, 0, 0)); P.rect(x, y, 1, h, S(.6, 0, 0)); P.rect(x, y + h - 1, w, 1, S(.05, 0, 0)); P.rect(x + w - 1, y, 1, h, S(.05, 0, 0)); };
  const T = [[9, 9], [51, 9], [9, 41], [51, 41]];
  T.forEach(([x, y]) => tile(x, y, 36, 28));
  const W1 = hex('#e8eef6'), W2 = hex('#aab6c8');
  // bolsa
  let [x, y] = [9 + 18, 9 + 14];
  P.ellipse(x, y + 3, 7, 7, (a, b, dx, dy) => C.leather(.8 - dy * .3 + dx * .1, a, b)); P.rect(x - 3, y - 5, 6, 3, C.leather(.6, 0, 0)); P.rect(x - 4, y - 3, 8, 1, W1); P.rect(x - 1, y + 1, 2, 2, W1);
  // mapa dobrado
  [x, y] = [51 + 18, 9 + 14];
  P.rect(x - 8, y - 6, 16, 12, W1); P.rect(x - 3, y - 6, 1, 12, W2); P.rect(x + 3, y - 6, 1, 12, W2); P.line(x - 6, y + 3, x - 2, y - 2, hex('#b0382a')); P.line(x - 2, y - 2, x + 2, y + 2, hex('#b0382a')); P.line(x + 2, y + 2, x + 6, y - 3, hex('#b0382a')); P.rect(x + 5, y - 4, 2, 2, hex('#b0382a'));
  // dois elos entrelacados (Corda)
  [x, y] = [9 + 18, 41 + 14];
  const ring = (cx, cy, rx, ry, c) => { for (let a = 0; a < 6.28; a += .12) { P.set(Math.round(cx + Math.cos(a) * rx), Math.round(cy + Math.sin(a) * ry), c); P.set(Math.round(cx + Math.cos(a) * (rx - 1)), Math.round(cy + Math.sin(a) * (ry - 1)), c); } };
  ring(x - 4, y, 6, 4, W1); ring(x + 4, y, 6, 4, W2);
  // Anel de Voz: circulo verde-claro
  [x, y] = [51 + 18, 41 + 14];
  ring(x, y, 8, 8, hex('#a6e8b0')); ring(x, y, 4, 4, hex('#a6e8b0'));
  // espaco cinza liso e vazio, onde devia haver o icone de sair
  P.rect(9, 73, 78, 16, hex('#6f747d')); P.rect(9, 73, 78, 1, hex('#7c818a')); P.rect(9, 88, 78, 1, hex('#656a72'));
  return texOf(P.done());
}
export { glow, blob };
