# 💍 Jaqueline & Lucas — Convite de Casamento

Site de convite de casamento elegante, profissional e interativo, construído com
HTML, CSS e JavaScript puro (sem dependências, sem build). Rápido, responsivo e
fácil de personalizar.

![status](https://img.shields.io/badge/feito%20com-%E2%99%A5-c2a878)

## ✨ Funcionalidades

- **Ecrã de abertura** com monograma animado dos noivos
- **Hero imersivo** com efeito parallax e pétalas a cair
- **Contagem decrescente** em tempo real para o grande dia
- **A Nossa História** — linha do tempo animada do casal
- **O Grande Dia** — cerimónia, celebração e botão para adicionar à agenda (`.ics`)
- **Galeria** com *lightbox* (navegação por teclado e toque)
- **Programa** do dia
- **Presença & Presentes** com IBAN e MB WAY e botão "copiar"
- **Dress code** em destaque
- **Confirmação de presença (RSVP)** com validação, campos dinâmicos e confettis 🎉
- **FAQ** em acordeão
- **Música ambiente** opcional
- **Animações ao scroll**, totalmente **responsivo** e com suporte a
  `prefers-reduced-motion`

## 🚀 Como ver localmente

Basta abrir o `index.html` no navegador. Para uma experiência completa
(carregamento de imagens, música), sirva os ficheiros:

```bash
# Python
python3 -m http.server 8000
# ou Node
npx serve .
```

Depois abra <http://localhost:8000>.

## 🎨 Personalização

Tudo o que muda com frequência está reunido no topo do `script.js`:

```js
const CONFIG = {
  weddingDate: '2026-09-26T00:00:00', // contagem decrescente até à meia-noite
  eventTitle: 'Casamento de Jaqueline & Lucas',
  eventLocation: 'Quinta de Marzovelos, R. Qta de Baixo n.º 2 B, 3510-014 Viseu',
  iban: 'PT50 0000 0000 0000 0000 0000 0', // IBAN para presentes
  mbway: '+351 900 000 000',              // número MB WAY para presentes
  galleryCount: 10,
};
```

> ⚠️ **Importante:** substitua o `iban` e o `mbway` pelos valores reais antes de
> partilhar o site com os convidados.

- **Cores**: edite as variáveis `--sage`, `--gold`, etc. no topo de `styles.css`.
- **Textos**: edite diretamente o `index.html` (história, programa, FAQ…).
- **Fotos**: substitua os URLs do Unsplash em `index.html` (hero) e na lista
  `photos` do `script.js` (galeria) pelas vossas fotografias do *pré-wedding*.
- **Música** ("Só Você" — Anderson Freire): coloque o ficheiro `.mp3` da música
  e aponte o `<source>` do `<audio id="bgMusic">` no `index.html` para ele.
- **Vídeo do pedido**: está alojado no YouTube com uma capa personalizada
  (`video-capa.jpg`). Para trocar o vídeo, altere o `VIDEO_ID` em `script.js`
  (a parte final do link, ex.: `https://youtu.be/`**`dwF2Nyhmpdg`**). Para mudar
  a capa, substitua `video-capa.jpg`.
- **RSVP**: por agora as respostas são guardadas no `localStorage` do navegador.
  Para receber as confirmações, ligue o formulário a um serviço como
  [Formspree](https://formspree.io), [Getform](https://getform.io) ou uma
  Google Apps Script.

## ☁️ Deploy

Site 100% estático — pode publicar em qualquer serviço:

- **Vercel**: `vercel` (ou ligue o repositório no painel)
- **GitHub Pages**: ative nas definições do repositório
- **Netlify**: arraste a pasta para o painel

---

Feito com ♥ para celebrar a Jaqueline & o Lucas · 26 · 09 · 2026
