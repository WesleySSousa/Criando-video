# Nexy — protótipo

App de lista de compras com IA (iPhone, Android e site). Este protótipo é uma página HTML única para validar telas e fluxos.

- Arquivo: `nexy-prototipo.html` (abra no navegador; no celular ocupa a tela inteira).
- Versão publicada: https://claude.ai/artifact/JxFqQs4XgH45jaf6WaTuoW

## O que o protótipo cobre
- Abertura de ~2,5 s sem toque: carrinho se desenha, item cai, vira o ícone do N e a logo pousa no login (som quando o navegador permite).
- Listas: várias listas, busca por nome ou código de barras, "coletei", 3 pontinhos (editar quantidade/unidade/observação, excluir, desfazer).
- Câmera ao vivo dentro da lista: lê código de barras e usa IA para reconhecer o produto; marca sozinho e mostra "Coloque no carrinho". Na prévia do navegador roda em modo demonstração.
- Nexy IA: itens básicos, receita (ex.: bolo de chocolate) com ingredientes para a lista, sugestões por histórico ("faz 32 dias que você comprou arroz").
- Compartilhar lista com outra pessoa.
- Mercados (fase futura): comparação de preço por mercado próximo. Preços fictícios.
- Configurações da conta: nome, apelido, nascimento, CPF (validado), e-mail e celular com código de verificação, endereço por CEP, contas Google/Apple, idioma.
- Perfil: foto, selo do plano, números de uso (listas criadas, compartilhadas, itens coletados, economia), dados pessoais, segurança, pessoas com acesso, notificações, preferências, ajuda, sair e excluir conta.
- Planos: 7 dias de IA grátis, depois Plus (R$ 9,90) e Família (R$ 14,90) — preços a validar.

## Próximo passo: app de verdade
- App: React Native + Expo (iPhone, Android e web com o mesmo código); câmera e código de barras com `expo-camera`.
- Contas, banco e lista compartilhada em tempo real: Supabase.
- IA: API do Claude (listas, receitas, sugestões, reconhecimento por imagem).
- Assinaturas: RevenueCat (App Store e Google Play).
- Preços: começar pela leitura do QR code da nota fiscal (NFC-e), que também alimenta o histórico de compras.
