# LOGADO EP01: filme (animação 2.5D pixel art), estado do storyboard

Pasta: `serie/ep01/filme/`. Motor: base do estilo (px/kit/fx/post_ts copiados da `previa/` e do demo; `$LIB` não foi editada). Render: `LEMO_ANGLE=swiftshader node core/render/still.mjs <filme> <t> --size 1080x1920` (software GL, ~10 s por quadro com ss=2).

## Pronto
- **Personagens** (`chars.js`, tabelas de pose `POSES`/`FPOSES`, dados): Teco real (camiseta grafite, bermuda, chinelo, faixa rubi no pulso; perfil, costas, deitado, sentado), Teco avatar (cachecol rubi, mochila, Galho Torto intacto/rachado; perfil com ~25 poses de luta/menu/andar, frente: parado, menu, aponta o galho, olha), Rogério e Sandra (perfil, falando, sentado, braços cruzados, aponta o relógio, prato), 4 figurantes, slime Gosmim (normal 2 quadros, pulo, golpeado, curando, morrendo 2 quadros, poça), itens (Gosma Rala, Gosma Dourada, Pó, moeda, caneca, Visor, prato, árvores, arbusto, capim, placa, caverna, cidade, lampião, Carta rasgada em cinzas).
- **HUD/Menu** (`hud.js`, só ícones e números, fonte de pixel 5x7): Menu (5 ícones, saldo sob a Carteira, Carta com 1 fixo/pisca), Carteira (saldo + barra de meta 20,00 + 500 gosmas), tela de drops (65%, contador, gráfico de 10 pontos), Banca (curva de 24 h, preço, seta, fila), Mochila (9+1, etiqueta 0,44/0,04), Cartas (Gosma Dourada, R$ 50,00, prazo 08:00), diagrama de velocidade, mapa (tela cheia), barra de vida verde, XP, selo de nível, relógio, cronômetro, chips de contador e Mochila, vida do slime, números flutuantes.
- **Sets** (`sets.js`): Cozinha+corredor e Quarto (vida real: incandescente amarelo-quente, névoa bege), Campina Mansa com ciclo de luz por hora (menta de dia, rosa-magenta no pôr do sol, rosa-violeta/violeta no crepúsculo, sombras verde-azuladas), Banca de Compras (azul-claro, janelas altas, selo prateado, painel de preços vivo, moedas).
- **Linha do tempo**: `tools/gen_shots.mjs` gera `shots.json` (43 entradas: planos 1–40 com 3a/3b/3c e 5a/5b; câmera por chaves, atores, poses, HUD, textos, legendas) e `legenda_ep01.srt`. Lê `tempos.json` (planos) e `audio/vo_times.json` (voz) quando existem; sem eles usa os tempos do roteiro. Lutas conferem golpe a golpe (20 HP: 3,2,+1,4,3,+1,3,4,3; Teco 40→36→32).
- **Página** (`index.html` + `main.js`): contrato da biblioteca (`READY`, `render(t)`, `DUR`, `TEXTS(t)`), 1080×1920. Legenda R4 (serifa itálica, ≤2 linhas, y≈1350–1480, sussurro em itálico menor entre aspas) com **plaquinha de nome opcional** (`speaker` por legenda, cor do figurino: Rogério azul-petróleo, Sandra mostarda; Teco/narração sem nome). Textos extras na zona segura (título, "Nível 1", rótulos de lugar, "manda pra quem duvida", "A ou B? comenta"). `?safe=1` desenha a zona segura; `?dbg=sprites` mostra a folha de sprites.
- **Storyboard**: `storyboard.jpg` (grade numerada) + `storyboard_parte1.jpg`/`parte2.jpg`; quadros individuais em `stills/full/`.

## Falta para o render final
1. `tempos.json` (119,37 s, 43 entradas) já foi lido na última geração; reconferir eventos de luta/cura/estouro contra `tempos.json.eventos` e rodar `node tools/gen_shots.mjs` se mudar.
2. Ajustes visuais: zona de cartões (cartão "Nível 1" cobre o tronco do Teco), planos "por cima do ombro" mostram só um pedaço do Teco, orelhas/rosto de Rogério e Sandra ainda simples, Teco de frente com cachecol dominante, rachadura do galho só legível no macro (plano 26), tira de foco do mapa (plano 35) não aplicada, chão com tracejado de dither ainda visível.
3. Áudio (voz, música, foley, mix), `video.mjs` (24 fps, `--workers 3`, ~10 s por quadro em software GL: cerca de 40 min por 1000 quadros por worker; usar GPU se houver), mux, `readcheck.mjs`.
4. Conferir R4 do `.srt` com os tempos reais e o `speaker` de P1/P2.

## Limitações
- Fontes Cormorant Garamond/Cinzel não estão no ambiente (os woff2 do demo não foram baixados): legenda e título usam Liberation Serif como substituto.
- XP exibido nos planos 18–28 é indicativo (não está na bíblia além de 30/84 por nível).
- Lugar do prato/mesinha, relógio da cozinha (08:00) e câmeras de cortes rápidos são estimativas de composição, não aprovadas.
- Slime desenhado ~0,4 m de altura (bíblia diz "0,5 de cabeça do herói": ambíguo).
