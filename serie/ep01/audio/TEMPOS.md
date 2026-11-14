# LOGADO ep01: tempos (narração normal + falas dos pais)

Duração total **119.37 s** (roteiro rev. 3). Fonte: `audio/vo_times.json` (falas, medidas em `voz/`) e `filme/tempos.json` (45 entradas = 40 planos; planos divididos em a/b/c/d). Gerado por `audio/src/mk_times.py` (medidas em `audio/src/ana.py` → `ana.json`, sem silêncio das pontas).

## Ordem das falas
L01 → L02 → **P1 Rogério (7,59 s, 2,87 s)** → **P2 Sandra (10,76 s, 3,94 s)** → L03 → L04 (sussurro) → … → L27. Falas dos pais tocam em cena, com ambiência de cozinha (low-pass 12 kHz, sala leve).

## Mudanças nesta rodada
- Narração regravada em tom normal; durações de `voz/duracoes.txt` e `audio/src/ana.json` atualizadas.
- Plano 3 em 4 pedaços (3a fim da L2, 3b Rogério, 3c/3d Sandra); plano 5 em 5a/5b; plano 25 em 25a/25b.
- Cortes de planos recalculados sobre a voz real; **nenhum plano passa de 4 s** (maior 3,98 s, plano 14). Plano 40 termina no quadro do plano 1 (loop).
- Cauda após L27: 2,4 s.

## Tabela (plano → início/fim → fala)
| Plano | Início | Fim | Dur | Fala(s) (início audível) |
|---|---|---|---|---|
| 1 | 0.00 | 2.93 | 2.93 | L01@0.20 |
| 2 | 2.93 | 5.58 | 2.65 | L02@3.18 |
| 3a | 5.58 | 7.34 | 1.76 | (cont. L02) |
| 3b | 7.34 | 10.51 | 3.17 | P01@7.59 |
| 3c | 10.51 | 12.60 | 2.09 | P02@10.76 |
| 3d | 12.60 | 14.85 | 2.25 | (cont. P02) |
| 4 | 14.85 | 18.50 | 3.65 | L03@15.20 |
| 5a | 18.50 | 20.20 | 1.70 | (cont. L03) |
| 5b | 20.20 | 22.39 | 2.19 | L04@20.51 |
| 6 | 22.39 | 24.19 | 1.80 | L05@22.69 |
| 7 | 24.19 | 27.97 | 3.78 | L06@27.07 (cont. L05) |
| 8 | 27.97 | 31.30 | 3.33 | L07@30.52 (cont. L06) |
| 9 | 31.30 | 33.92 | 2.62 | (cont. L07) |
| 10 | 33.92 | 36.68 | 2.76 | L08@34.57 (cont. L07) |
| 11 | 36.68 | 39.10 | 2.42 | L09@37.23 |
| 12 | 39.10 | 41.32 | 2.22 | L10@40.22 |
| 13 | 41.32 | 44.47 | 3.15 | L11@43.59 (cont. L10) |
| 14 | 44.47 | 48.45 | 3.98 | L12@47.60 (cont. L11) |
| 15 | 48.45 | 50.60 | 2.15 | (cont. L12) |
| 16 | 50.60 | 53.28 | 2.68 | (cont. L12) |
| 17 | 53.28 | 55.89 | 2.61 | L13@53.53 |
| 18 | 55.89 | 58.02 | 2.13 | L14@57.12 (cont. L13) |
| 19 | 58.02 | 61.10 | 3.08 | (cont. L14) |
| 20 | 61.10 | 64.50 | 3.40 | L15@62.01 (cont. L14) |
| 21 | 64.50 | 67.11 | 2.61 | (cont. L15) |
| 22 | 67.11 | 69.21 | 2.10 | L16@67.36 |
| 23 | 69.21 | 71.06 | 1.85 | L17@69.46 |
| 24 | 71.06 | 73.26 | 2.20 | (cont. L17) |
| 25a | 73.26 | 74.76 | 1.50 | L18@73.51 |
| 25b | 74.76 | 77.17 | 2.41 | (cont. L18) |
| 26 | 77.17 | 79.06 | 1.89 | L19@77.42 |
| 27 | 79.06 | 82.07 | 3.01 | L20@79.31 |
| 28 | 82.07 | 85.33 | 3.26 | L21@84.27 (cont. L20) |
| 29 | 85.33 | 87.68 | 2.35 | L22@85.58 |
| 30 | 87.68 | 89.48 | 1.80 | (cont. L22) |
| 31 | 89.48 | 92.43 | 2.95 | L23@89.73 |
| 32 | 92.43 | 95.45 | 3.02 | (cont. L23) |
| 33 | 95.45 | 97.94 | 2.49 | L24@95.70 |
| 34 | 97.94 | 100.73 | 2.79 | (cont. L24) |
| 35 | 100.73 | 103.78 | 3.05 | L25@100.98 |
| 36 | 103.78 | 105.60 | 1.82 | (cont. L25) |
| 37 | 105.60 | 109.50 | 3.90 | L26@105.68 |
| 38 | 109.50 | 113.45 | 3.95 | L27@109.95 |
| 39 | 113.45 | 116.40 | 2.95 | (cont. L27) |
| 40 | 116.40 | 119.37 | 2.97 | (cont. L27) |

Eventos de imagem com tempo absoluto estão em `filme/tempos.json` (campo `eventos`). A Carta pisca em 97.55 s (sino de carta).
