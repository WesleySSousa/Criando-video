# LOGADO ep01: tempos sincronizados com a voz real (R94)

Duração total **112,47 s** (roteiro: 116 s; limite 120 s). Fonte: `audio/vo_times.json` (falas) e `filme/tempos.json` (planos). Gerado por `audio/src/mk_times.py` a partir de `voz/*.mp3` (medidos sem o silêncio das pontas: soma 97,7 s de fala audível; 108,3 s com as pontas).

## Regras aplicadas
- Cada fala **começa 0,2–0,3 s depois do corte** do plano em que o roteiro a inicia (exceções: L01 em 0,20 s do início; L05, 0,3 s; L09, 0,55 s, com o golpe do slime no meio da folga; L10, 1,2 s depois de L09, pausa dramática do roteiro).
- Pausas entre falas: 0,32 s (padrão); 0,4–0,6 s antes de L04, L05, L09, L16, L18, L19, L20, L21, L23, L24, L26, L27; **1,2 s** entre L09 e L10 (efeito do roteiro: golpes e estouro em silêncio de voz).
- Cortes de plano caem em pausas internas da fala (medidas por energia) ou 0,25 s antes da fala seguinte; fala que passa por 2 ou 3 planos mantém a ordem do roteiro.
- Nenhum plano passa de 4,0 s (maior: 3,95 s). Planos < 2 s (apertados, R53): 6 (1,80), 22 (1,92), 25a (1,50), 26 (1,66), 36 (1,76), 18 (2,04 quase). Plano 6 = deita, põe o Visor, clique, zumbido em 1,8 s.
- O plano 40 termina no quadro do plano 1 (loop); L27 acaba 2,4 s antes do fim, com cauda de pad e vento que emenda no vento do plano 1.

## O que mudou em relação ao roteiro
1. **Plano 25 dividido em 25a (65,85–67,35) e 25b (67,35–70,00)**: L18 (3,75 s) mais folga passaria de 4 s. Mesma cena e mesmo momento; 25a = "Segurei na base" (mão desliza para a base), 25b = golpes 5, 4, 5, 6, estouro, cronômetro 0:08, sorriso. `tempos.json` tem 41 entradas (40 planos; `plano` = número do roteiro).
2. Episódio 3,5 s mais curto: as falas reais ficaram abaixo da janela do roteiro onde havia folga (R95 já avisava) e os planos sem fala foram encurtados; planos 1–4 quase iguais, depois o deslocamento chega a −5 s no plano 37.
3. Plano 2 (Banca) acaba no fim de "Em Almaré, item vira dinheiro."; "Meus pais dizem que não paga." já cai no plano 3 (cozinha), como no roteiro.
4. L04 e L09 (sussurros em cena) entram com 0,25 s e 0,55 s depois do corte; L05 (plano 6) começa 0,3 s depois do corte e o plano 7 recebe "Nível um, um galho, quarenta de vida" junto do cartão "Nível 1".
5. L11 começa no plano 13 ("Pra sacar,") e a meta "20,00" entra no plano 14 em "são vinte reais"; L12 começa no fim do plano 14 e o "65%" entra no plano 15 em "sessenta e cinco por cento".
6. L20 começa no plano 27 e "Oito segundos, não treze" já vale no plano 28 (último slime); "Nível três." cai no plano 28 com o selo "3" (cura total) ao mesmo tempo.
7. L26 inteira dentro do plano 37 (Teco aponta o galho enquanto diz "manda isso pra essa pessoa"); plano 38 (trilhas A/B) cobre "Você faria o quê? A, arriscar a caverna hoje."; plano 39 cobre "B, esperar e perder a carta."; "Comenta." abre o plano 40.
8. Cartão "LOGADO" (2,6 s): entra 0,15 s depois do início do plano 2. Cartão "Nível 1": 2,0 s a partir de 0,1 s do início do plano 7.

## Tabela (plano → início/fim → fala)
| Plano | Início | Fim | Dur | Fala(s) (início audível) | Roteiro (s) | Δ |
|---|---|---|---|---|---|---|
| 1 | 0.00 | 3.09 | 3.09 | L01@0.20 | 0–2.8 | +0.0 |
| 2 | 3.09 | 5.83 | 2.74 | L02@3.34 | 2.8–5.6 | +0.3 |
| 3 | 5.83 | 9.02 | 3.19 | L03@7.72 (cont. L02) | 5.6–9.4 | +0.2 |
| 4 | 9.02 | 12.71 | 3.69 | (cont. L03) | 9.4–13.2 | -0.4 |
| 5 | 12.71 | 14.84 | 2.13 | L04@12.96 | 13.2–16.8 | -0.5 |
| 6 | 14.84 | 16.64 | 1.80 | L05@15.14 | 16.8–19.8 | -2.0 |
| 7 | 16.64 | 20.50 | 3.86 | L06@19.60 (cont. L05) | 19.8–22.0 | -3.2 |
| 8 | 20.50 | 23.86 | 3.36 | L07@23.08 (cont. L06) | 22–25 | -1.5 |
| 9 | 23.86 | 26.48 | 2.62 | (cont. L07) | 25–28 | -1.1 |
| 10 | 26.48 | 29.08 | 2.60 | L08@26.99 (cont. L07) | 28–31 | -1.5 |
| 11 | 29.08 | 31.50 | 2.42 | L09@29.63 | 31–34 | -1.9 |
| 12 | 31.50 | 33.72 | 2.22 | L10@32.62 | 34–36 | -2.5 |
| 13 | 33.72 | 36.76 | 3.04 | L11@35.88 (cont. L10) | 36–39 | -2.3 |
| 14 | 36.76 | 40.70 | 3.94 | L12@39.85 (cont. L11) | 39–42 | -2.2 |
| 15 | 40.70 | 42.85 | 2.15 | (cont. L12) | 42–45 | -1.3 |
| 16 | 42.85 | 45.77 | 2.92 | (cont. L12) | 45–48 | -2.1 |
| 17 | 45.77 | 48.38 | 2.61 | L13@46.02 | 48–51 | -2.2 |
| 18 | 48.38 | 50.42 | 2.04 | L14@49.52 (cont. L13) | 51–53 | -2.6 |
| 19 | 50.42 | 53.50 | 3.08 | (cont. L14) | 53–56 | -2.6 |
| 20 | 53.50 | 57.20 | 3.70 | L15@54.71 (cont. L14) | 56–59 | -2.5 |
| 21 | 57.20 | 60.00 | 2.80 | (cont. L15) | 59–61.8 | -1.8 |
| 22 | 60.00 | 61.92 | 1.92 | L16@60.25 | 61.8–63.6 | -1.8 |
| 23 | 61.92 | 63.77 | 1.85 | L17@62.17 | 63.6–66.6 | -1.7 |
| 24 | 63.77 | 65.85 | 2.08 | (cont. L17) | 66.6–69.6 | -2.8 |
| 25a | 65.85 | 67.35 | 1.50 | L18@66.10 | 69.6–72.6 | -3.8 |
| 25b | 67.35 | 70.00 | 2.65 | (cont. L18) | 69.6–72.6 | -2.2 |
| 26 | 70.00 | 71.66 | 1.66 | L19@70.25 | 72.6–75 | -2.6 |
| 27 | 71.66 | 74.67 | 3.01 | L20@71.91 | 75–77.5 | -3.3 |
| 28 | 74.67 | 78.32 | 3.65 | L21@77.18 (cont. L20) | 77.5–80.5 | -2.8 |
| 29 | 78.32 | 80.67 | 2.35 | L22@78.57 | 80.5–83.5 | -2.2 |
| 30 | 80.67 | 82.63 | 1.96 | (cont. L22) | 83.5–85.5 | -2.8 |
| 31 | 82.63 | 85.58 | 2.95 | L23@82.88 | 85.5–88.5 | -2.9 |
| 32 | 85.58 | 88.67 | 3.09 | (cont. L23) | 88.5–91.5 | -2.9 |
| 33 | 88.67 | 91.16 | 2.49 | L24@88.92 | 91.5–94.5 | -2.8 |
| 34 | 91.16 | 93.73 | 2.57 | (cont. L24) | 94.5–97.5 | -3.3 |
| 35 | 93.73 | 96.78 | 3.05 | L25@93.98 | 97.5–100.5 | -3.8 |
| 36 | 96.78 | 98.54 | 1.76 | (cont. L25) | 100.5–103.5 | -3.7 |
| 37 | 98.54 | 102.47 | 3.93 | L26@98.74 | 103.5–106.5 | -5.0 |
| 38 | 102.47 | 106.42 | 3.95 | L27@102.92 | 106.5–109.5 | -4.0 |
| 39 | 106.42 | 109.37 | 2.95 | (cont. L27) | 109.5–113 | -3.1 |
| 40 | 109.37 | 112.47 | 3.10 | (cont. L27) | 113–116 | -3.6 |

Eventos de imagem com tempo absoluto (golpes, cura, estouro, Carta) estão em `filme/tempos.json` (campo `eventos`, em s e em offset do plano). A Carta pisca em 90,77 s (sino de carta; corte da música).
