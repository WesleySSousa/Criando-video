// LOGADO ep.1: fonte de pixels, icones e telas do HUD/Menu (so icones e numeros), desenhadas em canvas de baixa resolucao.
export const COL = {
  slate: '#26324a', slate2: '#1a2338', slate3: '#35456a', silver: '#cfd5de', silver2: '#8b93a2', paper: '#f4f7fb', ink: '#0c1220',
  hp: '#3ad06a', hpD: '#1f7a3c', xp: '#4a8cff', drop: '#6ac8ff', dropOff: '#34405a', gold: '#e6c26a', goldD: '#a8802a', ruby: '#e01030', warn: '#ffd24a',
  leather: '#8a5a32', leatherD: '#4a2e1b', blue: '#5ac0ff', red: '#d04040',
};
const G = {
  '0': '01110 10001 10011 10101 11001 10001 01110', '1': '00100 01100 00100 00100 00100 00100 01110', '2': '01110 10001 00001 00010 00100 01000 11111',
  '3': '11110 00001 00001 01110 00001 00001 11110', '4': '00010 00110 01010 10010 11111 00010 00010', '5': '11111 10000 11110 00001 00001 10001 01110',
  '6': '00110 01000 10000 11110 10001 10001 01110', '7': '11111 00001 00010 00100 01000 01000 01000', '8': '01110 10001 10001 01110 10001 10001 01110',
  '9': '01110 10001 10001 01111 00001 00010 01100', ',': '00000 00000 00000 00000 00110 00100 01000', '.': '00000 00000 00000 00000 00000 01100 01100',
  ':': '00000 01100 01100 00000 01100 01100 00000', '/': '00001 00010 00010 00100 01000 01000 10000', '+': '00000 00100 00100 11111 00100 00100 00000',
  '-': '00000 00000 00000 11111 00000 00000 00000', '%': '11001 11010 00010 00100 01000 01011 10011', 'R': '11110 10001 10001 11110 10100 10010 10001',
  '$': '00100 01111 10100 01110 00101 11110 00100', 'x': '00000 00000 10001 01010 00100 01010 10001', ' ': '00000 00000 00000 00000 00000 00000 00000',
};
export const textW = (s, sc = 1) => (s.length * 6 - 1) * sc;
export function ptext(g, s, x, y, col, sc = 1, shadow = null) {
  const draw = (ox, oy, c) => { g.fillStyle = c; let cx = x + ox; for (const ch of String(s)) { const gl = (G[ch] || G[' ']).split(' '); for (let j = 0; j < 7; j++) for (let i = 0; i < 5; i++) if (gl[j][i] === '1') g.fillRect(cx + i * sc, y + oy + j * sc, sc, sc); cx += 6 * sc; } };
  if (shadow) draw(sc, sc, shadow);
  draw(0, 0, col);
}
const R_ = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
function disc(g, cx, cy, r, c) { g.fillStyle = c; for (let y = -r; y <= r; y++) { const w = Math.floor(Math.sqrt(r * r - y * y + .5)); g.fillRect(cx - w, cy + y, w * 2 + 1, 1); } }
function frame(g, w, h) {
  R_(g, 0, 0, w, h, COL.silver2); R_(g, 1, 1, w - 2, h - 2, COL.silver); R_(g, 2, 2, w - 4, h - 4, COL.slate2); R_(g, 3, 3, w - 6, h - 6, COL.slate);
  R_(g, 3, 3, w - 6, 1, COL.slate3); for (const [x, y] of [[1, 1], [w - 3, 1], [1, h - 3], [w - 3, h - 3]]) R_(g, x, y, 2, 2, COL.paper);
}
// ---------- icones (centro cx,cy) ----------
export const ICON = {
  mochila(g, cx, cy) { R_(g, cx - 7, cy - 6, 14, 14, COL.leather); R_(g, cx - 7, cy - 6, 14, 1, '#b07a48'); R_(g, cx - 8, cy - 4, 1, 10, COL.leatherD); R_(g, cx + 7, cy - 4, 1, 10, COL.leatherD); R_(g, cx - 5, cy - 9, 10, 4, COL.leatherD); R_(g, cx - 4, cy - 8, 8, 2, '#6a4426'); R_(g, cx - 5, cy + 1, 10, 5, '#6a4426'); R_(g, cx - 5, cy + 1, 10, 1, '#8a5a32'); R_(g, cx - 1, cy + 2, 2, 2, COL.paper); R_(g, cx - 7, cy + 8, 14, 1, COL.leatherD); },
  mapa(g, cx, cy) { R_(g, cx - 9, cy - 7, 18, 14, COL.paper); R_(g, cx - 3, cy - 7, 1, 14, '#b4bdcc'); R_(g, cx + 3, cy - 7, 1, 14, '#b4bdcc'); for (const [x, y] of [[-7, 3], [-5, 1], [-3, -1], [-1, 1], [1, 3], [3, 1], [5, -2], [7, -4]]) R_(g, cx + x, cy + y, 2, 2, COL.red); R_(g, cx - 9, cy - 7, 18, 1, '#b4bdcc'); R_(g, cx - 9, cy + 6, 18, 1, '#9aa4b6'); },
  carteira(g, cx, cy) { disc(g, cx, cy + 2, 8, COL.leatherD); disc(g, cx, cy + 2, 7, COL.leather); disc(g, cx - 2, cy, 3, '#a8703c'); R_(g, cx - 4, cy - 7, 8, 3, COL.leatherD); R_(g, cx - 5, cy - 5, 10, 1, COL.paper); R_(g, cx - 1, cy + 1, 2, 2, COL.paper); disc(g, cx + 6, cy - 6, 3, COL.goldD); disc(g, cx + 6, cy - 6, 2, COL.gold); R_(g, cx + 5, cy - 7, 1, 1, '#fff2b0'); },
  carta(g, cx, cy, badge, blink) { R_(g, cx - 9, cy - 6, 18, 13, COL.paper); R_(g, cx - 9, cy + 6, 18, 1, '#9aa4b6'); for (let i = 0; i < 9; i++) { R_(g, cx - 9 + i, cy - 6 + i * .75, 1, 1.5, '#b4bdcc'); R_(g, cx + 8 - i, cy - 6 + i * .75, 1, 1.5, '#b4bdcc'); } R_(g, cx - 2, cy - 1, 4, 4, COL.red); R_(g, cx - 1, cy, 2, 2, '#ff8a8a');
    if (badge) { disc(g, cx + 8, cy - 7, 4.5, blink ? COL.warn : COL.red); ptext(g, String(badge), cx + 6, cy - 10, blink ? COL.ink : COL.paper, 1); } },
  sair(g, cx, cy) { R_(g, cx - 5, cy - 8, 11, 16, '#6a4a2a'); R_(g, cx - 4, cy - 7, 9, 14, '#8a6238'); R_(g, cx + 2, cy, 2, 2, COL.gold); R_(g, cx - 10, cy - 1, 7, 2, COL.paper); R_(g, cx - 5, cy - 3, 2, 6, COL.paper); R_(g, cx - 4, cy - 2, 1, 4, COL.paper); },
  gosma(g, cx, cy, s = 1) { const r = 6 * s; disc(g, cx, cy + 2 * s, r + 1, COL.silver); disc(g, cx, cy + 2 * s, r, '#2f6fb8'); disc(g, cx, cy + 2 * s - 1, r - 1.5, '#6ac0ff'); disc(g, cx - 2 * s, cy + 1 * s, 1.5 * s, '#e8f8ff'); R_(g, cx - s, cy - 6 * s, 2 * s, 3 * s, COL.silver); },
  po(g, cx, cy) { R_(g, cx - 6, cy + 2, 12, 4, '#8a60c8'); R_(g, cx - 4, cy - 1, 8, 4, '#c49aff'); R_(g, cx - 2, cy - 3, 4, 3, '#f0d8ff'); for (const [x, y] of [[-3, -6], [1, -7], [5, -3], [-6, -2]]) R_(g, cx + x, cy + y, 1, 1, '#fff'); R_(g, cx - 7, cy + 5, 14, 1, COL.silver); },
  dourada(g, cx, cy) { disc(g, cx, cy + 2, 9, COL.goldD); disc(g, cx, cy + 2, 8, '#ffd24a'); disc(g, cx, cy + 1, 6, '#fff0a0'); disc(g, cx - 3, cy - 1, 2, '#fffbe0'); R_(g, cx - 1, cy - 11, 3, 4, COL.gold); for (const [x, y] of [[-12, -6], [11, -5], [12, 6], [-11, 7]]) { R_(g, cx + x, cy + y - 2, 1, 5, '#ffe9a0'); R_(g, cx + x - 2, cy + y, 5, 1, '#ffe9a0'); } },
  moeda(g, cx, cy, r = 4) { disc(g, cx, cy, r, COL.goldD); disc(g, cx, cy, r - 1, COL.gold); R_(g, cx - 1, cy - r + 2, 1, 1, '#fff2b0'); },
  fila(g, cx, cy, n) { const w = n * 5; for (let i = 0; i < n; i++) { const x = cx - w / 2 + i * 5 + 1; disc(g, x + 1, cy - 4, 1.6, '#e8eef6'); R_(g, x - .5, cy - 2, 3, 5, '#b4bdcc'); } },
  seta(g, cx, cy, up) { const d = up ? -1 : 1; R_(g, cx - 1, cy - 4, 3, 8, COL.red); for (let i = 0; i < 4; i++) R_(g, cx - 3 + i, cy + d * (4 + i) - (up ? 0 : 0) - 0, 7 - i * 2, 1, COL.red); },
  relogio(g, cx, cy) { disc(g, cx, cy, 6, COL.silver); disc(g, cx, cy, 5, COL.slate2); R_(g, cx, cy - 4, 1, 5, COL.paper); R_(g, cx, cy, 3, 1, COL.paper); },
};
const PANEL_SIZE = { menu: [112, 96], carteira: [112, 84], drops: [112, 100], banca: [112, 100], mochila: [112, 84], cartas: [112, 100], diagrama: [112, 84] };
export const panelSize = (k) => PANEL_SIZE[k] || [112, 96];
// ---------- telas ----------
export function drawPanel(g, kind, st = {}, t = 0) {
  const [w, h] = panelSize(kind); g.imageSmoothingEnabled = false; g.clearRect(0, 0, w, h); frame(g, w, h);
  const money = st.money ?? '0,68';
  if (kind === 'menu') {
    const cells = [[0, 0, 'mochila'], [1, 0, 'mapa'], [2, 0, 'carteira'], [0, 1, 'carta'], [1, 1, 'sair']];
    const cw = 32, ch = 38;
    for (const [i, j, k] of cells) { const x = 7 + i * (cw + 2), y = 7 + j * (ch + 2); R_(g, x, y, cw, ch, COL.slate2); R_(g, x, y, cw, 1, COL.slate3); R_(g, x, y + ch - 1, cw, 1, '#10182a'); const cx = x + cw / 2, cy = y + 16;
      if (k === 'carta') ICON.carta(g, cx, cy, st.carta ?? 1, st.cartaBlink); else if (k === 'carteira') { ICON.carteira(g, cx, cy); ptext(g, money, x + (cw - textW(money)) / 2, y + 29, COL.paper); } else ICON[k](g, cx, cy); }
    R_(g, 7 + 2 * (cw + 2), 7 + ch + 2, cw, ch, '#222c42');
  } else if (kind === 'carteira') {
    ICON.moeda(g, 14, 18, 5); const s = 'R$ ' + money; ptext(g, s, 24, 12, COL.paper, 2, '#10182a');
    // barra de meta de saque (0 a 20,00)
    const frac = Math.max(0, Math.min(1, (st.meta ?? 0.68) / 20)); R_(g, 8, 34, 96, 10, '#10182a'); R_(g, 9, 35, 94, 8, '#222c42'); if (frac > 0) R_(g, 9, 35, Math.max(2, 94 * frac), 8, COL.gold);
    for (let i = 1; i < 4; i++) R_(g, 9 + i * 23.5, 35, 1, 8, '#10182a');
    ptext(g, '0', 8, 48, COL.silver); ptext(g, '20,00', 104 - textW('20,00'), 48, COL.paper);
    ICON.gosma(g, 24, 66, .9); ptext(g, 'x', 34, 62, COL.silver); ptext(g, '500', 44, 62, COL.paper, 2);
  } else if (kind === 'drops') {
    ICON.gosma(g, 24, 22, 1.6); ptext(g, st.pct ?? '65%', 42, 14, COL.paper, 3, '#10182a');
    R_(g, 8, 44, 96, 1, COL.slate3); ICON.gosma(g, 18, 58, .7); ptext(g, st.cnt ?? '1/3', 30, 54, COL.paper, 2);
    const dots = st.dots ?? [1, 0, 1, 0, 0, 1, 0, 0, 1, 0];
    for (let i = 0; i < 10; i++) { const x = 11 + i * 9.5; disc(g, x + 3, 86, 3.4, dots[i] ? COL.drop : COL.dropOff); if (dots[i]) disc(g, x + 2, 85, 1, '#e8f8ff'); }
    R_(g, 8, 76, 96, 1, COL.slate3);
  } else if (kind === 'banca') {
    // curva de preco das ultimas 24 h
    const pts = st.curve ?? [.5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5];
    R_(g, 8, 36, 96, 58, '#161e32'); for (let i = 1; i < 4; i++) R_(g, 8, 36 + i * 14.5, 96, 1, '#222c42');
    const n = pts.length; for (let i = 0; i < n; i++) { const x = 9 + i * (94 / (n - 1)), y = 90 - pts[i] * 50; R_(g, x - .5, y, 2, 94 - y, i === st.mark ? '#3a4a70' : '#243050'); R_(g, x - 1, y - 1, 3, 3, (st.red || []).includes(i) ? COL.red : COL.drop); if (i) { const px = 9 + (i - 1) * (94 / (n - 1)), py = 90 - pts[i - 1] * 50; const steps = 6; for (let k = 0; k <= steps; k++) R_(g, px + (x - px) * k / steps, py + (y - py) * k / steps, 2, 2, COL.drop); } }
    if (st.mark != null) { const mx = 9 + st.mark * (94 / (n - 1)); R_(g, mx, 36, 1, 58, COL.warn); disc(g, mx, 90 - pts[st.mark] * 50, 3, COL.warn); }
    ICON.gosma(g, 14, 17, .9); ptext(g, st.price ?? '0,04', 26, 10, COL.paper, 3, '#10182a');
    if (st.arrow) ICON.seta(g, 84, 18, false);
    ICON.fila(g, 96, 24, st.fila ?? 2);
    if (st.fila > 3) { ICON.fila(g, 96, 33, 4); }
  } else if (kind === 'mochila') {
    for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) { const x = 8 + i * 24, y = 8 + j * 26; R_(g, x, y, 22, 24, COL.slate2); R_(g, x, y, 22, 1, COL.slate3); }
    if (st.gosma) { ICON.gosma(g, 19, 20, .9); ptext(g, String(st.gosma), 20, 29, COL.paper); }
    if (st.po) { ICON.po(g, 43, 20); ptext(g, String(st.po), 44, 29, COL.paper); }
    if (st.tag) { R_(g, 8, 62, 96, 15, COL.slate2); ICON.moeda(g, 16, 70, 3); ptext(g, st.tag, 24, 66, COL.paper, 1); if (st.tag2) { ICON.gosma(g, 66, 69, .45); ptext(g, st.tag2, 74, 66, COL.silver); } }
  } else if (kind === 'cartas') {
    R_(g, 8, 8, 96, 84, COL.slate2); R_(g, 10, 10, 92, 80, '#ece4d0'); R_(g, 10, 10, 92, 2, '#d4c9aa');
    ICON.dourada(g, 32, 38); ptext(g, 'R$ 50,00', 48, 22, '#2a2010', 2); R_(g, 46, 40, 52, 1, '#b4a888');
    ICON.relogio(g, 22, 72); ptext(g, st.deadline ?? '08:00', 32, 68, '#2a2010', 2);
    ICON.carta(g, 86, 74, null);
  } else if (kind === 'diagrama') {
    R_(g, 8, 8, 96, 68, '#161e32');
    // galho em arco e setas de velocidade (curta na mao, longa na ponta)
    for (let i = 0; i <= 30; i++) { const a = -1.3 + i / 30 * 1.5, x = 22 + Math.cos(a) * 54, y = 62 + Math.sin(a) * 54; R_(g, x, y, 3, 3, '#b8935a'); }
    disc(g, 22, 62, 4, '#e0b090'); R_(g, 24, 56, 9, 2, COL.drop); R_(g, 31, 54, 2, 6, COL.drop);
    R_(g, 72, 18, 2, 28, COL.warn); R_(g, 68, 20, 10, 2, COL.warn); R_(g, 70, 16, 6, 2, COL.warn);
    R_(g, 76, 24, 20, 2, COL.warn); R_(g, 94, 21, 2, 8, COL.warn); R_(g, 90, 22, 2, 6, COL.warn);
  }
}
// ---------- HUD de tela (canto superior esquerdo) ----------
export function drawHUD(g, s) {
  g.imageSmoothingEnabled = false; g.clearRect(0, 0, 150, 20);
  disc(g, 9, 9, 8, COL.silver); disc(g, 9, 9, 7, COL.slate2); ptext(g, String(s.lvl ?? 1), 9 - (String(s.lvl).length * 6 - 1) / 2, 6, COL.paper);
  const hp = s.hp ?? 40, hm = s.hpMax ?? 40;
  R_(g, 20, 1, 78, 10, COL.silver2); R_(g, 21, 2, 76, 8, '#10182a'); R_(g, 21, 2, 76 * Math.max(0, hp) / hm, 8, COL.hp); R_(g, 21, 2, 76 * Math.max(0, hp) / hm, 2, '#7af0a0');
  ptext(g, hp + '/' + hm, 24, 3, COL.paper, 1, '#0a3a1c');
  R_(g, 20, 13, 78, 3, '#10182a'); R_(g, 21, 14, 76 * (s.xp ?? 0) / (s.xpMax ?? 30), 1, COL.xp);
  ptext(g, s.clock ?? '08:12', 104, 3, COL.paper, 1, '#10182a'); disc(g, 144, 6, 2, COL.silver);
}
export function drawChip(g, kind, s) {
  g.imageSmoothingEnabled = false; g.clearRect(0, 0, 70, 16); R_(g, 0, 0, 70, 14, COL.silver2); R_(g, 1, 1, 68, 12, '#10182a');
  if (kind === 'cron') { ICON.relogio(g, 9, 7); ptext(g, s, 19, 3, COL.paper); }
  if (kind === 'cnt') { ICON.gosma(g, 9, 7, .5); ptext(g, s, 19, 3, COL.paper); }
  if (kind === 'bag') { ICON.mochila(g, 9, 7); ptext(g, s, 22, 3, COL.paper); }
}
// mapa (tela cheia, vista de cima): 108x192 px
export function drawMap(g, s = {}) {
  const W = 108, H = 192; g.imageSmoothingEnabled = false;
  R_(g, 0, 0, W, H, '#1a1640');
  // terra
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const n = Math.sin(x * .21 + y * .13) + Math.sin(x * .07 - y * .19); const land = (y > 40 && y < 170 && x > 8 && x < 100) ? n + 1.4 - Math.abs(x - 54) / 60 : -1; if (land > 0) { R_(g, x, y, 1, 1, land > 1.1 ? '#3a7a62' : land > .5 ? '#2f6a56' : '#265a4a'); } else if ((x + y) % 7 === 0) R_(g, x, y, 1, 1, '#241c52'); }
  // Porto Manso (cidade, norte)
  R_(g, 38, 52, 32, 20, '#8a7a9a'); for (let i = 0; i < 5; i++) { R_(g, 40 + i * 6, 54 + (i % 2) * 5, 5, 8, '#c8b8d8'); R_(g, 40 + i * 6, 52 + (i % 2) * 5, 5, 2, '#6a4a7a'); }
  // Campina Mansa (sul): campo claro
  disc(g, 46, 124, 24, '#4aa070'); disc(g, 46, 124, 22, '#58b47e'); for (const [x, y] of [[36, 114], [52, 118], [42, 132], [58, 130], [30, 126]]) { R_(g, x, y, 3, 2, '#9ae0ff'); }
  // Caverna do Brejo (leste)
  R_(g, 78, 96, 18, 14, '#1c2a2a'); R_(g, 82, 100, 10, 8, '#0a1212'); R_(g, 84, 102, 6, 4, '#ffd24a');
  // trilhas
  for (let i = 0; i < 24; i++) R_(g, 54 + Math.sin(i * .4) * 2, 72 + i * 2, 2, 2, '#c8b890');
  for (let i = 0; i < 22; i++) R_(g, 62 + i * 1.4, 126 - i * 1.5, 2, 2, '#c8b890');
  // selo de nivel recomendado "5" (caverna) e selo do Teco "3"
  disc(g, 87, 90, 6, COL.silver); disc(g, 87, 90, 5, COL.slate2); ptext(g, '5', 85, 87, COL.paper);
  // lua sobre a caverna
  disc(g, 100, 80, 4, '#e8e0ff'); disc(g, 102, 79, 3.4, '#1a1640');
  // ponto rubi (Teco) na Campina, selo "3"
  disc(g, 46, 124, 3, '#fff'); disc(g, 46, 124, 2, COL.ruby); disc(g, 46, 112, 6, COL.silver); disc(g, 46, 112, 5, COL.slate2); ptext(g, String(s.lvl ?? 3), 44, 109, COL.paper);
  // moldura
  R_(g, 0, 0, W, 2, COL.silver2); R_(g, 0, H - 2, W, 2, COL.silver2); R_(g, 0, 0, 2, H, COL.silver2); R_(g, W - 2, 0, 2, H, COL.silver2);
}
