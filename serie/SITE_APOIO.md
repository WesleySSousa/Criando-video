# Site de apoio do @canalsemaviso — análise do animatensei e plano (25/11/2026)

## 1. Como o animatensei.rastracking.com funciona (lido do site em 25/11)
Site de webtoon vertical de uma obra só ("Reencarnei como Slime", autor Flash JGM, 3 capítulos de 19 a 23/11). O apoio é a peça central:

| Peça | O que faz |
|---|---|
| Botão "💛 Apoiar" no topo | Aparece em todas as páginas enquanto as doações estão ligadas (`/api/doacao/info` → `ligado`, mín. R$ 1, máx. R$ 5.000). |
| Faixa "Gosta das histórias? Apoie o projeto" | Na home e nos capítulos: "Qualquer valor por Pix ajuda a sair mais capítulos" + link "Ver apoiadores". |
| Barra da meta do mês | Só a barra, **sem mostrar reais**. O slime protagonista fica na ponta e muda de cara: triste (<25%), preocupado (<60%), feliz, festa (meta batida, "1 mês garantido"). Texto: "Meta de novembro para a série continuar". Hoje está em 26,4%. |
| apoiar.html | Botões R$ 5 / 10 / 20 / 50 ou valor livre + e-mail ("o Mercado Pago pede para gerar o Pix"). Gera QR Code + Pix copia e cola, validade, e confere o pagamento a cada 3 s. |
| obrigado.html | Depois de pago: **"Você ganhou um goblin na Vila dos Goblins! Qual vai ser o nome dele?"** (com 🎲 sortear). Depois escolhe: mostrar o @ do Instagram como apoiador ou "sou discreto". |
| apoiadores.html | Ranking sem valores (🥇🥈🥉 e 💛). Cada pessoa ganha um papel na vila: 1º "Dente, líder da caça", 2º "Ancião", guerreiros, aldeões, lenhadores, crianças. Hoje: 17 apoiadores. |
| vila.html | Mapa em canvas com 42 goblins; busca pelo @; clicar mostra quem apoiou. Promessa: quando os 42 tiverem dono, **cada apoio novo põe mais um goblin na série de verdade**. |
| Rastreio próprio ("rastracking") | ID aleatório no navegador, conta visitas, origem (ex.: instagram), cliques em todo botão marcado. Sem nome, e-mail ou IP — e avisa isso no rodapé. |
| Conta do leitor | Login opcional (aí não pede e-mail no Pix) e progresso de leitura salvo. |

### Por que funciona
1. **O apoiador vira parte da história** (goblin com nome dentro da série). Não é "doe", é "entre no mundo".
2. **Escassez + hierarquia**: 42 vagas, e quem mais apoia vira o líder. Gera competição sem expor valores.
3. **Meta emocional**: a série "continua" se a barra encher, e o personagem fica triste se não encher.
4. **Atrito mínimo**: Pix, qualquer valor a partir de R$ 1, sem cadastro.
5. **Prova social**: lista pública com @ do Instagram — o próprio apoiador divulga ("olha eu aqui").
6. **Mede tudo**: sabe de onde veio cada clique (ex.: qual vídeo levou ao Pix).

## 2. A situação do canal (dados de 14/11, ver ANALISE_CANAL.md)
- Instagram é a rede que funciona: 42,5 mil views em 30 dias, 99,9% de não seguidores, 201 seguidores, 310 compartilhamentos. YouTube 31 inscritos; TikTok 5.
- O gargalo é **conversão**: 2.957 visitas ao perfil → 207 seguidores (~7%); bio sem link.
- Duas séries: PEDIDO 03H33 (terror, motoboy, 6 eps) e LOGADO (gamer, pixel art 2.5D, ep. 1 em produção).
- Expectativa honesta: com ~200 seguidores, as doações vão ser poucas no começo. O site vale mais agora como **link da bio** (onde ver todos os episódios em ordem) e cresce junto com o público. O animatensei já tinha público de webtoon antes.

## 2b. Perfil hoje (Replin, 25/11/2026) — mudou muito desde 14/11
- **2.379 seguidores** (eram 201), 9 posts. Bio: "Toda história começa do nada. A nossa começa sem aviso. Animação original."
- Todas as séries terminam com **votação A/B** ("Vocês votaram B…") — o público já decide a história.

| Post | Data | Views | Alcance | Coment. | Compart. | Salvos | Tempo médio | Pulam no início |
|---|---|---|---|---|---|---|---|---|
| LOGADO EP01 — O Início | 16/11 | **110.172** | 76.622 | 324 | 240 | 536 | 55,9 s | 27,0% |
| LOGADO EP02 | 17/11 | 18.223 | 9.542 | 88 | 17 | 65 | 83,7 s | 31,8% |
| LOGADO EP03 | 19/11 | 12.588 | 8.201 | 36 | 13 | 41 | 79,3 s | 30,8% |
| Esqueleto (testador de jogo) ep. 1 | 21/11 | 71.808 | 46.086 | 132 | 67 | 244 | 84,6 s | 17,2% |
| LOGADO EP04 | 22/11 | 17.747 | 10.993 | 44 | 19 | 34 | 57,2 s | 31,3% |
| Esqueleto (Otto) ep. 2 | 22/11 | 14.937 | 8.477 | 39 | 19 | 49 | 90,5 s | 26,0% |
| **RANK F EP1** | 23/11 | 10.553 | 7.188 | 46 | 21 | 53 | 56,6 s | 29,5% |
| **RANK F EP2** | 24/11 | **56.545** | 40.670 | **228** | 149 | 294 | **82,5 s** | **15,8%** |
| Toque de Recolher ep. 1 | 25/11 | 3.378 (1º dia) | 2.641 | 5 | 15 | 10 | 25,1 s | 41,5% |

Leitura: o **RANK F EP2 é o melhor post do canal em engajamento** (o EP2 superou o EP1 em 5×, coisa que nenhuma outra série fez; 11,6% de engajamento, só 15,8% pulam no início e 228 comentários = votação). É a série com mais cara de "comunidade" — a melhor para puxar o apoio.
Obs.: o LOGADO publicado (Léo, NEXO Online) está diferente da BIBLIA.md do repositório (Teco, Almaré).

## 2c. RANK F — mecânica de apoio (a mais forte)
O gênero (ranks F→S, portais, caçadores) já é um sistema de hierarquia: é o "Vila dos Goblins" pronto.
- **Licença de Caçador**: quem apoia ganha uma carteirinha com o @ e um rank. O rank sobe conforme o total apoiado no mês (sem mostrar valor): F, E, D, C, B, A e um único **S** (o maior apoiador do mês, como o "Dente" do animatensei).
- **Quadro da Associação**: a página de apoiadores é o mural de caçadores registrados; os nomes aparecem nos episódios (lista de caçadores na tela, crachá no portal, mural da escola).
- **Meta do mês = estabilidade do portal**: barra "o portal fecha se não estabilizar"; o Téo na ponta muda de cara.
- **Votação**: manter A/B grátis para todos nos comentários (é o motor do alcance). Para apoiadores, só bônus sem pagar por decisão: ex. o rank S escolhe o nome de um monstro/NPC do episódio.

## 3. A versão do canal: mecânicas que casam com as séries
| Série | "Vila dos Goblins" equivalente | Barra da meta |
|---|---|---|
| **LOGADO** | Apoiador vira **jogador de Almaré**: nick no ranking da Banca de Porto Manso, ou um NPC na Campina Mansa farmando Gosmins ao lado do Teco. Topo do ranking = "Jogador nº 1 do servidor"; depois Veteranos, Caçadores, Novatos (nível 1). Os nomes aparecem de verdade na tela dos episódios (placar, chat do jogo, fila da Banca). | A **Carteira do Teco**: "Para o Teco sacar faltam…" com a barra igual ao HUD do jogo (sem mostrar reais). O Gosmim na ponta muda de cara. |
| **PEDIDO 03H33** | Apoiador vira **cliente no app de entregas**: o @ aparece como nome do pedido ("Pedido nº 10.228 — @fulano") ou endereço na tela do celular do motoboy. Lista "Clientes da madrugada". | Bateria do celular do motoboy enchendo (ou o relógio chegando às 03h33). |

Regras a manter (iguais ao original, boas práticas):
- Mostrar o @ só com permissão explícita; opção "anônimo/discreto".
- Não mostrar valores de ninguém; só posição/papel.
- Rastreio anônimo, avisado no rodapé.
- Nome do apoiador no episódio entra dentro da zona segura e respeita a bíblia (LOGADO: sem texto solto fora do HUD/placas).

## 4. Estrutura do site (proposta)
1. **Início**: as duas séries com capa, "comece pelo EP01", episódios em ordem (vídeo do YouTube embutido ou link para o Reel).
2. **Página da série**: lista de episódios + faixa de apoio + barra da meta.
3. **Apoiar**: valores R$ 5/10/20/50 ou livre, Pix (QR + copia e cola).
4. **Obrigado**: escolher o nick do jogador (LOGADO) ou nome do pedido (03H33) + @ ou anônimo.
5. **Apoiadores / Servidor de Almaré**: ranking e mapa com os jogadores.
6. Link único na bio de todas as redes, com `?origem=ig`, `?origem=tt`, `?origem=yt` para saber de onde vem o apoio.

## 5. O que precisa (decisões do dono)
- **Pix automático**: conta Mercado Pago (pessoa física serve) e o *Access Token* da API — fica guardado no servidor, nunca no código. Conferir a taxa do Pix na conta antes.
  - Alternativa sem programar nada: chave Pix fixa + QR estático e lista de apoiadores atualizada à mão (zero custo, mas sem confirmação automática nem tela de "obrigado").
- **Hospedagem com backend** (o Pix precisa de servidor): ex. Cloudflare Pages + Workers (grátis no começo) ou Vercel.
- **Domínio** (opcional): ex. `canalsemaviso.com.br`, ou usar o endereço grátis da hospedagem.
- **Meta do mês**: valor (fica escondido, só a barra aparece).

## 6. Ordem sugerida
1. Agora: site estático com as séries + página de apoio com Pix fixo + lista de apoiadores (rápido, já serve de link da bio).
2. Com a conta Mercado Pago: Pix automático, página de obrigado e escolha do nick.
3. Quando sair o LOGADO: "Servidor de Almaré" com os jogadores e os nomes entrando nos episódios.
