# Previa visual ep.1 (3 quadros-chave, 1080x1920, sem texto)
Fonte: previa/index.html + main.js + art.js (sprites em codigo) + px/kit/fx/post_ts copiados do motor do estilo. Render: `still.mjs previa 0 --size 1080x1920 --q qc=N`.
- qc1 (P1, Praca do Despertar): inserto quase top-down; piso de pedra palida, nevoa ouro-pale, sol alto frio. Teco visto de cima: cachecol rubi, Espeto nas costas, Brasa forte na cintura esquerda, punho esquerdo na ponta do cachecol, mao direita com dois dedos descendo. Menu quadrado azul-ardosia, moldura prata, 4 icones sem rotulo (bolsa, mapa, dois elos, circulo) e espaco cinza liso vazio embaixo. Faixa de foco entre mao e painel.
- qc2 (P8, Beco dos Sinos): violeta, lanternas rosa e sinos de bronze mudos. Ouvidor (orelhas verdes) sobre o Gritador caido; cinzas, vidro da brasa escuro, machado no chao. Teco e Lira (de costas, ~8 m) com Brasa de Teco forte e de Lira fraca amarelada.
- qc3 (P12, Boca do Fosso): verde mineral, espiral de degraus, cristais; Teco de costas diante do Fosso, cachecol rubi, punho na ponta, Lira ~0,5 m atras; unica cor quente = Brasa laranja.
## Limitacoes
- Camera do qc2 em ~46 graus (nao 90) para manter Teco/Lira em ~1/10 da altura com o Ouvidor e a distancia de 8 m; nao e top-down puro.
- Teco/Lira so de costas/de cima (sem rosto); "trêmula" da Brasa nao se ve em imagem parada; Teco no qc2 sai levemente desfocado (faixa no Gritador).
- Ouvidor parece "asas": cabeca pouco legivel; Lira com a mao no cachecol so aproximada (ponta nao encosta exatamente no punho de Teco).
- Gritador deitado em sprite plano; cartoes de capitulo/titulo ficam de fora. PNGs convertidos de JPEG q92 (still.mjs so salva JPEG).
