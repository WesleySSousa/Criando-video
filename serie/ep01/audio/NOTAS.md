# LOGADO ep01: áudio (trilha, efeitos, ambiente, mix)

Entrega: `mix.wav` (48 kHz, estéreo, 16 bit, **112,47 s = duração exata de `filme/tempos.json`**, −14,0 LUFS integrado, pico real −1,4 dBTP), `legenda.srt` (44 blocos, ≤ 2 linhas e ≤ 8 palavras; sussurros de L04 e L09 em itálico), `vo_times.json`, `TEMPOS.md`. Nenhuma voz foi gerada: só as `voz/l01..l27.mp3` existentes, cortadas nas pontas e posicionadas por `vo_times.json`.

## Como foi feito
- `src/build_audio.py` (rodar com `/root/lemo-opuscar/.venv/bin/python`; ~20 s) gera tudo a partir de `vo_times.json` e `filme/tempos.json`. `src/mk_times.py` (+ `plan.py`, `ana.py`, `ana.json`) gera os tempos; `src/mk_srt.py` gera a legenda. Se `tempos.json` mudar, rode de novo e o áudio acompanha. Stems saem em `$STEMS` (padrão `/tmp/ep01_stems`; não versionados, 4 × 21 MB).
- Trilha 100% original, escrita em eventos (sem trecho de terceiros): amostras CC0 da biblioteca (VCSL: harpa, marimba, glockenspiel, vibrafone; VSCO 2 CE: pizzicato de violinos, violoncelos, violas, flauta), caixinha de música e violão de nylon por modelagem física (`pluck.py`) e chiptune em numpy (baixo de pulso 50%, lead de pulso 12,5%, chimbal e bumbo suaves). Sem créditos obrigatórios (CC0).
- Voz: corte do silêncio das pontas, passa-alta 75 Hz, compressão, RMS igualado e limitador de pico (0,5). **L04 e L09 (sussurros em cena)**: passa-baixa 7 kHz + sala curta (mix 22%) com abertura estéreo leve, para soarem dentro da cena; narração seca e centralizada.
- Mix: auto-duck por fala (ataque 40 ms, soltura 350 ms, só para baixo): **música −10 dB, ambiente −6 dB, efeitos −4 dB**. Master: `loudnorm` em duas passagens (−14 LUFS, TP −1,5) e corte em N amostras exatas.

## Dois climas
- **Vida real** (planos 3 a 6 e 22): sem melodia. Ambiente de cozinha (cafeteira borbulhando, murmúrio sem palavras, tic-tac do relógio de parede), tom de sala; efeitos secos (caneca, Visor, chinelo). O violão entra 0,55 s antes do corte para o jogo (J-cut do plano 6 → 7), junto com o zumbido do Visor.
- **Jogo**: 100 BPM (compasso de 2,4 s), tonalidade de Dó maior/Lá menor; progressões C–G–Am–F (luta), F–C–G–Am (curiosidade), C–F–G–Am (treino), Am–F–C–G (último slime). Gancho de 4 compassos na marimba dobrada pelo pulso chip; arpejo de harpa; pizzicato fora do tempo; chimbal/bumbo leves ("grind").

## Mapa de música (s)
| Trecho | Plano(s) | Música |
|---|---|---|
| 0,1–3,1 e 111,0–112,5 | 1 e fim | caixinha: motivo mi-sol-dó no início e eco sol-dó no fim (rima do loop) com o vento igual nos dois pontos |
| 3,1–5,8 | 2 | só sino/moedas da Banca |
| 5,8–16,1 | 3–6 | sem música (vida real) |
| 16,6–31,5 | 7–11 | harpa + pulso; gancho a partir de 21,4; no plano 11 sobe tremolo de violoncelo e pulso em semicolcheias até **corte seco em 31,50** |
| 31,5–33,7 | 12 | silêncio (golpes, estouro, gosma salta) |
| 33,7–60,0 | 13–21 | curiosidade: marimba "plink", harpa, baixo entra em 36,1, gancho em 38,1, pizz+chimbal no plano 18 (nível 2), brilho na Banca; **corte seco em 60,0** (real) |
| 60,0–61,9 | 22 | sem música |
| 61,9–70,0 | 23–25 | treino: gancho + pizz + chimbal; **corte em 70,0** (rachadura) |
| 70,0–71,7 | 26 | só um violoncelo grave (Lá) e o estalo |
| 71,7–74,7 | 27 | passagem do dia: arpejo de harpa subindo + vibrafone com arco + riser |
| 74,7–78,3 | 28 | último slime, energético; fanfarra de glockenspiel em "Nível três" (77,4) |
| 78,3–90,8 | 29–32 | pôr do sol: harpa lenta, vibrafone, violas, violoncelos, flauta esparsa |
| **90,77** | 33 | **corte musical no sino da Carta**; silêncio até 91,3 |
| 91,4–112,5 | 34–40 | só pad (violoncelos Lá2/Lá3/Mi3, violas, violinos), glockenspiel da pergunta A/B (plano 38), batida de coração suave (planos 36–38), acorde que abre em 106,4 (plano 39) e cauda até o vento do loop |

## Efeitos (todos sintetizados; no tempo dos eventos de `tempos.json`)
Golpes do galho (madeira; mais secos e agudos na pegada de ponta, planos 25b e 28), slime (squish, boing do pulo, baque de gel, "+1" cura, estouro mole com bolhas), moedas e sino da Banca (chuva de moedas e contador subindo), menu/HUD (clique, tick, 10 blips do gráfico de drops com 4 sinos), subida de nível (2 e 3), passos (chinelo de casa, pedra no salão), assobio do treino, estalo do galho (planos 26: 3 transientes + rangido + corpo grave), sino da Carta, sino grave do mapa, ofegar (plano 11), pano/cama/Visor/zumbido. Ambientes: vento (mesmo nível no início e no fim), pássaros (planos 7–11, 13–19, 23–27), grilos do crepúsculo (a partir do plano 28), salão da Banca (murmúrio com reverb), cozinha, tom de sala e tic-tac.

## Limites e pendências
- Mixado e checado por medição (LUFS, picos, cortes, nível por trecho) e por forma de onda, **sem audição humana**: vale ouvir uma vez, sobretudo o equilíbrio voz/efeitos nos planos de luta e o assobio (sintético).
- Todos os efeitos são sintéticos (sem gravação real); se algum soar artificial, trocar só aquele evento no script.
- Tempos de imagem que mudaram desde o commit dos tempos: só os eventos do plano 12 em `tempos.json` (golpes em +0,20/+0,45/+0,70, estouro em +0,85, gosma salta em +1,12 = 32,62 s; a fala L10 começa em 32,62 s). Os planos (ini/fim) não mudaram.
- Legenda: tempos por proporção de caracteres dentro de cada fala, ajustados às pausas internas medidas; não há timestamps por palavra (sem Whisper instalado). Os nomes de personagem (R4) não se aplicam: só há narração e o protagonista.
