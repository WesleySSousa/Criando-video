# Nexy — app (iPhone, Android e web)

App em Expo (React Native) com **criação de conta, login e verificação do celular por SMS** usando o Supabase.

## O que já funciona
- **Criar conta**: nome, e-mail, celular e senha. O Supabase envia um **código de 6 números por SMS**; ao digitar, a conta é confirmada e a pessoa entra.
- **Entrar** de dois jeitos: celular + senha, ou só com **código por SMS**.
- **Esqueci minha senha**: código por SMS e depois “Nova senha”.
- **Trocar senha** e **Sair** na tela inicial.
- O login fica salvo no aparelho; ao abrir o app de novo, já entra.
- Cada conta ganha um perfil no banco (`profiles`) com nome, e-mail, telefone, plano e fim do teste de 7 dias de IA. Cada pessoa só enxerga o próprio perfil.

## Passo a passo (uma vez só)

### 1. Criar o projeto no Supabase
1. Crie uma conta em supabase.com e clique em **New project** (escolha a região **São Paulo** para ficar mais rápido no Brasil).
2. Em **SQL Editor → New query**, cole todo o arquivo `supabase/schema.sql` e clique em **Run**.

### 2. Ligar o envio de SMS
1. No Supabase: **Authentication → Sign In / Providers → Phone** e ative **Enable Phone provider**. Deixe **Confirm phone** ligado.
2. Escolha um provedor de SMS. O mais simples é o **Twilio Verify**:
   - Crie uma conta em twilio.com, vá em **Verify → Services → Create**.
   - Copie **Account SID**, **Auth Token** e o **Service SID** do Verify para os campos do Supabase e salve.
   - Na conta de teste (trial) do Twilio, o SMS só chega em números que você cadastrou como “Verified Caller IDs”. Para mandar para qualquer pessoa, é preciso ativar a conta paga (cada SMS é cobrado pelo Twilio).
3. **Para testar sem gastar SMS**: na mesma tela do provedor Phone existe o campo de **números de teste com código fixo** (ex.: `5511999990000=123456`). Com esse número, o app aceita o código `123456` sem enviar SMS.

> Os nomes dos menus do Supabase e do Twilio podem mudar um pouco; procure por “Phone” e “Verify”.

### 3. Colocar as chaves no app
1. No Supabase: **Project Settings → API**. Copie a **Project URL** e a chave **anon / publishable**.
2. Na pasta `nexy/app`, copie `.env.example` para `.env` e cole os dois valores.
   Nunca coloque no `.env` a chave **service_role / secret**. O `.env` não vai para o GitHub.

### 4. Rodar no celular
```bash
cd nexy/app
npm install
npx expo start
```
- Instale o app **Expo Go** no celular (App Store ou Google Play) e leia o QR code que aparece no terminal. Celular e computador precisam estar na mesma rede Wi-Fi.
- Para abrir no navegador, aperte `w` no terminal.

## Estrutura
```
src/app/_layout.tsx        protege as telas: logado vê (app), não logado vê (auth)
src/app/index.tsx          porta de entrada (redireciona)
src/app/(auth)/entrar.tsx  celular + senha ou código por SMS
src/app/(auth)/criar-conta.tsx
src/app/(auth)/verificar.tsx   código de 6 números (aceita colar e o preenchimento automático do SMS)
src/app/(auth)/esqueci.tsx
src/app/(app)/inicio.tsx   tela inicial logada
src/app/(app)/nova-senha.tsx
src/lib/supabase.ts        conexão com o Supabase
src/lib/errors.ts          mensagens de erro em português
supabase/schema.sql        tabela de perfis, regras de acesso e gatilhos
```

## Comandos úteis
```bash
npm run typecheck   # checagem de tipos
npm run lint        # lint
```

## Próximas etapas
Abertura animada, listas (com sincronização entre pessoas), câmera que reconhece itens, IA, perfil e planos (RevenueCat), seguindo o protótipo em `../nexy-prototipo.html`.
