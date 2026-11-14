"""LOGADO ep01: trilha, efeitos, ambiente e mix final (sem gerar voz; usa voz/l01..l27.mp3).
Uso (da raiz da biblioteca): /root/lemo-opuscar/.venv/bin/python build_audio.py  -> audio/mix.wav
Entradas: audio/vo_times.json, filme/tempos.json. Saidas: audio/mix.wav (+ stems em $STEMS se definido)."""
import sys, os, json, subprocess
sys.path.insert(0, '/root/lemo-opuscar')
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt
from core.audio import sampler as S, pluck as P
from core.audio import sfx as X
from core.audio.sfx import SR, add, t_, env_exp, bp, lp, hp, noise

R = '/home/user/Criando-video/serie/ep01/'
VO = json.load(open(R + 'audio/vo_times.json'))
TM = json.load(open(R + 'filme/tempos.json'))
T = TM['dur']; N = int(round(T * SR))
rng = np.random.default_rng(11); X._rng = np.random.default_rng(5)
line = {v['id']: v for v in VO['lines']}
shot = {p['id']: p for p in TM['planos']}
def st(i): return shot[i]['ini']
def en(i): return shot[i]['fim']
def stereo(): return np.zeros((N, 2), np.float32)
def mono(d): return np.zeros(int(round(d * SR)), np.float32)

# ---------------------------------------------------------------- sintese basica
def midi(p): return S.midi(p)
def hz(p): return S.hz(p)
def pulse(f, d, duty=.25, a=.004, dec=.18, sus=.0, rel=.05):
    tt = t_(d + rel); ph = (tt * f) % 1.0
    w = np.where(ph < duty, 1.0, -1.0)
    # leve anti-alias por low-pass
    e = np.where(tt < d, np.maximum(sus, np.exp(-tt / dec)), 0) * np.minimum(1, tt / a)
    e = e * np.where(tt > d, np.exp(-(tt - d) / (rel / 3)), 1)
    return lp(w * e, 5200, 2).astype(np.float32)
def tri(f, d, a=.01, dec=.3, rel=.08):
    tt = t_(d + rel); ph = (tt * f) % 1.0
    w = 4 * np.abs(ph - .5) - 1
    e = np.minimum(1, tt / a) * np.exp(-tt / dec) * np.where(tt > d, np.exp(-(tt - d) / (rel / 3)), 1)
    return (w * e).astype(np.float32)
def sine(f, d, dec=.3, a=.003):
    tt = t_(d); return (np.sin(2 * np.pi * f * tt) * np.exp(-tt / dec) * np.minimum(1, tt / a)).astype(np.float32)
def fade(x, a=.01, b=.03):
    x = x.copy(); na, nb = int(a * SR), int(b * SR)
    if na: x[:na] *= np.linspace(0, 1, na)
    if nb: x[-nb:] *= np.linspace(1, 0, nb)
    return x
def stereo_reverb(buf, size=.4, mix=.2): return S.room(buf, size=size, mix=mix).astype(np.float32)
def cut_buf(buf, t0, t1, f=.05):
    """silencia buf fora de [t0,t1] com fades curtos"""
    g = np.zeros(len(buf), np.float32); a, b = int(t0 * SR), int(t1 * SR)
    g[a:b] = 1
    k = int(f * SR); g = np.convolve(g, np.ones(k) / k, 'same').astype(np.float32)
    return buf * g[:, None]

# ---------------------------------------------------------------- EFEITOS
def coin(p=1.0, v=1.0):
    d = 1.0; tt = t_(d); x = np.zeros(len(tt))
    for f, a, tau, dl in [(1318 * p, 1, .22, 0), (1760 * p, .9, .35, .07), (3520 * p, .25, .1, .07), (2.76 * 1318 * p, .12, .06, 0)]:
        s = int(dl * SR); x[s:] += a * np.sin(2 * np.pi * f * tt[:len(tt) - s]) * np.exp(-tt[:len(tt) - s] / tau)
    return (X.norm(x) * v).astype(np.float32)
def squish(v=1.0, pitch=1.0):
    d = .22; tt = t_(d)
    f = (520 - 330 * tt / d) * pitch
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(d, .07) * .6 + bp(noise(d), 300, 1600) * env_exp(d, .05) * .6
    return (X.norm(x) * v).astype(np.float32)
def boing(v=1.0):
    d = .3; tt = t_(d); f = 220 + 380 * np.sin(np.pi * np.clip(tt / .22, 0, 1)) ** 1
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(d, .12) + lp(noise(d), 1200) * env_exp(d, .02) * .3
    return (X.norm(x) * v).astype(np.float32)
def splat(v=1.0):
    d = .7; x = np.zeros(int(d * SR))
    tt = t_(d)
    x += bp(noise(d), 200, 2800) * env_exp(d, .05) * .9
    x += np.sin(2 * np.pi * np.cumsum(140 - 90 * np.clip(tt / .2, 0, 1)) / SR) * env_exp(d, .09)
    for dl, f0 in [(.08, 500), (.16, 650), (.27, 800), (.36, 560)]:
        n = int(.12 * SR); q = t_(.12); f = f0 + 900 * q / .12
        pop = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-q / .03) * .35
        s = int(dl * SR); x[s:s + n] += pop[:len(x[s:s + n])]
    return (X.norm(x) * v).astype(np.float32)
def wood(v=1.0, bright=.5, f=200):
    """golpe de galho (madeira). bright maior = golpe de ponta, mais seco"""
    d = .28; tt = t_(d)
    x = hp(noise(d), 900 + 1800 * bright) * env_exp(d, .004 + .003 * (1 - bright)) * (.8 + bright * .6)
    x += np.sin(2 * np.pi * np.cumsum(f * (1 - .4 * tt / d) * (1 + .5 * bright)) / SR) * env_exp(d, .05) * .8
    for fm, a, tau in [(f * 2.1, .5, .05), (f * 3.9, .35, .035), (f * 6.2, .2, .02)]:
        x += np.sin(2 * np.pi * fm * (1 + .5 * bright) * tt) * a * env_exp(d, tau)
    return (X.norm(x) * v).astype(np.float32)
def thud_gel(v=1.0):
    d = .25; tt = t_(d)
    x = np.sin(2 * np.pi * np.cumsum(150 - 80 * tt / d) / SR) * env_exp(d, .07) + lp(noise(d), 700) * env_exp(d, .03) * .6
    return (X.norm(x) * v).astype(np.float32)
def whiff(v=1.0, d=.28): return (X.whoosh(d, 1) * v).astype(np.float32)
def heal(v=1.0):
    d = .55; x = np.zeros(int(d * SR))
    for k, f in enumerate([784, 1047, 1568]):
        s = int(k * .07 * SR); y = sine(f, d - k * .07, .18, .01) * (1 - .15 * k)
        x[s:s + len(y)] += y[:len(x) - s]
    x += bp(noise(d), 4000, 9000) * env_exp(d, .08) * .06
    return (X.norm(x) * v).astype(np.float32)
def pickup(v=1.0): return (X.norm(np.concatenate([sine(1175, .12, .08), sine(1760, .5, .2)]) + 0) * v).astype(np.float32)
def blip(f=2000, v=1.0, d=.03):
    return (sine(f, d + .02, d, .001) * v).astype(np.float32)
def uiclick(v=1.0): return (X.click(1.2, 1) * v).astype(np.float32)
def uitick(v=1.0): return (X.click(1.8, 1) * v * .6).astype(np.float32)
def levelup(v=1.0):
    d = 1.6; x = np.zeros(int(d * SR))
    for k, f in enumerate([1047, 1319, 1568, 2093]):
        s = int(k * .09 * SR); tt = t_(d - k * .09)
        y = (np.sin(2 * np.pi * f * tt) + .3 * np.sin(2 * np.pi * f * 2.76 * tt) * np.exp(-tt / .1)) * np.exp(-tt / .5)
        x[s:s + len(y)] += y
    return (X.norm(x) * v).astype(np.float32)
def bell(f=1046, d=2.0, v=1.0, tau=.9):
    tt = t_(d); x = np.zeros(len(tt))
    for r, a, k in [(1, 1, 1), (2.0, .4, .6), (2.76, .5, .45), (5.4, .25, .25), (1.5, .15, .8)]:
        x += a * np.sin(2 * np.pi * f * r * tt) * np.exp(-tt / (tau * k))
    return (X.norm(x) * np.minimum(1, tt / .002) * v).astype(np.float32)
def sino_carta(v=1.0):
    a = bell(1319, 1.6, 1, .7); b = bell(1760, 1.8, 1, .8); x = mono(1.8)
    x[:len(a)] += a; s = int(.16 * SR); x[s:s + len(b)] += b[:len(x) - s]
    return (X.norm(x) * v).astype(np.float32)
def crack(v=1.0):
    d = 1.0; x = np.zeros(int(d * SR))
    tt = t_(d)
    x += bp(noise(d), 1200, 7000) * env_exp(d, .006) * 1.0
    x += np.sin(2 * np.pi * 380 * tt) * env_exp(d, .03) * .4
    s = int(.07 * SR); y = bp(noise(.5), 900, 5000) * env_exp(.5, .01) * .7
    x[s:s + len(y)] += y
    s = int(.13 * SR); f = 900 - 650 * np.clip(t_(.4) / .4, 0, 1)
    cr = bp(noise(.4), 400, 2500) * (np.abs(np.sin(2 * np.pi * 38 * t_(.4))) ** 2) * env_exp(.4, .15) * .35
    x[s:s + len(cr)] += cr
    x += np.sin(2 * np.pi * 70 * tt) * env_exp(d, .12) * .5
    return (X.norm(x) * v).astype(np.float32)
def clink(f=3300, v=1.0, d=.5):
    tt = t_(d); x = (np.sin(2 * np.pi * f * tt) * np.exp(-tt / .12) + .6 * np.sin(2 * np.pi * f * 1.52 * tt) * np.exp(-tt / .07) + hp(noise(d), 3000) * env_exp(d, .004) * .6)
    return (X.norm(x) * v).astype(np.float32)
def cloth(d=.35, v=1.0):
    tt = t_(d); return (X.norm(bp(noise(d), 600, 4500) * np.sin(np.pi * tt / d) ** 2) * v).astype(np.float32)
def padslap(v=1.0, d=.09):
    """chinelo no piso"""
    tt = t_(d); return (X.norm(lp(noise(d), 1800) * env_exp(d, .012) + np.sin(2 * np.pi * 180 * tt) * env_exp(d, .02) * .5) * v).astype(np.float32)
def stonestep(v=1.0):
    d = .18; tt = t_(d)
    return (X.norm(hp(noise(d), 700) * env_exp(d, .015) + np.sin(2 * np.pi * 130 * tt) * env_exp(d, .03) * .6) * v).astype(np.float32)
def visor_on(v=1.0):
    d = 1.4; tt = t_(d)
    f = 110 + 90 * np.clip(tt / 1.2, 0, 1); hum = np.sin(2 * np.pi * np.cumsum(f) / SR) * (np.clip(tt / 1.2, 0, 1) ** 1.5) * np.exp(-np.clip(tt - 1.1, 0, None) / .08)
    hum += .4 * np.sin(2 * np.pi * np.cumsum(f * 7.5) / SR) * np.clip(tt / 1.2, 0, 1) ** 2
    hum = hum * (.3 + .1 * np.sin(2 * np.pi * 14 * tt))
    return (X.norm(hum) * v).astype(np.float32)
def login(v=1.0):
    x = np.zeros(int(1.4 * SR))
    for k, f in enumerate([523, 659, 784, 1047]):
        y = sine(f, 1.0, .35, .004) * (.7 + .1 * k); s = int(k * .11 * SR); x[s:s + len(y)] += y[:len(x) - s]
    return (X.norm(x) * v).astype(np.float32)
def riser(d=2.0, v=1.0, lo=300, hi=6000):
    tt = t_(d); n = noise(d); out = np.zeros(len(n))
    seg = 24; L = len(n) // seg
    for k in range(seg):
        f = lo * (hi / lo) ** (k / seg); out[k * L:(k + 1) * L] = bp(n[k * L:(k + 1) * L], f * .8, f * 1.3, 2)
    return (X.norm(out * (tt / d) ** 2) * v).astype(np.float32)
def shimmer(d=2.0, v=1.0):
    tt = t_(d); x = np.zeros(len(tt))
    for f in [1568, 2093, 2637, 3136, 4186]:
        x += np.sin(2 * np.pi * f * tt + rng.uniform(0, 6)) * (.5 + .5 * np.sin(2 * np.pi * rng.uniform(3, 7) * tt)) ** 2
    return (X.norm(x * np.sin(np.pi * tt / d) ** 2) * v).astype(np.float32)
def whistle(notes, v=1.0):
    """notes = [(freq, dur)] assobio suave"""
    parts = []
    for f, d in notes:
        tt = t_(d); vib = 1 + .006 * np.sin(2 * np.pi * 6 * tt) * np.minimum(1, tt / .15)
        ph = np.cumsum(np.full(len(tt), f) * vib) / SR
        e = np.minimum(1, tt / .03) * np.minimum(1, (d - tt) / .05)
        parts.append((np.sin(2 * np.pi * ph) + .05 * np.sin(4 * np.pi * ph)) * e + bp(noise(d), 2500, 5000) * .03 * e)
    return (X.norm(np.concatenate(parts)) * v).astype(np.float32)

# ---------------------------------------------------------------- AMBIENTES
def wind_bed(d, v=1.0, bright=1.0, rate=.13):
    n = noise(d); w = bp(n, 150, 700 * bright, 2) + .5 * bp(n, 700, 1800 * bright, 2) * .4
    tt = t_(d); m = .55 + .45 * np.sin(2 * np.pi * rate * tt + 1) * np.sin(2 * np.pi * rate * .37 * tt + 2)
    return (X.norm(w * m) * v).astype(np.float32)
def birds_bed(d, density=.8, v=1.0, seed=0):
    r = np.random.default_rng(seed); x = mono(d); tt = 0.0
    while tt < d - .3:
        tt += r.exponential(1.0 / density)
        k = r.integers(2, 5); f0 = r.uniform(2400, 4800); base = r.uniform(.07, .12)
        for j in range(k):
            q = t_(.09); f = f0 * (1 + .25 * np.sin(np.pi * q / .09) * r.choice([-1, 1]))
            ch = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * q / .09) ** 2 * r.uniform(.5, 1)
            s = int((tt + j * base) * SR)
            if s + len(ch) < len(x): x[s:s + len(ch)] += ch
    return (X.norm(x) * v).astype(np.float32)
def crickets_bed(d, v=1.0):
    tt = t_(d); x = np.zeros(len(tt))
    for f, ph, r_ in [(4300, 0, 1), (4700, 1.3, .8), (3900, 2.1, .6)]:
        gate = (np.sin(2 * np.pi * (2.2 + r_ * .3) * tt + ph) > .2) * (np.sin(2 * np.pi * 27 * tt) > 0)
        x += np.sin(2 * np.pi * f * tt) * lp(gate.astype(float), 200, 1) * .5
    return (X.norm(x) * v).astype(np.float32)
def clock_ticks(d, v=1.0, period=1.0):
    x = mono(d); k = 0; t0 = 0.0
    while t0 < d - .1:
        c = X.hp(noise(.03), 2500 + 800 * (k % 2)) * env_exp(.03, .004) + np.sin(2 * np.pi * (1500 + 400 * (k % 2)) * t_(.03)) * env_exp(.03, .006) * .4
        s = int(t0 * SR); x[s:s + len(c)] += c[:len(x) - s] * (1 if k % 2 == 0 else .75); t0 += period; k += 1
    return (X.norm(x) * v).astype(np.float32)
def room_tone(d, v=1.0):
    n = X.brown(d); tt = t_(d)
    return (X.norm(lp(n, 500) + .4 * np.sin(2 * np.pi * 50 * tt) * .2 + .08 * lp(noise(d), 3000)) * v).astype(np.float32)
def murmur(d, v=1.0, seed=2):
    """murmurio de vozes sem palavras: pulso glotal filtrado em formantes, amplitude silabica"""
    r = np.random.default_rng(seed); out = np.zeros(int(d * SR)); tt = t_(d)
    for spk in range(3):
        f0 = r.uniform(95, 210); ph = (tt * f0 * (1 + .03 * np.sin(2 * np.pi * r.uniform(.3, .8) * tt))) % 1
        src = (1 - ph) ** 2 - .3
        form = bp(src, r.uniform(500, 800), r.uniform(1100, 1500), 2) + .6 * bp(src, 2200, 2800, 2)
        syl = np.clip(np.sin(2 * np.pi * r.uniform(2.5, 4.2) * tt + r.uniform(0, 6)) + np.sin(2 * np.pi * r.uniform(.4, 1.1) * tt + r.uniform(0, 6)) - .4, 0, 1)
        out += form * syl
    return (X.norm(lp(out, 2500)) * v).astype(np.float32)
def kitchen_pot(d, v=1.0):
    n = noise(d); tt = t_(d)
    burble = bp(n, 300, 1400, 2) * (np.clip(np.sin(2 * np.pi * 4.5 * tt) + np.sin(2 * np.pi * 7.3 * tt), 0, 2)) * .7
    steam = hp(n, 4000) * .15 * (.6 + .4 * np.sin(2 * np.pi * .4 * tt))
    return (X.norm(burble + steam) * v).astype(np.float32)

# ---------------------------------------------------------------- CAMADAS
sfxb, ambb, musb = stereo(), stereo(), stereo()
def A(buf, x, t, g=1.0, pan=0.0): add(buf, x.astype(np.float32), t, g, pan)

# ----- chaves de tempo (derivadas dos tempos.json)
tA0 = st('7'); tCut1 = en('11'); tA2 = st('13'); tReal2 = st('22'); tB0 = st('23'); tCrack = st('26'); tLapse = st('27'); tFight = st('28')
tCalm = en('28'); tCarta = [e for e in shot['33']['eventos']][0]['t']; tEnd = T
S24, S21 = line['l24']['t'], line['l21']['t']

# ================================================================ EFEITOS (timeline)
# --- plano 1 / 2
A(sfxb, coin(1.0, .5), .9, .35, .2)
A(sfxb, coin(.9), st('2') + .45, .5, -.3); A(sfxb, coin(1.05), st('2') + .75, .5, .2); A(sfxb, coin(.95), st('2') + 1.05, .45, .0)
for k in range(5): A(sfxb, coin(1 + .08 * k, .6), st('2') + 1.3 + .1 * k, .3, .1)
A(sfxb, bell(1568, 1.5, .5, .5), st('2') + 1.8, .4)
A(sfxb, riser(.6, .5, 800, 4000), st('2') + .05, .25)       # som do titulo
A(sfxb, bell(1319, 2.0, .6, .8), st('2') + .15, .4, .0)

# --- casa (planos 3-6)
h0, h1 = st('3'), st('6') + 0.0
A(sfxb, clink(3000, .5), st('3') + .5, .35, -.4)               # caneca chega na mesa
A(sfxb, cloth(.3, .5), st('4') + .35, .4)                       # Teco pega o Visor
A(sfxb, X.clack(.8, .6) if False else uiclick(.7), st('4') + .38, .5)
A(sfxb, clink(2600, .7), st('4') + .9, .5, .3)                 # caneca na pia
for k, t in enumerate([st('4') + 1.9, st('4') + 2.4, st('4') + 2.9]): A(sfxb, padslap(.6), t, .45 - .08 * k, .1 * k)
A(sfxb, cloth(.3, .4), st('5') + .0, .3)
A(sfxb, cloth(.35, .6), st('6') + .15, .45, -.1)                # deita
A(sfxb, uiclick(1), st('6') + .6, .6)
A(sfxb, visor_on(.8), st('6') + .7, .5)
# --- jogo
A(sfxb, login(.6), st('7') + .08, .45)
A(sfxb, boing(.7), st('8') + .4, .55, .3)                      # slime pula
A(sfxb, uitick(.8), st('8') + .55, .3)                          # cronometro inicia
A(sfxb, whiff(.5, .3), st('8') + 1.9, .4)                       # galho levantado
# luta 1 (eventos de tempos.json)
def ev(i, k): return shot[i]['eventos'][k]['t']
A(sfxb, wood(1, .3), ev('9', 0), .85); A(sfxb, squish(.6), ev('9', 0) + .02, .45)
A(sfxb, wood(.9, .3, 190), ev('9', 1), .8); A(sfxb, squish(.5), ev('9', 1) + .02, .4)
A(sfxb, whiff(.6, .22), ev('9', 2), .5); A(sfxb, heal(.7), ev('9', 3), .5)
A(sfxb, wood(1, .3, 170), ev('10', 0), .9); A(sfxb, thud_gel(.9), ev('10', 1), .8, .3)
A(sfxb, wood(.95, .3), ev('10', 2), .85)
A(sfxb, whiff(.6, .22), ev('11', 0), .5); A(sfxb, heal(.7), ev('11', 1), .5); A(sfxb, thud_gel(.9), ev('11', 2), .85, .3)
# respiracao ofegante (plano 11)
for k, dt in enumerate([.9, 1.5]):
    br = lp(bp(noise(.4), 400, 2500), 2200) * np.sin(np.pi * t_(.4) / .4) ** 2
    A(sfxb, (X.norm(br) * .5).astype(np.float32), st('11') + dt, .35, -.2)
A(sfxb, riser(en('11') - st('11') - .1, .8, 200, 2500), st('11') + .05, .35)     # silencio crescendo
A(sfxb, wood(1, .35), ev('12', 0), .85); A(sfxb, wood(1, .35, 210), ev('12', 1), .85); A(sfxb, wood(1, .35, 180), ev('12', 2), .85)
A(sfxb, splat(1), ev('12', 3), .95); A(sfxb, boing(.6), ev('12', 4), .5, .2)
A(sfxb, pickup(.7), st('13') + .55, .5)                          # Teco pega a gosma
A(sfxb, coin(1.2, .4), st('13') + .15, .3)                       # etiqueta flutua
A(sfxb, uiclick(1), st('14') + .1, .55); A(sfxb, uitick(1), st('14') + .9, .4)
A(sfxb, uiclick(1), st('15') + .02, .5); A(sfxb, bell(1760, .8, .5, .3), ev('15', 0) + .08, .35)
A(sfxb, splat(.7), st('16') + 1.3, .6); A(sfxb, wood(1, .4), st('16') + 1.22, .7); A(sfxb, uitick(1), st('16') + 1.7, .4)
# grafico de 10 pontos (4 azuis acesos)
on = [1, 0, 0, 1, 0, 1, 0, 0, 1, 0]
for k in range(10):
    t = st('17') + .15 + k * .2
    A(sfxb, bell(1568 + 120 * (k % 3), .5, .6, .15) if on[k] else uitick(.9), t, .4 if on[k] else .35, -.4 + .09 * k)
# montagem + nivel 2
for k, dt in enumerate([.12, .45, .78, 1.1]): A(sfxb, wood(1, .4, 200 + 15 * k), st('18') + dt, .75); A(sfxb, squish(.4), st('18') + dt + .03, .3)
A(sfxb, levelup(.9), st('18') + 1.2, .55)
# Banca
for k, dt in enumerate([.2, .75, 1.3, 1.85]): A(sfxb, X.pop(.0) if False else stonestep(.7), st('19') + dt, .45 - .05 * k, .1 * k)
A(sfxb, uiclick(1), st('20') + .7, .5); A(sfxb, uitick(1), st('20') + 1.7, .35); A(sfxb, uitick(1), st('20') + 2.1, .3)
for k in range(11): A(sfxb, coin(.9 + rng.uniform(0, .35), .7), st('21') + .45 + k * .13 + rng.uniform(0, .05), .38, rng.uniform(-.4, .4))
for k in range(9): A(sfxb, uitick(1), st('21') + 1.0 + k * .1 + k * k * .006, .22)
A(sfxb, bell(1319, 1.4, .8, .5), st('21') + 2.25, .45); A(sfxb, bell(1760, 1.6, .7, .5), st('21') + 2.35, .35)
# plano 22 (casa)
A(sfxb, clink(2400, .6, .4), st('22') + .35, .45, .3)
for k, t in enumerate([st('22') + .7, st('22') + 1.15, st('22') + 1.6]): A(sfxb, padslap(.4), t, .3 - .06 * k, .4)
# 23-24 treino, assobio
A(sfxb, whistle([(784, .22), (988, .22), (880, .35), (0.1, .0001)][:3] , .7), st('23') + .25, .22, -.1)
A(sfxb, whistle([(659, .2), (784, .2), (880, .2), (784, .45)], .7), st('24') + .15, .22, .1)
for t in [st('23') + .9, st('24') + .75, st('24') + 1.25]: A(sfxb, whiff(.6, .3), t, .45)
# 25
A(sfxb, cloth(.2, .4), st('25a') + .3, .3)
for k, dt in enumerate([.2, .55, .9, 1.3]): A(sfxb, wood(1, .8, 230 + 20 * k), st('25b') + dt, .9); A(sfxb, squish(.4), st('25b') + dt + .02, .3)
A(sfxb, splat(.9), st('25b') + 1.55, .8)
# 26 rachadura
A(sfxb, crack(1), tCrack + .4, 1.0)
# 27 passagem do dia
A(sfxb, riser(en('27') - tLapse, .9, 250, 7000), tLapse, .45)
tk = clock_ticks(en('27') - tLapse - .1, .5, .22); A(sfxb, tk, tLapse + .05, .25)
A(sfxb, shimmer(1.8, .6), tLapse + 1.0, .25)
# 28 ultimo slime, nivel 3
for k, dt in enumerate([.45, .85, 1.25, 1.65]): A(sfxb, wood(1, .8, 230 + 20 * k), tFight + dt, .85); A(sfxb, squish(.4), tFight + dt + .02, .3)
A(sfxb, splat(1), tFight + 2.0, .85)
A(sfxb, levelup(1), S21 + .2, .75); A(sfxb, shimmer(1.6, .6), S21 + .35, .3); A(sfxb, bell(2093, 1.5, .5, .5), S21 + .5, .3)
# 29-32 menus
A(sfxb, uiclick(1), st('29') + .5, .5); A(sfxb, uitick(1), st('29') + 1.2, .3)
A(sfxb, uiclick(1), st('30') + .15, .5); A(sfxb, uiclick(.8), st('30') + 1.2, .4)
for k in range(6): A(sfxb, coin(.95 + .05 * (k % 3), .5), st('31') + .35 + k * .17, .3, .2 * (k % 3 - 1))
A(sfxb, uiclick(1), st('32') + .35, .5); A(sfxb, coin(1.1, .5), st('32') + .7, .3)
# 33 Carta: pano do punho, sino de carta
A(sfxb, cloth(.35, .5), st('33') + .3, .4)
A(sfxb, sino_carta(1), tCarta, .7)
A(sfxb, sino_carta(.8), st('34') + .15, .5); A(sfxb, shimmer(2.0, .6), st('34') + .3, .25)
A(sfxb, uitick(1), shot['34']['eventos'][0]['t'], .4)
A(sfxb, bell_low(1) if False else bell(110, 4.0, 1, 1.4), st('35') + .45, .65)
A(sfxb, X.rumble(2.0, .4), st('35') + .3, .35)
A(sfxb, uiclick(.8), st('37') + .3, .4)   # fecha o Menu
A(sfxb, uiclick(.8), st('39') + .35, .4)  # reabre o Menu
A(sfxb, coin(1.0, .4), st('39') + .6, .2)

# ================================================================ AMBIENTES
def bed(buf, x, t0, t1, g=1.0, f=.3, pan=0.0, fb=None):
    n = int((t1 - t0) * SR); y = x[:n].astype(np.float32).copy(); y = fade(y, f, f if fb is None else fb)
    add(buf, y, t0, g, pan)
W = wind_bed(T + 1, 1.0, 1.0)
def wind_env(buf, g, t0, t1, f=.6, pan=0, fb=None): bed(buf, W[int(t0 * SR):], t0, t1, g, f, pan, fb)
# vento do jogo (atravessa todo jogo; entra em plano 1 e fica ate o fim para fechar o loop)
wind_env(ambb, .28, 0, st('2') + .3, .01, 0, .3)
wind_env(ambb, .28, en('6') - .35, T, .4, 0, .01)
# na Banca (planos 2, 19-21) bed de salao
hall = (murmur(T, 1.0, 3)); hall = lp(hall, 1800)
bed(ambb, stereo_reverb(np.stack([hall[:int(8 * SR)]] * 2, 1), .6, .5).mean(1), st('2'), en('2') + .2, .18, .3)
bed(ambb, hall[int(20 * SR):], st('19'), en('21'), .06, .3)
# casa
rt = room_tone(T, 1.0); mm = murmur(T, 1.0, 5)
bed(ambb, rt[int(3 * SR):], en('2') - .1, en('6') + .12, .32, .2)
bed(ambb, lp(mm[int(30 * SR):], 900), st('3'), en('4'), .16, .3, -.3)
bed(ambb, kitchen_pot(20)[int(0 * SR):], st('3'), en('4') - .6, .12, .3, .5)
bed(ambb, clock_ticks(en('6') - st('3'), 1.0), st('3'), en('6'), .22, .01, .7)
bed(ambb, rt[int(40 * SR):], en('21') - .05, tB0 + .05, .3, .1)
bed(ambb, clock_ticks(tB0 - tReal2, 1.0), tReal2, tB0, .28, .01, .6)
# passaros e campo (menta)
Bd = birds_bed(T + 1, .9, 1.0, 3)
bed(ambb, Bd[int(st('7') * SR):], st('7'), en('11'), .12, .6)
bed(ambb, Bd[int(st('13') * SR):], st('13'), st('19'), .09, .6)
bed(ambb, Bd[int(tB0 * SR):], tB0, tLapse + 1.0, .1, .5)
# crepusculo: grilos suaves
Cr = crickets_bed(T + 1, 1.0)
bed(ambb, Cr[int(tFight * SR):], st('28') + 1.5, T, .05, 1.0)

# ================================================================ MUSICA
BEAT = .6
CH = {'C': ['C3', 'E4', 'G4', 'C5'], 'G': ['G2', 'D4', 'G4', 'B4'], 'Am': ['A2', 'E4', 'A4', 'C5'], 'F': ['F2', 'C4', 'F4', 'A4'], 'Dm': ['D3', 'F4', 'A4', 'D5'], 'Em': ['E3', 'G4', 'B4', 'E5']}
HOOK = {'C': [(0, 'E5', 2), (2, 'G5', 1), (3, 'A5', 1), (4, 'G5', 2), (6, 'E5', 2)],
        'G': [(0, 'D5', 2), (2, 'B4', 2), (4, 'D5', 2), (6, 'G5', 2)],
        'Am': [(0, 'C5', 2), (2, 'E5', 2), (4, 'A5', 3), (7, 'G5', 1)],
        'F': [(0, 'A5', 2), (2, 'G5', 2), (4, 'F5', 2), (6, 'E5', 2)]}
ARP = [0, 2, 1, 3, 1, 2, 1, 3]
ev_s = []        # eventos do sampler (stereo)
chip = stereo()
def bar_events(t0, ch, hook=False, arp=True, bass=True, pizz=False, hat=False, vel=1.0, bar=4 * BEAT, hookinst='marimba', chiphook=True):
    h = BEAT / 2
    tones = CH[ch]
    if arp:
        for k in range(8):
            p = tones[ARP[k]]; p = p if ARP[k] else tones[1]
            ev_s.append((t0 + k * h, 'harp', p if ARP[k] else tones[1], h * 2.2, .30 * vel, -.25 + .08 * k, 1.0))
    if bass:
        r = tones[0]; m = midi(r)
        for (hi, ln, up) in [(0, 2, 0), (3, 1, 12), (4, 2, 0), (7, 1, 7)]:
            f = hz(m + up + (12 if m < 38 else 0))
            add(chip, pulse(f, ln * h * .85, .5, .004, .25, .0, .05) * .20 * vel, t0 + hi * h, 1.0, 0)
    if hook:
        for (hi, p, ln) in HOOK[ch]:
            ev_s.append((t0 + hi * h, hookinst, p, ln * h * .95, .52 * vel, .25, 1.0))
            if chiphook: add(chip, pulse(hz(midi(p)), ln * h * .9, .125, .003, .2, .0, .04) * .09 * vel, t0 + hi * h, 1.0, .3)
    if pizz:
        for hi in (2, 6):
            for p in tones[1:3]: ev_s.append((t0 + hi * h, 'violins_pizz', p, .3, .30 * vel, -.4, 1.0))
    if hat:
        for k in range(8):
            hh = hp(noise(.04), 6000) * env_exp(.04, .008) * (.5 if k % 2 else .3) * vel
            add(chip, hh.astype(np.float32) * .09, t0 + k * h, 1.0, .15)
        for k in (0, 4):
            kk = np.sin(2 * np.pi * np.cumsum(120 - 70 * np.clip(t_(.2) / .1, 0, 1)) / SR) * env_exp(.2, .06)
            add(chip, kk.astype(np.float32) * .22 * vel, t0 + k * h, 1.0, 0)
PROG = ['C', 'G', 'Am', 'F']
def section(t0, t1, prog=PROG, layers=None, vel=1.0, rule=None):
    """toca barras de 2,4 s de t0 a t1; rule(t) -> dict de camadas"""
    k = 0; t = t0
    while t < t1 - .05:
        L = rule(t) if rule else {}
        bar_events(t, prog[k % len(prog)], vel=vel * L.get('vel', 1.0), **{x: L.get(x, d) for x, d in dict(hook=False, arp=True, bass=True, pizz=False, hat=False).items()})
        t += 4 * BEAT; k += 1
# --- A1 (plano 7 a 11)
def ruleA1(t):
    if t < tA0 + 4.8: return dict(arp=True, bass=True, vel=.8)
    if t < st('11') - 0.1: return dict(hook=True, pizz=True, hat=True, vel=.95)
    return dict(arp=False, bass=False, hook=False)
section(tA0, tCut1 + .1, rule=ruleA1)
# crescendo de tensao no plano 11: cellos e pulso rapido
for k in range(int((tCut1 - st('11')) / .15)):
    t = st('11') + k * .15; add(chip, pulse(hz('G2'), .12, .5, .002, .08, 0, .02) * (.05 + .22 * k / 16), t, 1.0, 0)
ev_s.append(dict(t=st('11') - .1, inst='cellos', pitch='G2', dur=tCut1 - st('11') + .1, vel=.5, pan=0, attack=1.2))
ev_s.append(dict(t=st('11') - .1, inst='cellos', pitch='G3', dur=tCut1 - st('11') + .1, vel=.45, pan=0, attack=1.2))
# --- A2 (plano 13 a 21): curiosidade
def ruleA2(t):
    if t < tA2 + 2.4: return dict(arp=True, bass=False, vel=.8)
    if t < st('18') - .05: return dict(hook=False, arp=True, bass=True, vel=.9)
    if t < st('19'): return dict(hook=True, pizz=True, hat=True, vel=1.05)
    if t < st('21') - .05: return dict(hook=True, pizz=True, vel=.85)
    return dict(hook=True, pizz=False, hat=False, vel=.8)
section(tA2, tReal2 + .05, prog=['F', 'C', 'G', 'Am'], rule=ruleA2)
# plink de curiosidade (plano 13): marimba subindo
for k, p in enumerate(['E5', 'G5', 'C6']): ev_s.append((tA2 + .1 + .2 * k, 'marimba', p, .3, .45, .2, 1.0))
# --- B1 (plano 23 a 25)
def ruleB1(t): return dict(hook=True, pizz=True, hat=True, vel=1.0)
section(tB0, tCrack - .05, prog=['C', 'F', 'G', 'Am'], rule=ruleB1)
# --- timelapse (plano 27): arpejo subindo
tn = ['A3', 'C4', 'E4', 'A4', 'C5', 'E5', 'A5', 'C6', 'E6']
for k, p in enumerate(tn): ev_s.append((tLapse + .15 + k * .31, 'harp', p, .5, .3 + .03 * k, -.3 + .07 * k, 1.0))
ev_s.append(dict(t=tLapse, inst='vibraphone_bowed', pitch='A3', dur=3.1, vel=.35, pan=0, attack=1.5))
# --- B2 (plano 28: ultimo slime, energetico)
ev_s_n = len(ev_s)
section(tFight, S21 + .15, prog=['Am', 'F', 'C', 'G'], rule=lambda t: dict(hook=True, pizz=True, hat=True, vel=1.05))
# fanfarra de nivel 3
for k, p in enumerate(['C5', 'E5', 'G5', 'C6']): ev_s.append((S21 + .2 + .09 * k, 'glockenspiel', p, .8, .6, .1, 1.0))
ev_s.append((S21 + .2, 'harp', 'C4', 1.5, .5, -.2, 1.0)); ev_s.append((S21 + .2, 'harp', 'G4', 1.5, .45, .2, 1.0))
# --- calma (planos 29 a 32): por do sol
CALM = ['F', 'C', 'G', 'Am']
for k, t in enumerate(np.arange(tCalm, tCarta - .4, 4.8)):
    ch = CALM[k % 4]; tones = CH[ch]
    for j in range(4):
        ev_s.append((t + j * 1.2, 'harp', [tones[1], tones[2], tones[3], tones[2]][j], 1.8, .30, -.2 + .15 * j, 1.0))
    ev_s.append(dict(t=t, inst='vibraphone', pitch=tones[3].replace('5', '4') if False else tones[1], dur=4.6, vel=.28, pan=.2))
    ev_s.append(dict(t=t, inst='violas', pitch=tones[1].replace('4', '3'), dur=4.8, vel=.3, pan=-.2, attack=1.0))
    ev_s.append(dict(t=t, inst='cellos', pitch=tones[0], dur=4.8, vel=.28, pan=0, attack=.9))
    ev_s.append((t + 2.4, 'flute_stac', tones[3], .5, .18, .3, 1.0)) if k % 2 else None
ev_s = [e for e in ev_s if e is not None]
# --- pad da Carta ate o fim (vida de cliffhanger, sem melodia de jogo)
tP = st('34') + .2
for k, (p, v, a) in enumerate([('A2', .5, 1.0), ('A3', .4, 1.5), ('E3', .3, 2.0)]):
    ev_s.append(dict(t=tP + .3 * k, inst='cellos', pitch=p, dur=en('37') - tP + 3.0, vel=v, pan=[-.2, .2, 0][k], attack=a))
ev_s.append(dict(t=st('35') + .5, inst='violas', pitch='E4', dur=en('37') - st('35') + 3, vel=.3, pan=-.3, attack=2.0))
ev_s.append(dict(t=st('36') + .2, inst='violins', pitch='A4', dur=en('38') - st('36') + 1, vel=.2, pan=.3, attack=2.5))
# pergunta A/B (plano 38): glockenspiel duas notas
for k, (p, dt) in enumerate([('E6', 1.0), ('A5', 1.5)]): ev_s.append((st('38') + dt, 'glockenspiel', p, 1.5, .35, .3, 1.0))
# resolucao no plano 39/40: acorde que abre (C add9) e cauda
t39 = st('39')
for p, v in [('C3', .5), ('G3', .4), ('E4', .35), ('D4', .25)]: ev_s.append(dict(t=t39, inst='cellos' if p[1] == '3' else 'violas', pitch=p, dur=en('40') - t39 - 1.2, vel=v, pan=0, attack=.8))
# coracao (plano 36 a 38)
for k in range(int((en('38') - st('36')) / 1.1)): A(sfxb, X.heartbeat(.8), st('36') + .3 + 1.1 * k, .22 * min(1, .4 + k * .12))
# loop: rima do plano 1 no fim
mb = lambda p, d: (P.pluck('music_box', p, d, .55)).astype(np.float32)
for k, (p, dt) in enumerate([('E5', .1), ('G5', .55), ('C6', 1.0)]): A(musb, mb(p, 1.6), dt, .35, .0)   # plano 1: celesta/caixinha
A(musb, mb('G5', 2.0), T - 1.45, .22); A(musb, mb('C6', 2.0), T - 1.0, .22)                                # eco no fim (loop)
# violao J-cut (plano 6 -> 7)
ng = P.pluck('nylon_guitar', 'C4', 1.6, .6).astype(np.float32); A(musb, ng, tA0 - .55, .35, -.2)
ng = P.pluck('nylon_guitar', 'G3', 1.6, .55).astype(np.float32); A(musb, ng, tA0 - .25, .3, -.2)
ng = P.pluck('nylon_guitar', 'E4', 2.2, .55).astype(np.float32); A(musb, ng, tA0 + .1, .3, -.2)

# sampler render e mistura das camadas de musica
print('render sampler...', len(ev_s), 'eventos', flush=True)
smp = S.render([e for e in ev_s if not (isinstance(e, tuple) and e[0] >= T)], dur=T, master=False).astype(np.float32)
smp = smp[:N] if len(smp) >= N else np.pad(smp, ((0, N - len(smp)), (0, 0)))
smp = S.room(smp, size=.35, mix=.16).astype(np.float32)
chipb = S.room(chip, size=.2, mix=.08).astype(np.float32)
smp = sosfilt(butter(2, 60, 'high', fs=SR, output='sos'), smp, axis=0).astype(np.float32)
mus = smp + chipb + musb
# musica some (corte seco) nos momentos de silencio e de mudanca de mundo
mask = np.ones(len(mus), np.float32)
for a, b_ in [(tCut1, tA2 - .05), (tReal2, tB0), (tCrack, tLapse), (tCarta, st('34') + .1)]:
    ia, ib, k = int(a * SR), int(b_ * SR), int(.05 * SR)
    mask[ia:ib] = 0; mask[ia - k:ia] = np.linspace(1, 0, k)
musica = (mus * mask[:, None]).astype(np.float32)
# nota grave depois da rachadura (fora da mascara): musica quase parada
cr_note = S.note('cellos', 'A2', 1.4, .4, attack=.25).astype(np.float32); A(musica, cr_note, tCrack + .3, .5, 0)
# ================================================================ VOZ
def load_voice(i):
    raw = subprocess.run(['ffmpeg', '-v', 'quiet', '-i', R + f'voz/l{i:02d}.mp3', '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()
voice = stereo(); gate = np.zeros(N, np.float32)
ana = json.load(open(R + 'audio/src/ana.json'))
for v in VO['lines']:
    i = v['linha']; x = load_voice(i); a = ana[str(i)]
    x = x[int(max(0, a['lead'] - .03) * SR): int((a['end'] + .08) * SR)]
    x = hp(x, 75, 2)
    x = X.compress(x, .12, 4.0, .004, .09)
    rms = np.sqrt(np.mean(x[np.abs(x) > .02] ** 2)); x = x * (.12 / max(rms, 1e-4))
    x = X.limit(x, .5, .004)
    x = fade(x, .012, .04)
    t0 = v['t'] - .03
    if v.get('em_cena'):
        y = lp(x, v['lowpass_hz'], 2) * .85
        wet = S.room(y.astype(np.float32), size=.2, mix=.22)[:, :]
        y2 = np.concatenate([wet, np.zeros((int(.4 * SR), 2), np.float32)])
        add(voice, y2[:, 0], t0, 1.0, -.15); add(voice, y2[:, 1], t0, 1.0, .15)   # estereo leve da ambiencia
    else:
        add(voice, x.astype(np.float32), t0, 1.0, 0.0)
    a_, b_ = int((v['t'] - .06) * SR), int((v['end'] + .12) * SR)
    gate[a_:b_] = 1
# gate suavizado (down only): ataque 40 ms, soltura 350 ms
def smooth_gate(g, att=.04, rel=.35):
    out = np.zeros_like(g); e = 0.0; a = np.exp(-1 / (att * SR)); r = np.exp(-1 / (rel * SR))
    for i in range(0, len(g)):
        e = a * e + (1 - a) * g[i] if g[i] > e else r * e + (1 - r) * g[i]
        out[i] = e
    return out
# versao rapida: decimada
def smooth_fast(g):
    d = 48; gd = g[::d]; o = np.zeros_like(gd); e = 0.0; a = np.exp(-1 / (.04 * SR / d)); r = np.exp(-1 / (.35 * SR / d))
    for i in range(len(gd)):
        e = a * e + (1 - a) * gd[i] if gd[i] > e else r * e + (1 - r) * gd[i]; o[i] = e
    return np.interp(np.arange(len(g)), np.arange(len(gd)) * d, o).astype(np.float32)
dk = smooth_fast(gate)
def duck(buf, db): return buf * (10 ** (-db * dk / 20))[:, None]
# vento ja cobre o fim; garante que o loop fecha: comeco e fim sem fade
# ================================================================ MIX
musica_d = duck(musica * .9, 10)
amb_d = duck(ambb * 1.0, 6)
sfx_d = duck(sfxb * .6, 4)
# ambiencia de sala (leve) nos efeitos: reverb curto na Banca
mixbus = musica_d + amb_d + sfx_d + voice * 1.0
os.makedirs(os.environ.get('STEMS', '/tmp/ep01_stems'), exist_ok=True)
for nm, b in [('musica', musica), ('sfx', sfxb), ('amb', ambb), ('voz', voice)]:
    sf.write(os.environ.get('STEMS', '/tmp/ep01_stems') + f'/{nm}.wav', b, SR, subtype='PCM_16')
# limite suave e normalizacao (-14 LUFS por loudnorm em duas passagens, depois recorte exato)
pk = np.abs(mixbus).max(); print('pico pre', pk)
tmp = os.environ.get('STEMS', '/tmp/ep01_stems') + '/pre.wav'
sf.write(tmp, (mixbus / max(1, pk / .95)).astype(np.float32), SR, subtype='FLOAT')
def ff(*a): return subprocess.run(['ffmpeg', '-hide_banner', '-y'] + list(a), capture_output=True, text=True)
m = ff('-i', tmp, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-')
js = json.loads(m.stderr[m.stderr.rfind('{'):m.stderr.rfind('}') + 1])
flt = ('loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={input_i}:measured_TP={input_tp}:measured_LRA={input_lra}:measured_thresh={input_thresh}:offset={target_offset}:linear=true').format(**js)
out = R + 'audio/mix.wav'
r = ff('-i', tmp, '-af', flt + f',aresample=48000,atrim=end_sample={N}', '-ar', '48000', '-c:a', 'pcm_s16le', out)
print(r.stderr[-300:])
print('ok', out)
