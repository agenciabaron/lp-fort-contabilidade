# Landing page · Fort Contabilidade

Landing page da Fort Contabilidade (Dourados/MS). Vite + Three.js, sem framework.

## Rodar localmente

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/
```

## Deploy na Vercel

Importe o repositório em vercel.com/new. A Vercel detecta Vite sozinha (build `npm run build`, saída `dist`).

## Páginas

| URL | Arquivo |
|---|---|
| `/` | `index.html` |
| `/quem-somos/` | `quem-somos/index.html` |
| `/consultoria/`, `/contabilidade/`, `/fiscal/`, `/dp-rh/`, `/regulatorio/`, `/societario/` | geradas a partir de `src/data.js` |

Menu, rodapé, abas de serviços da home, linha do tempo e as páginas de área são montados no build
(`src/render.js`, chamado pelo plugin em `vite.config.js`). Os arquivos `<área>/index.html` só têm os marcadores.

## Onde editar

- Textos da home e de "Quem somos": `index.html` e `quem-somos/index.html` (as 5 frases que giram no título ficam no `.rotator` do `index.html`)
- Áreas, serviços (nome e descrição), perguntas frequentes e linha do tempo: `src/data.js`
- Layout das páginas de área: `src/render.js`
- Cores e layout: `src/style.css` (variáveis no topo)
- Coluna 3D do topo: `src/hero3d.js`
- WhatsApp, telefone, e-mail e endereço: `src/contact.js`; a mensagem de cada botão da home fica no `data-msg` do HTML
- Vídeos dos cards: `public/videos/` (veja `LEIA-ME.txt`)

## Fotos

Ficam em `public/img/` em WebP, cada uma no tamanho em que aparece (1600 px nos topos, 1200 px nas fotos de seção,
900 px nos cards). As de banco vieram do Magnific, baixadas com a licença da conta da agência.
`fort-hero.webp` é a foto real dos sócios (topo de "Quem somos", seção "Quem somos" da home, "Nossa história" e o
card de vídeo); `og.jpg` é a imagem de compartilhamento feita a partir dela.

Para trocar ou adicionar uma foto, gere o WebP no mesmo tamanho (qualidade ~76) e atualize o nome em `src/data.js`
ou em `src/style.css` (classes `.ph--*`).

## Formulário de contato e painel admin

O formulário (home, "Quem somos" e páginas de área) envia para `api/contact.js`, uma Vercel Function.
O painel fica em `/admin/` (fora do Google pelo `robots.txt` e por `noindex`) e lista as mensagens, com busca,
status (novo, em atendimento, concluído), botão de resposta no WhatsApp, exclusão e exportação em planilha (CSV).

Não usa Supabase nem banco de usuários: há um único admin, definido por variáveis de ambiente.

**Depoimentos:** o botão "Avaliar a Fort" (home e "Quem somos") abre um formulário com nota de 1 a 5 e comentário
(`api/feedback.js`). Toda avaliação chega como *aguardando* na aba **Avaliações** do painel. Só as que você
publicar aparecem no site, na seção "Quem é cliente, recomenda", com a nota média.

**Para ativar em produção (uma vez):**

1. Na Vercel, abra o projeto → **Storage** → conecte um **Upstash Redis** (plano gratuito). Isso cria sozinho as
   variáveis `KV_REST_API_URL` e `KV_REST_API_TOKEN`, onde as mensagens ficam guardadas.
2. No computador, rode `npm run admin:senha`, digite a senha do admin e copie o resultado.
3. Em **Settings → Environment Variables**, crie `ADMIN_EMAIL` (o e-mail de login), `ADMIN_PASSWORD_HASH` e
   `SESSION_SECRET` (os dois gerados no passo 2). Faça um novo deploy.

Para trocar a senha, repita os passos 2 e 3: as sessões abertas caem sozinhas.

**Segurança:** a senha nunca é guardada, só o hash (scrypt). A sessão é um cookie `HttpOnly`, `Secure` e
`SameSite=Strict`, assinado e válido por 8 h. O login aceita 5 tentativas a cada 15 min por IP, e o formulário
5 envios por hora, com campo-armadilha contra robôs. Pedidos de outros sites são recusados.

**Localmente** (`npm run dev` ou `npm run preview`) a API roda dentro do Vite. Sem Redis, as mensagens vão para
`.data/leads.json`. Para testar o painel, copie `.env.example` para `.env.local` e preencha o admin com o
`npm run admin:senha`. Os dois arquivos ficam fora do Git.

## Desempenho

Teste a velocidade com `npm run build` e `npm run preview`: o `npm run dev` entrega os arquivos soltos e é bem mais
lento. O desfoque de vidro (`backdrop-filter`) fica só nos painéis sobre fotos, porque é caro para a placa de vídeo.
