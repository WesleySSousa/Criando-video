# Livro de regras — LOGADO

Como usar:
1. O roteirista lê este livro inteiro antes de escrever ou alterar qualquer plano, fala ou prompt de imagem (bíblia = `serie/BIBLIA.md`).
2. Os analistas conferem cada versão do roteiro e da prévia contra estas regras e acrescentam regras novas, com origem, a cada revisão.
3. Regra nova entra só se for verificável (número, contagem ou o que aparece ou não aparece na tela); regra existente nunca é apagada em silêncio.

## Decisões do criador

R1. Toda narração, fala e texto de cartão são em português do Brasil (pt-BR). — origem: usuário

R2. Vídeo vertical 1080×1920 em todos os planos, quadros-chave e prévias. — origem: usuário

R3. Cada episódio dura entre 1:20 e 2:00. — origem: usuário

R4. Todo episódio tem LEGENDA da narração e das falas, sincronizada com a voz (gerada dos tempos reais do áudio), no estilo da série: serifa itálica legível (~56–64 px, contorno/sombra escura), no máx. 2 linhas e ~6–8 palavras por vez, centralizada acima da zona segura de baixo (entre y≈1250 e y≈1500 no 1080×1920), nunca cobrindo o rosto do protagonista. Textos curtos extras também são permitidos (chamadas "manda pra quem…", "A ou B? comenta", rótulos do HUD, nomes, título), sem colidir com a legenda. Falas sussurradas em cena com marca visual distinta (ex.: itálico menor entre aspas). Quando quem fala NÃO é o protagonista, o NOME do personagem aparece logo acima da legenda (plaquinha pequena, na cor do figurino dele), em toda fala dele; narração e falas do protagonista não levam nome. Exportar também o .srt. — origem: usuário (revisado: 'pode escrever na tela' e 'pode pôr legenda')

R5. A narração é em 1ª pessoa, do protagonista, com a voz "wesley" do ElevenLabs; o usuário é o narrador. — origem: usuário

R6. Falas em cena são poucas e meio sussurradas, marcadas como sussurro no roteiro. — origem: usuário

R7. Em cada fala de cena, a narração deixa claro com quem o protagonista fala. — origem: usuário

R8. Câmera lateral 3/4 baixa, inclinada cerca de 10 a 20 graus para baixo. — origem: usuário

R9. Plano médio como padrão, com o protagonista em cerca de 60% da altura da tela. — origem: usuário

R10. Top-down só como exceção, no máximo 2 planos por episódio. — origem: usuário

R11. Proporções realistas (cerca de 7 cabeças); nada de chibi. — origem: usuário

R12. Sempre algo acontecendo na tela, com narração quase contínua; na prática, um evento novo a cada 10 a 15 s (número de VIRAL.md). — origem: usuário

R13. Momentos "o que ele sabe" usam lógica, física ou economia reais, nunca inventadas. — origem: usuário

R14. Estilo próprio: nenhum personagem, nome, franquia ou formato copiado de outro criador ou série; nenhum nome de franquia aparece no roteiro. — origem: usuário; EP01 rev1 (regras OK)

R15. Nunca gerar voz antes de o usuário aprovar o texto das falas. — origem: usuário

R16. 1 take por fala: `generations_count` = 1 (o padrão da ferramenta é 2). — origem: usuário

R17. Todas as gerações de um episódio ficam num único flow do ElevenLabs, criado antes da primeira chamada. — origem: usuário

R18. Subagentes usam modelo leve sempre que a tarefa permitir (triagem, contagem, conferência). — origem: usuário

## Roteiro e lógica

R19. Todo ganho de saldo, item ou recompensa mostra a fonte (venda, drop, pagamento) no mesmo plano ou no anterior; saldo que sobe sem fonte é erro crítico. — origem: EP01 rev1 (crítico)

R20. A premissa central do episódio (o que a série quer provar) é dita em fala nos primeiros 8 s, nunca só inferida. — origem: EP01 rev1 (crítico); EP01 rev2 (limite de 8 s)

R21. Toda promessa da narração ("eu vou mostrar", "eu vou provar") diz o quê, na mesma fala ou na seguinte. — origem: EP01 rev1 (crítico)

R22. Toda tese prometida ("isso paga", "funciona") tem prova visível na série; se a prova ficar para outro episódio, o roteiro diz qual. — origem: EP01 rev2 (leve, tese ainda não cumprida)

R23. Toda opção apresentada ao protagonista (A ou B) tem consequência dita e verificável, inclusive a opção de esperar. — origem: EP01 rev2 (M8)

R24. Prazo ou horário citado como causa ("até a noite", "vence domingo 08:00") aparece no relógio da tela e tem consequência causal dita. — origem: EP01 rev1 (médio); EP01 rev2 (M8)

R25. Expressões de continuidade ("dessa vez", "de novo") só aparecem se o antecedente já foi mostrado ou dito antes. — origem: EP01 rev1 (médio)

R26. Número usado como comparação ("oito, não treze") já foi mostrado ou dito antes no episódio. — origem: EP01 rev2 (M5)

R27. Nome novo (jogo, item, lugar, personagem) é apresentado com contexto na primeira vez e consta na bíblia antes do roteiro. — origem: revisão antiga (BRASA VIVA: nome do jogo sem contexto; lugar fora da bíblia)

R28. Termo de narração com dois referentes possíveis ("faixa", "luz", "ele") é trocado por um termo único. — origem: EP01 rev2 (leve)

R29. Elemento citado na fala é explicado antes de ser usado como referência (explicar, depois citar). — origem: revisão antiga (BRASA VIVA: frase usava "brasa" antes da explicação)

R30. Movimento que muda a situação de um personagem (entra correndo, aparece, some) tem motivo visto ou dito no mesmo plano ou no anterior. — origem: EP01 rev2 (leve)

R31. Pista usada depois (galho rachado, objeto da trama) aparece antes no episódio em que a trama a usa. — origem: EP01 rev1 (leve)

R32. Explicação econômica cita só regras que estão na bíblia; uma "procura" que não está na regra não entra. — origem: EP01 rev1 (médio)

## Números e continuidade

R33. Regra econômica existe em uma só versão na bíblia; duas versões contraditórias (ex.: reajuste diário e volta ao normal às 06:00) são proibidas. — origem: EP01 rev2 (M9)

R34. Todo item vendido sai do inventário no mesmo plano da venda, e o inventário é anotado na coluna de continuidade em cada plano que muda. — origem: EP01 rev2 (M2)

R35. Estado que muda sem causa mostrada (HP, saldo) é erro; recuperação passiva (ex.: 1 HP a cada 5 s) é recalculada entre os planos. — origem: EP01 rev2 (M3)

R36. Toda conta de combate fecha linha a linha: a soma de golpes e curas bate com o HP citado na fala e na bíblia. — origem: EP01 rev1 (crítico); EP01 rev2 (HP conferido)

R37. Média, soma e estoque citados são recalculados por um segundo leitor antes da aprovação; média errada (6,5 em vez de 6,0) é falha. — origem: EP01 rev1 (médio)

R38. Número dito em fala é o mesmo número mostrado na tela no mesmo plano (preço, percentual, prazo); toda conta mostrada usa o preço vigente naquele horário. — origem: EP01 rev2 (M7)

R39. Percentual dito diz o evento e a base (ex.: 24 de 38), e a base aparece na tela ou na fala. — origem: EP01 rev1 (médio); EP01 rev2 (M6)

R40. Toda conta de dinheiro mostrada inclui as taxas que a bíblia prevê (ex.: taxa de saque). — origem: EP01 rev2 (§3)

R41. Horários de relógio na tela crescem em ordem e batem com a linha do tempo da bíblia. — origem: EP01 rev2 (§3)

R42. Regra de frequência da bíblia (spawn, drop, cadência) confere com o número de ocorrências mostradas no episódio. — origem: EP01 rev2 (leve)

R43. Estado de HUD e menu (aberto ou fechado, ícone com número ou piscando) é definido em cada plano; mudança exige ação mostrada. — origem: EP01 rev1 (pl. 34); EP01 rev2 (M4)

R44. O último plano de um loop repete o enquadramento e os estados de HUD do primeiro. — origem: EP01 rev1 (loop); EP01 rev2 (leve)

R45. Estado final do episódio (saldo, inventário, HP, nível, itens) é gravado na bíblia; o episódio seguinte começa dele. — origem: EP01 rev2 (M3)

R46. Estado de luz ou de objeto (brilho, tremor, cor) tem uma só leitura em todos os planos e na coluna de continuidade. — origem: revisão antiga (BRASA VIVA: brasa "tremendo" e "firme" ao mesmo tempo)

R47. Distância entre personagens é fixada em metros por plano, e objeto segurado precisa alcançar essa distância (cachecol de ~1 m não liga personagens a 3 m). — origem: revisão antiga (BRASA VIVA)

R48. Eco visual ("igual ao plano 1") só vale se o plano de origem mostra o gesto. — origem: revisão antiga (BRASA VIVA)

R49. Lugar, hora do dia e quantidade de personagens do plano batem com a bíblia; divergência se corrige na bíblia antes de gerar. — origem: revisão antiga (BRASA VIVA: "anoitecer" e "sol alto"; "um grupo" e um Gritador)

R50. Item segurado ou equipado tem mão ou lugar definido, e só muda com ação mostrada; objeto que some ou aparece também. — origem: EP01 rev1 (Visor sem origem); EP01 rev2 (caneca sem mão); revisão antiga (cachecol trocando de lugar)

## Voz e tempo de fala

R51. Fala narrada cabe no plano a no máximo 2,4 palavras por segundo; sussurro, no máximo 1,8. — origem: EP01 rev1 (teto de 2,4); EP01 rev2 (M1); revisão antiga (sussurro 1,8)

R52. A contagem de palavras é feita no texto final, não no número que o roteiro declara (7 palavras, não 6). — origem: EP01 rev2 (M1)

R53. Plano com folga de fala menor que 1,5 s é marcado como apertado e tem palavra de corte definida antes de gerar a voz. — origem: revisão antiga (BRASA VIVA: planos com folga abaixo de 1,5 s)

R54. Os planos são contíguos, nenhum passa de 4,0 s, e a soma deles é a duração do episódio. — origem: EP01 rev1 (pl. 37 com 4,5 s); EP01 rev2 (contíguos)

R55. Fala sincronizada não nomeia um elemento antes de ele aparecer na tela (tolerância de 1 s), não reage a um evento antes de ele acontecer, e segue a ordem das imagens. — origem: EP01 rev2 (M6, L24, L10)

R56. Cada fala de narração traz marcação de tom no mesmo formato em todo o roteiro (ex.: "calma, baixa"). — origem: revisão antiga (BRASA VIVA: tom só em uma fala)

R57. Falas de cena são só do protagonista ou de personagem já apresentado; personagem novo não fala antes de ser nomeado. — origem: revisão antiga (BRASA VIVA: Lira sem apresentação); EP01 rev1 (2 falas do protagonista com contexto)

R58. Pais e familiares não têm voz em cena. — origem: EP01 rev1 (regras OK); EP01 rev2 (§5)

## Viral e retenção

R59. A frase 1 da narração tem número e conflito, sai nos primeiros 2 s, sem "oi" nem apresentação. — origem: VIRAL.md (checklist 1 e 2); ANALISE_CANAL.md

R60. O primeiro quadro mostra o saldo em R$ e uma imagem de risco. — origem: VIRAL.md (checklist 3)

R61. Nos primeiros 8 s há um recap de uma frase, dentro da ação, para quem chega sem ter visto o episódio anterior. — origem: ANALISE_CANAL.md (quase todo o público é "a frio"); VIRAL.md (checklist 5)

R62. Cada episódio tem um destinatário nomeado para o envio ("manda pra quem joga até tarde") dito em fala E escrito na tela em texto curto no mesmo momento; o convite também vai na legenda do post. — origem: VIRAL.md (checklist 6, ajustado pela regra de texto na tela); ANALISE_CANAL.md

R63. Cada episódio tem uma situação de identificação (pais, dinheiro, "jogo não é trabalho") em pelo menos um momento. — origem: VIRAL.md (checklist 7)

R64. Pelo menos um número muda na tela por episódio, e o saldo antes e depois aparece. — origem: VIRAL.md (checklist 8)

R65. Há uma injustiça ou erro caro concreto antes da virada. — origem: VIRAL.md (checklist 9)

R66. A explicação lógica ou física dura no máximo 15 s, começa pelo resultado impossível ou pela ideia errada, e termina com número ou resultado visível. — origem: VIRAL.md (checklist 10 e 11)

R67. Nenhum plano sem movimento de personagem ou câmera passa de 1,5 s, cartões incluídos. — origem: EP01 rev1 (pl. 38 parado por 2,5 s); EP01 rev2 (1,5 s)

R68. O final tem pergunta A ou B que pode ser respondida em uma palavra. — origem: VIRAL.md (checklist 13); EP01 rev1 (falhou)

R69. Os últimos 5 s abrem uma pergunta nova cortada antes da resposta, sem logo e sem agradecimento. — origem: VIRAL.md (checklist 14)

R70. O título segue "LOGADO - EP## - gancho"; a legenda tem 1 pergunta de comentário e 3 a 5 hashtags, iguais às do roteiro. — origem: VIRAL.md (checklist 15); EP01 rev2 (M10)

R71. Número, nível e prazo citados na legenda e no título batem com o que o episódio mostra. — origem: EP01 rev2 (M10)

R72. Um episódio por dia, no mesmo horário; o próximo só sai quando o anterior parar de crescer; nunca dois no mesmo minuto. — origem: ANALISE_CANAL.md

R73. Cada episódio entra na playlist da série no YouTube, e a bio do Instagram cita as séries. — origem: ANALISE_CANAL.md

R74. A versão para TikTok é um corte de 20 a 45 s com gancho, não o episódio inteiro (episódios de 2 a 3 min retiveram 6 a 19%). — origem: ANALISE_CANAL.md

R75. Cada episódio testa uma única variável de gancho (ex.: os 2 primeiros segundos) para comparação entre episódios. — origem: ANALISE_CANAL.md

## Imagem e câmera

R76. Cartões, HUD e textos gerados ficam dentro da zona segura: x de 0 a 930 e y de 250 a 1540 px, em 1080×1920. — origem: EP01 rev1 (zona sem definição); EP01 rev2 (zona definida)

R77. Cada cartão (ex.: título, "Nível 1") tem posição definida no plano ou na bíblia; cartão sem posição não vai para a prévia. — origem: EP01 rev2 (cartões sem posição)

R78. Quadro-chave gerado não contém letras: nenhum rótulo de menu, placa ou cartão; ícones e linhas sem texto, e o texto entra em pós. — origem: revisão antiga (BRASA VIVA: texto no quadro e cartão no quadro-chave, críticos)

R79. Elemento de HUD (barra, gráfico, contador) só aparece em plano se estiver listado na bíblia; se não estiver, registra-se na bíblia antes. — origem: EP01 rev2 (M11)

R80. Cor de feedback (ex.: "+1" verde) não reutiliza a cor de uma barra existente do HUD. — origem: EP01 rev1 (leve)

R81. Toda fonte de luz tem origem visível no quadro (painel, brasa, lanterna); rosto iluminado sem fonte é erro. — origem: EP01 rev1 (leve)

R82. Descrição física no mesmo plano não se contradiz (calçado, mãos, roupa e acessório visível). — origem: EP01 rev1 (pl. 3 e 6)

R83. Acessório ou tecido não arrasta no chão quando a cena pede furtividade. — origem: revisão antiga (BRASA VIVA: cachecol arrastando)

R84. Rostos não estouram nem lavam com luz colorida, e orelhas e silhuetas têm forma, não placas. — origem: previa/NOTAS.md (limitações qc2)

R85. Membros próximos à câmera têm dedos e dobras; simplificação só é aceita em personagem de fundo. — origem: previa/NOTAS.md (limitações)

R86. Todo personagem em cena tem o mesmo nível de detalhe; sprite antigo é atualizado antes da prévia. — origem: previa/NOTAS.md (limitações)

R87. Elemento de cenário que define o lugar (degraus, espiral) aparece inteiro no enquadramento, não cortado na borda. — origem: previa/NOTAS.md (qc3)

R88. Cena com luz forte colorida (violeta, laranja) é checada no rosto de cada personagem antes de aprovar. — origem: previa/NOTAS.md (qc2 e qc3)

## Produção e créditos

R89. Roteiro só vai para voz ou imagem com veredito APROVADO; qualquer item crítico ou médio em aberto dá REPROVADO. — origem: EP01 rev1 (REPROVADO); EP01 rev2 (REPROVADO com 11 médios)

R90. Cada revisão numera as pendências (crítico, médio, leve) e a seguinte traz a situação de cada uma (resolvido, parcial, aberto). — origem: EP01 rev1; EP01 rev2

R91. Falha de geração não se corrige repetindo a chamada, porque cada repetição cobra de novo; a causa é corrigida no texto ou no prompt antes de gerar. — origem: usuário (controle de créditos)

R92. Nova pose entra na tabela de poses existente (`TECO_POSES`, `LIRA_POSES`, `OUVIDOR_POSES`); não se cria sprite paralelo. — origem: previa/NOTAS.md

R93. A checagem visual sai direto em PNG, sem passar por JPEG (hoje `still.mjs` grava JPEG q92, e a prévia atual foi convertida). — origem: previa/NOTAS.md
