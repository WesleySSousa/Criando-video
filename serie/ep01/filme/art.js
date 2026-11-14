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
  ouv: R(['#2e3848', '#4a5c78', '#7088a8', '#a4bcdc']),
  ear: R(['#0e5a3c', '#1fa874', '#5ff0a8', '#c8ffe2'], .2),
  ouvH: R(['#34405a', '#4d5f7e', '#6f86a6', '#92a9c8']),
  earM: R(['#16302c', '#245048', '#37746a', '#5b9a8a'], .2),
  ash: R(['#8d8794', '#b6b0bd', '#d9d4df', '#f2eef6']),
};
export const INK = hex('#17101a');

export const rf = (P, x, y, w, h, f) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) P.set(x + i, y + j, f(x + i, y + j)); };
function scaled(R, k) {
  const B = Math.ceil(k), wrap = c => typeof c === 'function' ? ((x, y, dx, dy) => c(x / k, y / k, dx, dy)) : c;
  return { real: R, k,
    set(x, y, c, a) { const X = Math.floor(x * k), Y = Math.floor(y * k); for (let j = 0; j < B; j++) for (let i = 0; i < B; i++) R.set(X + i, Y + j, c, a); },
    get(x, y) { return R.get(Math.floor(x * k), Math.floor(y * k)); },
    rect(x, y, w, h, c) { R.rect(Math.floor(x * k), Math.floor(y * k), Math.round(w * k), Math.round(h * k), c); },
    ellipse(cx, cy, rx, ry, c) { R.ellipse(cx * k, cy * k, rx * k, ry * k, wrap(c)); },
    poly(pts, c) { R.poly(pts.map(p => [p[0] * k, p[1] * k]), wrap(c)); },
    line(x0, y0, x1, y1, c) { for (let j = 0; j < B; j++) for (let i = 0; i < B; i++) R.line(x0 * k + i, y0 * k + j, x1 * k + i, y1 * k + j, c); },
  };
}
export function mk(w, h, draw, outline = .3, k = 1) {
  const R = new PX(Math.round(w * k), Math.round(h * k)), RE = new PX(Math.round(w * k), Math.round(h * k));
  draw(k === 1 ? R : scaled(R, k), k === 1 ? RE : scaled(RE, k)); if (outline) R.outline(outline, [18, 12, 22]);
  return { tex: texOf(R.done()), em: texOf(RE.done()), canvas: R.c, w, h };
}
export const K = 2.5, mkk = (w, h, d, o = .3) => mk(w, h, d, o, K);
export const rf2 = (P, x, y, w, h, f) => { const R = P.real, k = P.k; for (let Y = Math.floor(y * k); Y < Math.round((y + h) * k); Y++) for (let X = Math.floor(x * k); X < Math.round((x + w) * k); X++) R.set(X, Y, f(X / k, Y / k)); };
export function bb(sp, o = {}) { return billboard(sp.tex, sp.w * SPX * (o.k ?? 1), sp.h * SPX * (o.k ?? 1), { em: sp.em, emCol: '#ffffff', emI: o.emI ?? 2, shadow: o.shadow ?? true, receive: false, ax: o.ax }); }

// lanterna de mao: x,y canto superior esquerdo; w x h do vidro; lit 0..1; pal = paleta do vidro
export function lantern(P, E, x, y, gw, gh, lit, pal = C.glass, dead = false) {
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


// ================= v2: perfis (camera lateral) =================
// Teco de perfil olhando para a direita (mostra o lado esquerdo dele: punho no cachecol e Brasa visiveis). pose: stand | menu | kneel
function headSide(P, hx, hy, o = {}) {
  P.ellipse(hx, hy, 6.5, 7.2, (x, y, dx, dy) => (dx < -.12 || dy < -.5 + dx * .35) ? C.hair(.42 - dy * .3 + (h2(x, y, 3) > .86 ? .22 : 0), x, y) : C.skin(.66 - dx * .1 - dy * .22 + (dx > .75 ? .1 : 0), x, y));
  for (const [dx, h] of [[-5, 3], [-3, 4], [-1, 5], [1, 4], [3, 4], [5, 2], [-6, 2]]) for (let k = 0; k < h; k++) { P.set(hx + dx, hy - 7 - k + (dx > 3 ? 1 : 0), C.hair(.55 - k * .1, 0, 0)); P.set(hx + dx + 1, hy - 7 - k + 1, C.hair(.38, 0, 0)); }
  P.rect(hx - 3, hy + 1, 2, 3, C.skin(.38, 0, 0)); P.set(hx - 3, hy + 2, C.skin(.2, 0, 0));
  P.rect(hx + 3, hy, 2, 2, INK); P.set(hx + 4, hy, hex('#f6efe4')); P.rect(hx + 2, hy - 2, 4, 1, C.hair(.2, 0, 0));
  P.set(hx + 7, hy + 2, C.skin(.7, 0, 0)); P.set(hx + 7, hy + 3, C.skin(.5, 0, 0)); P.rect(hx + 4, hy + 5, 2, 1, hex(o.lips ? '#7a3a2e' : '#5a2a22'));
  P.rect(hx + 6, hy + 4, 1, 1, C.skin(.5, 0, 0)); P.set(hx + 3, hy + 3, hex('#c26a5a'));
}
function tecoSideOld(pose = 'stand') {
  const kn = pose === 'kneel', by = kn ? 12 : 0, hx = 21, hy = 10 + by;
  return mkk(40, 56, (P, E) => {
    // pernas
    if (!kn) {
      rf2(P, 20, 38, 5, 13, (x, y) => C.pants(.4 - (x === 20 ? .1 : 0), x, y)); rf2(P, 20, 50, 8, 5, (x, y) => C.boot(.35 - (y > 53 ? .2 : 0), x, y));
      rf2(P, 15, 38, 6, 13, (x, y) => C.pants(.72 - (x === 15 ? .25 : 0), x, y)); rf2(P, 15, 50, 12, 5, (x, y) => C.boot(.65 - (y > 53 ? .4 : 0) - (x === 15 ? .2 : 0), x, y));
    } else {
      rf2(P, 5, 52, 12, 3, (x, y) => C.boot(.4, x, y)); rf2(P, 12, 48, 8, 5, (x, y) => C.pants(.4, x, y));
      rf2(P, 14, 46, 15, 5, (x, y) => C.pants(.72 - (y === 46 ? -.1 : 0) - (y > 49 ? .2 : 0), x, y)); rf2(P, 25, 50, 5, 5, (x, y) => C.pants(.55, x, y)); rf2(P, 25, 53, 9, 3, (x, y) => C.boot(.6 - (y > 54 ? .3 : 0), x, y));
    }
    // braco direito (longe) levantado para o Menu
    if (pose === 'menu') { rf2(P, 23, 22 + by, 7, 3, (x, y) => C.shirt(.45, x, y)); P.rect(30, 22, 4, 3, C.skin(.55, 0, 0)); P.rect(34, 23, 1, 5, C.skin(.7, 0, 0)); P.rect(36, 23, 1, 6, C.skin(.7, 0, 0)); P.rect(33, 23, 1, 2, C.skin(.45, 0, 0)); }
    // espeto: cabo acima do ombro, bainha em diagonal nas costas
    P.line(14, 22 + by, 9, 46 + by, C.leather(.5, 0, 0)); P.line(15, 22 + by, 10, 46 + by, C.leather(.75, 0, 0)); P.line(13, 22 + by, 8, 46 + by, C.leather(.3, 0, 0));
    P.rect(11, 13 + by, 2, 8, C.leather(.7, 0, 0)); P.rect(9, 20 + by, 6, 1, C.steel(.85, 0, 0)); P.rect(11, 11 + by, 2, 2, C.steel(.9, 0, 0));
    // cachecol: ponta longa ao vento, atras
    for (let t = 0; t < 1; t += .04) { const x = 14 - Math.sin(t * 2.4) * 5.5, y = hy + 9 + t * 17; for (let w = 0; w < 3; w++) P.set(Math.round(x) + w, Math.round(y), C.ruby(.62 + (w === 0 ? .15 : w === 2 ? -.12 : 0) - (Math.round(y) % 4 === 0 ? .1 : 0), 0, 0)); }
    // torso: colete bege
    P.poly([[14, 20 + by], [27, 20 + by], [28, 38 + by], [13, 38 + by]], (x, y) => C.vest(.74 - (x - 14) / 14 * .22 - (y > 34 + by ? .12 : 0) + ((x + (y >> 2)) % 6 === 0 ? -.12 : 0), x, y));
    P.rect(13, 36 + by, 15, 2, C.leather(.7, 0, 0)); P.rect(23, 36 + by, 2, 2, C.brass(.9, 0, 0));
    // Brasa de Teco: cintura esquerda (lado visivel)
    lantern(P, E, 15, 39 + by, 3, 4, 1, C.glass);
    // braco esquerdo (perto)
    if (pose !== 'kneel') {
      rf2(P, 16, 22, 5, 10, (x, y) => C.shirt(.7 - (x === 16 ? .25 : 0), x, y)); rf2(P, 19, 30, 7, 3, (x, y) => C.skin(.62 - (y > 31 ? .2 : 0), x, y));
      P.rect(25, 28, 5, 5, C.skin(.85, 0, 0)); P.rect(25, 28, 5, 1, C.skin(.45, 0, 0)); P.rect(26, 30, 1, 2, C.skin(.45, 0, 0)); P.rect(27, 25, 2, 3, C.ruby(.7, 0, 0)); P.rect(27, 33, 2, 4, C.ruby(.6, 0, 0)); P.set(28, 37, C.ruby(.35, 0, 0));
    } else {
      rf2(P, 16, 22 + by, 5, 8, (x, y) => C.shirt(.7 - (x === 16 ? .25 : 0), x, y)); rf2(P, 20, 28 + by, 6, 3, (x, y) => C.skin(.62, x, y)); P.rect(24, 22 + by - 2, 3, 8, C.skin(.7, 0, 0)); rf2(P, 22, 25 + by, 3, 4, (x, y) => C.skin(.6, x, y)); P.rect(26, 16 + by + 5, 2, 5, C.skin(.85, 0, 0)); P.set(27, 20 + by, C.skin(.45, 0, 0));
    }
    // pescoco, cabeca, cachecol (gola)
    P.rect(hx - 2, hy + 6, 5, 4, C.skin(.4, 0, 0));
    headSide(P, hx, hy, { lips: kn });
    P.ellipse(hx - .5, hy + 9, 6.8, 2.8, (x, y, dx, dy) => C.ruby(.62 - dy * .3 + ((x + y) % 5 === 0 ? -.1 : 0), x, y));
    P.rect(hx + 4, hy + 8, 3, 3, C.ruby(.5, 0, 0));
  });
}

// Lira de perfil (34x46), olhando para a direita; mao segurando a ponta do cachecol (ponta rubi acima da mao)
function liraSideOld() {
  return mkk(34, 46, (P, E) => {
    const hx = 17, hy = 10;
    for (const [lx, sh] of [[17, .35], [11, .6]]) { rf2(P, lx, 35, 5, 8, (x, y) => C.pants(sh - (x === lx ? .15 : 0), x, y)); rf2(P, lx - 1, 42, 9, 4, (x, y) => C.boot(.55 - (y > 44 ? .35 : 0), x, y)); }
    // arco atras, mochila, tranca
    for (let t = 0; t <= 1; t += .04) { const x = 5 - Math.sin(t * Math.PI) * 2.6, y = 6 + t * 28; P.set(Math.round(x), Math.round(y), C.wood(.65, 0, 0)); P.set(Math.round(x) + 1, Math.round(y), C.wood(.3, 0, 0)); }
    rf2(P, 5, 18, 8, 12, (x, y) => C.canvas(.55 + (y < 21 ? .12 : 0) - (x === 5 ? .25 : 0) - (y === 29 ? .25 : 0), x, y)); P.rect(5, 23, 8, 1, C.leather(.5, 0, 0));
    for (let y = 14; y < 35; y++) { const x = 10 + Math.round(Math.sin(y * .6) * .9); P.set(x, y, C.braid(.7 - (y % 3 === 0 ? .25 : 0), x, y)); P.set(x - 1, y, C.braid(.45, 0, 0)); } P.rect(9, 35, 3, 2, hex('#8a7a46'));
    P.poly([[12, 16], [23, 16], [24, 35], [11, 35]], (x, y) => C.moss(.62 - (x - 12) / 12 * .25 + ((x + (y >> 2)) % 5 === 0 ? -.12 : 0), x, y));
    // capuz e rosto
    P.ellipse(hx, hy, 8, 8, (x, y, dx, dy) => C.moss(.7 - dx * .25 - dy * .3, x, y));
    P.ellipse(hx + 3, hy + 1.5, 4.6, 5.3, (x, y, dx, dy) => C.skin(.7 - dx * .12 - dy * .2, x, y));
    P.rect(hx + 3, hy, 2, 2, INK); P.set(hx + 4, hy, hex('#f6efe4')); P.rect(hx + 2, hy - 2, 4, 1, C.hair(.2, 0, 0)); P.set(hx + 8, hy + 2, C.skin(.7, 0, 0)); P.rect(hx + 5, hy + 5, 2, 1, hex('#6a2e26')); P.set(hx + 3, hy + 3, hex('#d27a66'));
    P.rect(hx + 2, hy - 4, 5, 1, C.moss(.35, 0, 0)); P.set(hx - 1, hy - 8, C.moss(.5, 0, 0));
    // braco para a frente, mao com a ponta do cachecol
    for (let t = 0; t <= 1; t += .05) { const x = 19 + t * 9, y = 20 + t * 5; P.rect(Math.round(x), Math.round(y), 3, 3, C.moss(.5 - t * .1, 0, 0)); }
    P.rect(28, 24, 3, 3, C.skin(.8, 0, 0)); P.rect(29, 19, 2, 5, C.ruby(.65, 0, 0)); P.rect(29, 19, 1, 5, C.ruby(.9, 0, 0)); P.set(29, 18, C.ruby(.4, 0, 0));
    // Brasa de Lira: menor e amarelada
    lantern(P, E, 14, 31, 2, 3, .6, C.glassY);
  });
}

// Gritador deitado de costas (visto de lado), borda direita se desfazendo em cinza
export function gritadorSide() {
  return mkk(64, 20, (P, E) => {
    P.ellipse(7, 12, 5, 5, (x, y, dx, dy) => C.skin(.62 - dy * .15, x, y)); P.ellipse(5, 11, 4, 4.4, (x, y) => C.hair(.5 + (h2(x, y, 2) - .5) * .4, x, y)); P.set(10, 11, INK); P.rect(11, 13, 2, 1, hex('#5a1a1a'));
    rf2(P, 13, 7, 22, 9, (x, y) => C.blue(.72 - (y - 7) / 9 * .3 + (h2(x, y, 5) > .92 ? .2 : 0), x, y)); P.rect(18, 7, 1, 9, C.steel(.5, 0, 0)); P.rect(28, 7, 1, 9, C.steel(.45, 0, 0));
    P.rect(16, 3, 12, 3, C.blue(.5, 0, 0)); P.rect(28, 1, 3, 3, C.skin(.55, 0, 0));
    rf2(P, 35, 9, 14, 6, (x, y) => C.pants(.4 + (y === 9 ? .15 : 0), x, y)); rf2(P, 44, 5, 5, 6, (x, y) => C.pants(.5, x, y)); rf2(P, 48, 3, 6, 4, (x, y) => C.boot(.5, x, y)); rf2(P, 50, 12, 9, 5, (x, y) => C.boot(.45, x, y));
    { const R = P.real; for (let y = 0; y < R.h; y++) for (let x = 0; x < R.w; x++) { const c = R.get(x, y); if (!c) continue; const e = Math.max(0, (x / K - 30) / 34) * .95; if (h2(x >> 1, y >> 1, 4) < e * .6) { if (h2(x >> 1, y >> 1, 5) < .55) R.d.data[(y * R.w + x) * 4 + 3] = 0; else R.set(x, y, C.ash(.4 + h2(x, y, 9) * .6, x, y)); } } }
  }, .28);
}
export function axeSide() {
  return mkk(34, 16, (P) => { rf2(P, 1, 10, 24, 2, (x, y) => C.wood(y === 10 ? .8 : .35, x, y)); P.poly([[22, 12], [24, 2], [33, 0], [32, 13], [28, 12]], (x, y) => C.steel(.82 - (x - 22) * .03 - (y > 7 ? .25 : 0), x, y)); P.rect(21, 8, 3, 6, C.steel(.35, 0, 0)); });
}
// Ouvidor de perfil (64x128): curvado, cabeca baixa e legivel, orelhas altas e finas em folha
function ouvidor2Old() {
  return mkk(64, 128, (P, E) => {
    const L = (x0, y0, x1, y1, w, f) => { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) * 2; for (let i = 0; i <= n; i++) { const t = i / n, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t; for (let k = 0; k < w; k++) P.set(Math.round(x) + k, Math.round(y), f(t, k)); } };
    const sk = (b) => (t, k) => C.ouv(b - k * .18 - (t % .2 < .03 ? .1 : 0), 0, 0);
    // pernas finas e longas
    L(33, 72, 27, 94, 3, sk(.45)); L(27, 94, 31, 121, 3, sk(.45)); P.rect(29, 120, 10, 3, C.ouv(.3, 0, 0));
    L(29, 72, 22, 94, 3, sk(.7)); L(22, 94, 25, 121, 3, sk(.7)); P.rect(23, 120, 10, 3, C.ouv(.5, 0, 0));
    // tronco curvado
    P.poly([[24, 72], [35, 74], [42, 62], [47, 52], [40, 43], [30, 44], [23, 58]], (x, y) => C.ouv(.62 - (x - 23) / 24 * .3 + ((y % 5 === 0 && x > 30 && x < 42) ? -.18 : 0), x, y));
    for (let k = 0; k < 4; k++) P.line(32, 50 + k * 5, 40 - k, 53 + k * 5, C.ouv(.25, 0, 0));
    // pescoco longo e cabeca baixa (sem olhos)
    L(42, 46, 50, 52, 4, sk(.7));
    P.ellipse(54, 57, 7.5, 5.6, (x, y, dx, dy) => C.ouv(.78 - dx * .15 - dy * .3 + (dy < -.5 ? .1 : 0), x, y));
    P.poly([[58, 59], [63, 64], [60, 66], [55, 63]], (x, y) => C.ouv(.6 - (y - 59) * .05, x, y));
    P.rect(58, 63, 4, 1, hex('#0b0e14')); P.set(61, 60, hex('#0b0e14')); P.rect(52, 54, 5, 1, C.ouv(.3, 0, 0));
    // orelhas: folhas altas, finas, membrana verde
    for (const [bx, by, tx, ty, wd, dark] of [[47, 54, 29, 2, 12, 0], [43, 52, 17, 10, 10, 1]]) {
      P.poly([[bx, by], [tx, ty], [tx + wd, ty + 2], [bx + wd + 4, by + 1]], (x, y) => { const v = (by - y) / (by - ty), vein = Math.abs((x - bx) + v * (bx - tx) * .9 - 1.5) % 5 < .8; return C.ear((dark ? .62 : .95) - v * .2 - (vein ? .35 : 0) + (h2(x, y, 1) - .5) * .1, x, y); });
      P.line(bx, by, tx + 1, ty + 1, C.ouv(.85, 0, 0)); P.line(bx + 1, by, tx + 4, ty + 3, C.ouv(.4, 0, 0));
    }
    // bracos muito longos pendendo para o chao
    L(38, 48, 41, 72, 2, sk(.65)); L(41, 72, 52, 98, 2, sk(.65)); for (let k = 0; k < 4; k++) P.line(52, 98, 53 + k * 2, 112 + k, C.ouv(.55, 0, 0));
    L(40, 48, 44, 70, 2, sk(.4)); L(44, 70, 58, 96, 2, sk(.4)); for (let k = 0; k < 3; k++) P.line(58, 96, 59 + k * 2, 108 + k, C.ouv(.35, 0, 0));
    { const R = P.real; for (let y = 0; y < R.h; y++) for (let x = 0; x < R.w; x++) { const c = R.get(x, y); if (c && c[1] > c[0] + 25 && c[1] > c[2] - 10) E.real.set(x, y, c); } }
  }, .3);
}
export function crowdSide(hair, cloth, pants) {
  return mk(6, 16, (P) => { P.rect(1, 0, 4, 4, hex(hair)); P.rect(2, 2, 3, 2, hex('#b0805c')); P.rect(0, 4, 6, 6, hex(cloth)); P.rect(1, 10, 2, 6, hex(pants)); P.rect(3, 10, 2, 6, hex(pants)); }, .25);
}


// ================= v3: proporcoes realistas (~7 cabecas), membros em pixel art =================
// Tabelas de pose reutilizaveis: acrescente uma entrada para ganhar um desenho novo.
export const TECO_POSES = {
  stand: { arm: 'fist' },
  menu: { arm: 'fist', far: 'menu' },
  kneel: { arm: 'lips', kneel: 1 },
};
export const LIRA_POSES = { stand: { arm: 'hold' } };
export const OUVIDOR_POSES = { bent: {} };
const _cache = {};
export function makeSprite(kind, pose) {
  const key = kind + ':' + pose; if (_cache[key]) return _cache[key];
  const f = { teco: tecoSide, lira: liraSide, ouvidor: ouvidor2 }[kind]; return (_cache[key] = f(pose));
}
// membro afunilado com sombreado em rampa (u = posicao na largura)
export function limb(P, x0, y0, x1, y1, w0, w1, R, v = .62) {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  P.poly([[x0 + nx * w0 / 2, y0 + ny * w0 / 2], [x1 + nx * w1 / 2, y1 + ny * w1 / 2], [x1 - nx * w1 / 2, y1 - ny * w1 / 2], [x0 - nx * w0 / 2, y0 - ny * w0 / 2]],
    (x, y) => { const t = Math.max(0, Math.min(1, ((x - x0) * dx + (y - y0) * dy) / (L * L))), w = w0 + (w1 - w0) * t, u = ((x - x0) * nx + (y - y0) * ny) / Math.max(.5, w); return R(v - u * .5 + (h2(x * 2 | 0, y * 2 | 0, 5) - .5) * .06, x, y); });
}
function headP(P, hx, hy, o = {}) {
  const sk = (x, y, dx, dy) => C.skin(.68 - (x - hx) * .02 - (y - hy) * .015 + (o.lit ?? 0), x, y);
  P.poly([[hx - 3.2, hy - 3.6], [hx + 1.6, hy - 4.2], [hx + 3.2, hy - 2.6], [hx + 3.4, hy - .2], [hx + 4.5, hy + 1.4], [hx + 3.5, hy + 1.9], [hx + 3.7, hy + 2.8], [hx + 3.1, hy + 4.1], [hx + .8, hy + 4.9], [hx - 2.2, hy + 4.1], [hx - 3.6, hy + 1.2]], sk);
  // cabelo preto curto espetado: calota + franja + espetos
  P.poly([[hx - 4.2, hy + 2.2], [hx - 4.6, hy - 2], [hx - 2.4, hy - 5], [hx + 1.8, hy - 5.4], [hx + 3.4, hy - 3.6], [hx + 1.6, hy - 2.7], [hx - .6, hy - 1.6], [hx - 1.6, hy + 1.2]], (x, y) => C.hair(.4 - (y - hy) * .03 + (h2(x * 2 | 0, y * 2 | 0, 3) > .85 ? .22 : 0), x, y));
  for (const [dx, h] of [[-3.5, 2], [-2, 3], [-.5, 3.4], [1, 3], [2.4, 2.2], [-4, 1.4]]) P.poly([[hx + dx - .9, hy - 4.6], [hx + dx + .2, hy - 4.8 - h], [hx + dx + 1.1, hy - 4.4]], C.hair(.5, 0, 0));
  P.rect(hx - 1.4, hy + .6, 1.4, 2, C.skin(.4, 0, 0));
  P.rect(hx + 2.1, hy - .2, 1, 1.5, INK); P.set(hx + 2.5, hy - .2, hex('#f2e8dc')); P.rect(hx + 1.4, hy - 1.6, 2.4, .6, C.hair(.2, 0, 0));
  P.rect(hx + 2.6, hy + 3, 1.4, .5, hex(o.lips ? '#6a2e26' : '#5a2a22'));
}
export function tecoSide(pose = 'stand') {
  const T = TECO_POSES[pose] || TECO_POSES.stand, kn = !!T.kneel, by = kn ? 13 : 0, hx = 22, hy = 7 + by;
  return mkk(40, 56, (P, E) => {
    const Y = y => y + by;
    // pernas
    if (!kn) {
      limb(P, 22, 31, 24, 43, 5.4, 4.4, C.pants, .38); limb(P, 24, 43, 25, 52, 4.2, 3.2, C.pants, .36); P.poly([[22.5, 51], [26.8, 51], [27.4, 53.5], [32, 54.2], [32, 56], [22, 56]], C.boot(.4, 0, 0));
      limb(P, 19.5, 31, 20.5, 43, 6, 4.8, C.pants, .7); limb(P, 20.5, 43, 20, 52, 4.6, 3.4, C.pants, .68); P.poly([[18, 51], [22.2, 51], [22.8, 53.5], [28, 54.4], [28, 56], [17.5, 56]], (x, y) => C.boot(.66 - (y - 51) * .08, x, y)); P.rect(18, 55, 10, .8, C.boot(.1, 0, 0));
    } else {
      limb(P, 17, 44, 7, 54, 5, 4, C.pants, .38); P.poly([[3, 53], [10, 53], [10, 56], [3, 56]], C.boot(.4, 0, 0));
      limb(P, 19.5, 44, 30, 46.5, 6, 5, C.pants, .7); limb(P, 30, 46.5, 30.5, 54, 4.8, 3.6, C.pants, .62); P.poly([[28.4, 53], [32.6, 53], [33.4, 54.8], [38, 55], [38, 56], [28, 56]], C.boot(.6, 0, 0));
    }
    // braco direito (longe)
    if (T.far === 'menu') { limb(P, 22, 15, 27, 20.5, 3.6, 3.2, C.shirt, .45); limb(P, 27, 20.5, 32, 21.6, 2.8, 2.4, C.skin, .45); P.ellipse(33.2, 21.8, 1.9, 1.4, C.skin(.55, 0, 0)); limb(P, 33.8, 22.2, 34.6, 26.4, 1.2, 1, C.skin, .6); limb(P, 35.2, 22, 36.2, 26.2, 1.2, 1, C.skin, .6); }
    // Espeto: cabo acima do ombro, bainha em diagonal nas costas
    P.line(17.5, Y(16), 12.5, Y(40), C.leather(.5, 0, 0)); P.line(18.3, Y(16), 13.3, Y(40), C.leather(.75, 0, 0)); P.rect(11.6, Y(39.5), 2.4, 1.6, C.brass(.8, 0, 0));
    P.rect(16.6, Y(8), 1.5, 7.5, C.leather(.7, 0, 0)); P.rect(15, Y(14.6), 4.8, .9, C.steel(.85, 0, 0)); P.rect(16.5, Y(6.8), 1.8, 1.6, C.steel(.9, 0, 0));
    // cachecol: ponta longa ao vento, atras
    for (let t = 0; t < 1; t += .02) { const x = 18.5 - Math.sin(t * 2.3) * 6.5, y = Y(12.5) + t * 17; P.rect(x, y, 2.6, 1.2, C.ruby(.62 + (t % .25 < .05 ? .14 : 0) - ((t * 40 | 0) % 7 === 0 ? .1 : 0), 0, 0)); }
    // torso: colete de couro bege, dobras e sombreado
    P.poly([[17.3, Y(14)], [25.6, Y(14)], [26.4, Y(22)], [25.8, Y(31.4)], [17, Y(31.6)], [16.6, Y(22)]], (x, y) => C.vest(.76 - (x - 17) / 9.5 * .3 - (y - Y(14)) / 17 * .1 + (((x * 1.3 + (y >> 1)) | 0) % 7 === 0 && y > Y(19) ? -.14 : 0), x, y));
    for (const [a, b, c, d] of [[18, 22, 22, 27], [20, 20, 24, 24]]) P.line(a, Y(b), c, Y(d), C.vest(.2, 0, 0));
    P.rect(17, Y(30), 9.4, 1.6, C.leather(.7, 0, 0)); P.rect(22, Y(30), 1.6, 1.6, C.brass(.9, 0, 0));
    // Brasa de Teco, cintura esquerda
    lantern(P, E, 16.4, Y(31.5), 3, 4, 1, C.glass);
    // braco esquerdo (perto)
    if (T.arm === 'fist') {
      limb(P, 20, 15.5, 22.6, 24.2, 4.2, 3.4, C.vest, .38); limb(P, 22.6, 24.2, 25.6, 19.6, 3, 2.5, C.skin, .66); P.ellipse(26.2, 18.8, 1.9, 1.7, C.skin(.8, 0, 0)); P.rect(25.4, 18.8, 2.2, .5, C.skin(.35, 0, 0));
      limb(P, 24, 13.2, 26.4, 17.2, 2, 2, C.ruby, .64); limb(P, 26.3, 20.4, 27, 26, 2, 1.8, C.ruby, .58);
    } else { // dedo nos labios
      limb(P, 20, Y(15.5), 24.2, Y(22.6), 4.2, 3.4, C.vest, .38); limb(P, 24.2, Y(22.6), 26.6, Y(16.8), 3, 2.5, C.skin, .66); P.ellipse(26.9, Y(15.6), 1.8, 1.9, C.skin(.8, 0, 0)); limb(P, 27.6, Y(14.6), 28, Y(11.6), 1.2, 1, C.skin, .8);
    }
    P.rect(hx - 1.5, Y(10.4), 3.4, 3, C.skin(.4, 0, 0));
    headP(P, hx, hy, { lips: kn });
    P.ellipse(hx - .6, Y(12.8), 4.6, 2.1, (x, y, dx, dy) => C.ruby(.64 - dy * .3 + ((x * 2 + y) % 5 < 1 ? -.1 : 0), x, y)); P.rect(hx + 2, Y(12.5), 2.6, 2.6, C.ruby(.5, 0, 0));
  });
}
export function liraSide(pose = 'stand') {
  return mkk(34, 46, (P, E) => {
    const hx = 17, hy = 7.6;
    limb(P, 15.5, 29, 15.5, 38, 4.6, 3.6, C.pants, .36); limb(P, 15.5, 38, 15, 44, 3.4, 2.8, C.pants, .34); P.poly([[13.5, 43], [17, 43], [17.6, 44.6], [22, 45], [22, 46], [13, 46]], C.boot(.4, 0, 0));
    limb(P, 18.5, 29, 18.5, 38, 5, 4, C.pants, .62); limb(P, 18.5, 38, 18.8, 44, 3.8, 3, C.pants, .6); P.poly([[16.6, 43], [20.6, 43], [21.2, 44.6], [26, 45], [26, 46], [16, 46]], (x, y) => C.boot(.62 - (y - 43) * .1, x, y));
    for (let t = 0; t <= 1; t += .04) { const x = 6 - Math.sin(t * Math.PI) * 2.4, y = 8 + t * 24; P.rect(x, y, 1, 1.2, C.wood(.65, 0, 0)); }
    rf2(P, 6, 15, 7, 11, (x, y) => C.canvas(.58 + (y < 17.5 ? .1 : 0) - (x < 6.6 ? .2 : 0) - (y > 24.5 ? .2 : 0), x, y)); P.rect(6, 19.5, 7, .7, C.leather(.5, 0, 0)); P.rect(5.6, 14.6, 8, .9, C.canvas(.2, 0, 0));
    for (let y = 12; y < 32; y++) { const x = 11 + Math.sin(y * .6) * .8; P.rect(x, y, 1.6, 1, C.braid(.7 - (y % 3 === 0 ? .25 : 0), x, y)); } P.rect(10.4, 31.5, 2.4, 1.6, hex('#8a7a46'));
    P.poly([[13, 14], [22, 14], [23.4, 29], [12.4, 29]], (x, y) => C.moss(.64 - (x - 13) / 10 * .26 + ((((x * 1.3) + (y >> 1)) | 0) % 6 === 0 ? -.13 : 0), x, y));
    P.rect(12.6, 27.6, 11, 1, C.leather(.6, 0, 0));
    limb(P, 19.5, 15.6, 24, 21, 3.4, 2.8, C.moss, .55); limb(P, 24, 21, 28, 22.6, 2.5, 2.1, C.skin, .66); P.ellipse(28.8, 22.8, 1.5, 1.3, C.skin(.8, 0, 0)); limb(P, 29.3, 22.2, 29.8, 17.4, 2, 1.8, C.ruby, .64); P.set(29.6, 16.6, C.ruby(.4, 0, 0));
    lantern(P, E, 14, 28.2, 2, 3, .6, C.glassY);
    // capuz e rosto (menor, discreto)
    P.rect(hx - 1.2, 11.4, 3, 3, C.skin(.4, 0, 0));
    P.ellipse(hx - .4, hy, 6.2, 6.2, (x, y, dx, dy) => C.moss(.72 - dx * .25 - dy * .3, x, y)); P.poly([[hx - 1, hy + 4.6], [hx + 4.4, hy + 6.4], [hx + 2, hy + 8.4], [hx - 4, hy + 6]], C.moss(.5, 0, 0));
    P.poly([[hx + .6, hy - 3.8], [hx + 3.2, hy - 3.2], [hx + 3.6, hy - .2], [hx + 4.6, hy + 1.2], [hx + 3.6, hy + 1.8], [hx + 3.6, hy + 3.4], [hx + 1, hy + 4.4], [hx - 1.4, hy + 3], [hx - 1.8, hy - 1]], (x, y) => C.skin(.7 - (y - hy) * .02 - (x - hx) * .01, x, y));
    P.rect(hx + 2.1, hy - .2, 1, 1.4, INK); P.set(hx + 2.5, hy - .2, hex('#f2e8dc')); P.rect(hx + 1.4, hy - 1.5, 2.4, .5, C.hair(.25, 0, 0)); P.rect(hx + 2.4, hy + 2.8, 1.4, .5, hex('#6a2e26'));
    P.rect(hx - .6, hy - 4.6, 4, .8, C.moss(.35, 0, 0));
  });
}
// Ouvidor: silhueta alta e magra, curvado; cabeca clara e legivel; orelhas grandes e foscas (sem emissivo), so um filete verde de rim
export function ouvidor2(pose = 'bent') {
  return mkk(64, 128, (P, E) => {
    const SK = C.ouv;
    limb(P, 34, 72, 27, 94, 3.6, 3, SK, .4); limb(P, 27, 94, 31, 121, 2.8, 2.2, SK, .4); P.rect(29, 120, 9, 2.4, SK(.25, 0, 0));
    limb(P, 30, 72, 22, 94, 3.8, 3, SK, .68); limb(P, 22, 94, 25, 121, 3, 2.3, SK, .66); P.rect(23, 120, 10, 2.6, SK(.45, 0, 0));
    P.poly([[24, 72], [35, 74], [42, 62], [46, 52], [40, 44], [30, 45], [23, 58]], (x, y) => SK(.6 - (x - 23) / 24 * .28 + ((y % 5 < 1 && x > 30 && x < 42) ? -.16 : 0), x, y));
    limb(P, 41, 46, 49, 53, 4.4, 4, SK, .66);
    // cabeca: cranio alongado, palido, sem olhos
    P.poly([[45, 48], [50, 44], [57, 46], [62, 52], [62.5, 57], [59, 62], [53, 63], [47, 58]], (x, y) => C.ouvH(.8 - (y - 44) * .018 - (x - 45) * .006 + ((x * 2 | 0) % 7 === 0 && y > 52 ? -.05 : 0), x, y));
    P.rect(53, 51, 7, .8, SK(.3, 0, 0)); P.rect(58, 58, 4.6, .7, hex('#0b0e14')); P.set(61, 54, hex('#0b0e14')); P.set(61.5, 55, hex('#0b0e14'));
    // orelhas: folhas altas, foscas, verde-acinzentado, filete claro de rim
    for (const [bx, by, tx, ty, wd, dk] of [[47, 50, 28, 3, 12, 0], [43, 49, 18, 12, 10, 1]]) {
      P.poly([[bx, by], [tx, ty], [tx + wd, ty + 3], [bx + 9, by + 2]], (x, y) => { const v = (by - y) / (by - ty), vein = Math.abs((x - bx) + v * (bx - tx) * .9 - 3) % 6 < .9; return C.earM((dk ? .3 : .55) - v * .12 - (vein ? .22 : 0) + (h2(x * 2 | 0, y * 2 | 0, 1) - .5) * .08, x, y); });
      P.line(tx + wd, ty + 3, bx + 9, by + 2, hex(dk ? '#3d6e62' : '#5a9a86')); P.line(tx, ty, tx + wd, ty + 3, hex(dk ? '#355f55' : '#4a8574'));
    }
    limb(P, 38, 48, 41, 72, 2.6, 2.2, SK, .6); limb(P, 41, 72, 52, 98, 2.2, 1.8, SK, .6); for (let k = 0; k < 4; k++) P.line(52, 98, 53 + k * 2, 112 + k, SK(.5, 0, 0));
    limb(P, 40, 48, 44, 70, 2.6, 2.2, SK, .38); limb(P, 44, 70, 58, 96, 2.2, 1.8, SK, .38); for (let k = 0; k < 3; k++) P.line(58, 96, 59 + k * 2, 108 + k, SK(.32, 0, 0));
  }, .3);
}
