# Previa visual ep.1 v3 (proporcoes ~7 cabecas, camera lateral baixa; 1080x1920; sem texto)
Codigo: previa/art.js (sprites a 2,5x, ~140 px; membros por `limb()`, rampas + selout), main.js (3 cenas, `?qc=1|2|3`), px/kit/fx/post_ts do estilo.
Pose-table reutilizavel: `TECO_POSES`, `LIRA_POSES`, `OUVIDOR_POSES` + `makeSprite(kind, pose)` em art.js (acrescente uma entrada ou parametro para nova pose). main_v1.js = versao top-down antiga.
- qc1 Praca: Teco de perfil, rosto discreto, cachecol rubi, Espeto, Brasa forte (cintura esquerda), punho esquerdo no cachecol, mao direita com dedos tocando o Menu azul-ardosia (4 icones, espaco cinza liso). ~60% da altura.
- qc2 Beco: Teco ajoelhado (dedo nos labios) e Lira (ponta do cachecol na mao) em primeiro plano; ao fundo Ouvidor alto e magro com cabeca clara e orelhas foscas, Gritador caido, brasa apagada, machado, cinzas; lanternas rosa.
- qc3 Fosso: Teco e Lira de perfil, Lira ~0,5 m atras, camera ~24 graus; espiral de degraus visivel atras; Brasa laranja aquece os rostos.
## Limitacoes
- qc2: orelhas do Ouvidor viram duas "placas" retas; cabeca ainda lavanda por causa da luz violeta.
- qc3: Teco/Lira ~50% da altura; degraus aparecem so em parte (borda esquerda do poco), cristal verde estourado no alto.
- Braco proximo de Teco ainda simplificado; Lira sem dobras finas; Gritador e machado em sprites antigos (menos detalhe).
- PNGs convertidos de JPEG q92 (still.mjs so salva JPEG).
