# Graph Report - serie  (2026-11-14)

## Corpus Check
- 44 files · ~94,462 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: .srt 2)

## Summary
- 643 nodes · 1499 edges · 35 communities (27 shown, 8 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 29 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3119d8e9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- previa/art.js
- chars.js
- sets.js
- gen_shots.mjs
- filme/main.js
- numpy
- Revisão 2 — LOGADO EP01 — REPROVADO (sem críticos; 11 médios, todos de correção curta)
- build_audio.py
- Análise do @canalsemaviso — Instagram (dados reais via Replin, 14/11/2026)
- LOGADO — Bíblia da série
- json
- hud.js
- renderWorld
- LOGADO — Ep. 1 "Nível 1" — Roteiro (116 s)
- Livro de regras — LOGADO
- Pesquisa de nicho: série pixel art 2.5D (MMORPG VR, dinheiro real)
- overlay
- filme/post_ts.js
- LOGADO — Ep. 1 "Nível 1" — Tratamento (116 s)
- VIRAL: pesquisa de viralização para LOGADO (14/11/2026)
- Concorrentes e plano de crescimento — @canalsemaviso
- LOGADO ep01: áudio (trilha, efeitos, ambiente, mix)
- previa/post_ts.js
- REFERÊNCIA: @gabriel.cta (Instagram) — análise para LOGADO (14/11/2026)
- bar_events
- mono
- sine
- LOGADO ep01: tempos sincronizados com a voz real (R94)
- Previa visual ep.1 v3 (proporcoes ~7 cabecas, camera lateral baixa; 1080x1920; sem texto)
- _antigo_brasa_viva/voz/README.md
- cut_buf
- murmur
- whistle
- wood
- ep01/voz/README.md

## God Nodes (most connected - your core abstractions)
1. `hex()` - 45 edges
2. `h2()` - 41 edges
3. `PX` - 34 edges
4. `mkk()` - 31 edges
5. `h2()` - 31 edges
6. `PX` - 28 edges
7. `ramp()` - 24 edges
8. `buildQC2()` - 23 edges
9. `sprite()` - 22 edges
10. `buildBanca()` - 22 edges

## Surprising Connections (you probably didn't know these)
- `R()` --calls--> `ramp()`  [EXTRACTED]
  serie/ep01/filme/art.js → serie/ep01/filme/px.js
- `mk()` --calls--> `PX`  [EXTRACTED]
  serie/ep01/filme/art.js → serie/ep01/filme/px.js
- `mk()` --calls--> `texOf()`  [EXTRACTED]
  serie/ep01/filme/art.js → serie/ep01/filme/px.js
- `menuPanel()` --calls--> `PX`  [EXTRACTED]
  serie/ep01/filme/art.js → serie/ep01/filme/px.js
- `menuPanel()` --calls--> `texOf()`  [EXTRACTED]
  serie/ep01/filme/art.js → serie/ep01/filme/px.js

## Import Cycles
- None detected.

## Communities (35 total, 8 thin omitted)

### Community 0 - "previa/art.js"
Cohesion: 0.05
Nodes (108): ashDot(), axeFlat(), axeSide(), bb(), C, _cache, crowdSide(), crowdTop() (+100 more)

### Community 1 - "chars.js"
Cohesion: 0.07
Nodes (80): ashDot(), axeFlat(), axeSide(), C, _cache, crowdSide(), crowdTop(), deadLantern() (+72 more)

### Community 2 - "sets.js"
Cohesion: 0.08
Nodes (59): bb(), flick(), particles(), rain(), sky(), stars(), panelSize(), barrel() (+51 more)

### Community 3 - "gen_shots.mjs"
Cohesion: 0.06
Nodes (43): spriteSheet(), add(), bancaNpc, C(), cam(), curve, dur, EP (+35 more)

### Community 4 - "filme/main.js"
Cohesion: 0.07
Nodes (26): camera, chipC, chipG, DATA, DBG, floatsNow, hudC, hudG (+18 more)

### Community 5 - "numpy"
Cohesion: 0.09
Nodes (22): boing(), clink(), cloth(), coin(), crack(), crickets_bed(), kitchen_pot(), levelup() (+14 more)

### Community 6 - "Revisão 2 — LOGADO EP01 — REPROVADO (sem críticos; 11 médios, todos de correção curta)"
Cohesion: 0.09
Nodes (22): 1. Itens da revisão 1: situação, 1. Os 11 médios da revisão 2: todos resolvidos, 2. Problemas novos, 2. Verificações, 3. Contas da Banca (conferidas), 3. Pendências novas (todas leves, não bloqueiam), 4. Livro de regras, 4. Tempo e falas (+14 more)

### Community 7 - "build_audio.py"
Cohesion: 0.11
Nodes (6): bed(), fade(), ruleA1(), ruleA2(), st(), wind_env()

### Community 8 - "Análise do @canalsemaviso — Instagram (dados reais via Replin, 14/11/2026)"
Cohesion: 0.11
Nodes (18): Análise do @canalsemaviso — Instagram (dados reais via Replin, 14/11/2026), Aplicar em LOGADO, Canal hoje, Comparando as 3 redes, Conta hoje, Episódio a episódio (PEDIDO 03H33), Episódio a episódio (PEDIDO 03H33), Episódio a episódio (PEDIDO 03H33) (+10 more)

### Community 9 - "LOGADO — Bíblia da série"
Cohesion: 0.12
Nodes (16): 10. Linguagem de câmera da série, 1. Premissa, 2. Voz e ritmo (regras da série), 3. Regras do jogo (ALMARÉ), 4. Personagens, 5. Itens (dono, lugar, estado) — ao fim do ep. 1, 6. Lugares, 7. Linha do tempo (+8 more)

### Community 11 - "hud.js"
Cohesion: 0.30
Nodes (13): COL, disc(), drawChip(), drawHUD(), drawMap(), drawPanel(), frame(), G (+5 more)

### Community 12 - "renderWorld"
Cohesion: 0.24
Nodes (13): poseFrame(), specK(), camAt(), evalState(), fmtMoney(), lerp(), lin(), place() (+5 more)

### Community 13 - "LOGADO — Ep. 1 "Nível 1" — Roteiro (116 s)"
Cohesion: 0.20
Nodes (9): Checklist viral (VIRAL.md), Conferência de contas (jogo), Contagem exata, Corrigido na revisão 1, Corrigido na revisão 2, Janelas e ritmo (por linha), Linhas faladas (para TTS), na ordem, LOGADO — Ep. 1 "Nível 1" — Roteiro (116 s) (+1 more)

### Community 14 - "Livro de regras — LOGADO"
Cohesion: 0.20
Nodes (9): Adendo — lições da produção, Decisões do criador, Imagem e câmera, Livro de regras — LOGADO, Números e continuidade, Produção e créditos, Roteiro e lógica, Viral e retenção (+1 more)

### Community 15 - "Pesquisa de nicho: série pixel art 2.5D (MMORPG VR, dinheiro real)"
Cohesion: 0.22
Nodes (8): 10 regras para o roteirista, 1. Retenção em vídeos curtos (60-120 s), 2. Séries em partes (Parte 2), 3. O que o público do nicho gosta (LitRPG / progressão), 4. Erros comuns que derrubam a retenção, 5. Plataformas (pesquisa limitada: fontes são guias de terceiros, sem documentação oficial; confirme no app), Lacunas, Pesquisa de nicho: série pixel art 2.5D (MMORPG VR, dinheiro real)

### Community 16 - "overlay"
Cohesion: 0.39
Nodes (8): clamp(), drawExtras(), drawSubtitle(), fmtCron(), overlay(), pix(), ss(), wrap()

### Community 17 - "filme/post_ts.js"
Cohesion: 0.29
Nodes (5): cocShader, DofScenePass, gatherShader, makePost(), vignetteShader

### Community 18 - "LOGADO — Ep. 1 "Nível 1" — Tratamento (116 s)"
Cohesion: 0.25
Nodes (7): 1. Três estruturas candidatas, 2. Logline e arco, 3. Benchmark, 4. Cue map, 5. Tabela de som, 6. Voz, LOGADO — Ep. 1 "Nível 1" — Tratamento (116 s)

### Community 19 - "VIRAL: pesquisa de viralização para LOGADO (14/11/2026)"
Cohesion: 0.25
Nodes (7): 0. Limite honesto desta pesquisa, 1. Casos do entorno do nicho (com número) e o que deles se aproveita, 2. Gatilhos de compartilhamento e comentário, 3. Tendências BR verificáveis (fraco), 4. Explicação lógica/física que viraliza, Checklist viral do episódio (verificável no roteiro), VIRAL: pesquisa de viralização para LOGADO (14/11/2026)

### Community 20 - "Concorrentes e plano de crescimento — @canalsemaviso"
Cohesion: 0.29
Nodes (6): 1. Limite desta pesquisa (leia primeiro), 2. O que a pesquisa achou (tudo de segunda mão, só direção), 3. Técnicas a copiar (dos dados do próprio canal + pesquisa anterior), 4. Plano para chegar a 10 mil seguidores (priorizado), 5. Ficha para preencher à mão (por concorrente), Concorrentes e plano de crescimento — @canalsemaviso

### Community 21 - "LOGADO ep01: áudio (trilha, efeitos, ambiente, mix)"
Cohesion: 0.29
Nodes (6): Como foi feito, Dois climas, Efeitos (todos sintetizados; no tempo dos eventos de `tempos.json`), Limites e pendências, LOGADO ep01: áudio (trilha, efeitos, ambiente, mix), Mapa de música (s)

### Community 22 - "previa/post_ts.js"
Cohesion: 0.29
Nodes (4): cocShader, DofScenePass, gatherShader, vignetteShader

### Community 23 - "REFERÊNCIA: @gabriel.cta (Instagram) — análise para LOGADO (14/11/2026)"
Cohesion: 0.29
Nodes (6): 0. Limite honesto desta análise, 1. O que dá para ver, 2. Técnicas que funcionam (GENÉRICAS, não observadas no perfil), 3. ZONA DE DIFERENCIAÇÃO, 4. Cinco recomendações para o roteiro do EP01 (baseadas na BÍBLIA e no VIRAL, não no perfil), REFERÊNCIA: @gabriel.cta (Instagram) — análise para LOGADO (14/11/2026)

### Community 24 - "bar_events"
Cohesion: 0.33
Nodes (5): bar_events(), hz(), midi(), pulse(), section()

### Community 25 - "mono"
Cohesion: 0.40
Nodes (5): bell(), birds_bed(), clock_ticks(), mono(), sino_carta()

### Community 26 - "sine"
Cohesion: 0.40
Nodes (5): blip(), heal(), login(), pickup(), sine()

### Community 27 - "LOGADO ep01: tempos sincronizados com a voz real (R94)"
Cohesion: 0.40
Nodes (4): LOGADO ep01: tempos sincronizados com a voz real (R94), O que mudou em relação ao roteiro, Regras aplicadas, Tabela (plano → início/fim → fala)

## Knowledge Gaps
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `spriteSheet()` connect `gen_shots.mjs` to `chars.js`, `filme/main.js`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Should `previa/art.js` be split into smaller, more focused modules?**
  _Cohesion score 0.0531734496124031 - nodes in this community are weakly interconnected._
- **Why does `sprite()` connect `chars.js` to `sets.js`, `gen_shots.mjs`, `renderWorld`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Should `chars.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07314974182444062 - nodes in this community are weakly interconnected._
- **Should `sets.js` be split into smaller, more focused modules?**
  _Cohesion score 0.08191808191808192 - nodes in this community are weakly interconnected._
- **Should `gen_shots.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.0573025856044724 - nodes in this community are weakly interconnected._
- **Should `filme/main.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._