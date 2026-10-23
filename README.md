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

## Onde editar

- Textos e seções: `index.html`
- Cores e layout: `src/style.css` (variáveis no topo)
- Coluna 3D do topo: `src/hero3d.js`
- Número do WhatsApp: `src/main.js` (`WHATSAPP`); a mensagem de cada botão fica no `data-msg` do HTML
- Vídeos dos cards: `public/videos/` (veja `LEIA-ME.txt`)
