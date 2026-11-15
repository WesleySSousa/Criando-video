# Rodar o projeto no seu PC (Windows, GPU)

**Para a sessão do PC — onde paramos:** roteiro do EP01 aprovado; voz completa (narração normal + pais + sussurros) em `serie/ep01/voz/`; áudio final `serie/ep01/audio/mix.wav` (119,37 s) e `legenda.srt` prontos; storyboard `serie/ep01/filme/storyboard.jpg` com 5 correções pendentes (seção 5). Falta: corrigir, renderizar com GPU (R102), mux, analista de episódio, entregar `serie/ep01/LOGADO_EP01.mp4`. Regras: R101 (Graphify primeiro e como fonte principal de consulta) e R102 (usar CPU+GPU+RAM ao máximo). Não gerar voz nova (créditos).

Pasta: `C:\Users\Wesle\Documents\Claude 2.5D`

## 1. Instalar as ferramentas (PowerShell, uma vez)
```powershell
winget install Git.Git OpenJS.NodeJS.LTS Python.Python.3.12 Gyan.FFmpeg astral-sh.uv
```
Feche e abra o PowerShell. Confira: `node -v` (20+), `ffmpeg -version` (7+), `python --version` (3.11+).

## 2. Baixar o projeto
```powershell
mkdir "C:\Users\Wesle\Documents\Claude 2.5D"
cd "C:\Users\Wesle\Documents\Claude 2.5D"
git clone -b claude/peaceful-feynman-to7v9m https://github.com/wesleyssousa/criando-video .
```

## 3. Plugin do estilo e biblioteca
```powershell
claude plugin marketplace add lemomo-ai/lemo-opuscar
claude plugin install lemo-opuscar@lemolab
```
Depois, no **Git Bash** (vem com o Git):
```bash
S=$(ls ~/.claude/plugins/cache/lemolab/lemo-opuscar/*/skills/lemo-opuscar/scripts/setup.sh | head -1)
sh "$S" && sh "$S" deps
```
Opcional (economia de tokens): `uv tool install graphifyy` e depois `graphify install --platform claude`.

## 4. Abrir a sessão no PC
App Claude (desktop) → Claude Code → abrir a pasta `C:\Users\Wesle\Documents\Claude 2.5D`
(ou, no terminal dentro da pasta: `claude`).

## 5. Colar este pedido na sessão do PC
> Antes de qualquer coisa, rode `graphify update serie` e consulte `serie/graphify-out/GRAPH_REPORT.md` (regra R101). Continue o EP01 da série LOGADO neste repositório. Leia `serie/LIVRO_DE_REGRAS.md`, `serie/BIBLIA.md`, `serie/ep01/ROTEIRO.md`, `serie/ep01/filme/NOTAS.md` e `serie/ep01/audio/NOTAS.md`. Áudio (`serie/ep01/audio/mix.wav`, 119,37 s), tempos (`filme/tempos.json`) e legenda já estão prontos; o storyboard está em `filme/storyboard.jpg`.
> Antes do render, corrija: (1) plano 2 mostra "R$ 3,00" — deve ser R$ 0,68; (2) plano 21 sem o Teco; (3) cartão "Nível 1" do plano 7 cobre o Teco; (4) Teco em ~60% da altura na maioria dos planos (aproximar câmera); (5) plaquinhas ROGÉRIO/SANDRA maiores.
> Depois renderize o vídeo final 1080×1920 com a GPU (RTX 3070): rode o Chromium do render com aceleração de hardware (no Windows, ANGLE D3D11, ex.: flags `--use-angle=d3d11 --enable-gpu-rasterization --ignore-gpu-blocklist`; confira com `chrome://gpu` que WebGL está "Hardware accelerated") e use todos os núcleos do Ryzen e a RAM (32 GB) em paralelo: dividir o vídeo em trechos e rodar ~4–6 instâncias do render ao mesmo tempo, cada uma com seu Chromium. Encode do vídeo com `h264_nvenc` se disponível. Faça o mux com o `mix.wav` em −14 LUFS, rode o analista de episódio, e entregue `serie/ep01/LOGADO_EP01.mp4` + `legenda.srt`. Commit e push na branch `claude/peaceful-feynman-to7v9m`.
