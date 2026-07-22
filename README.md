# Next Beauty Experience 2026

Landing page estática, responsiva e mobile-first para o Workshop Next Beauty. O projeto utiliza somente HTML5, CSS3 e JavaScript puro.

## Como abrir o projeto

Você pode abrir `index.html` diretamente no navegador. Para testar como em uma hospedagem, prefira iniciar um servidor local na pasta do projeto:

```powershell
python -m http.server 8080
```

Depois, acesse `http://localhost:8080`.

Não há instalação de pacotes, etapa de build ou dependências JavaScript.

## Configuração principal

As informações comerciais estão centralizadas no objeto `EVENT_CONFIG`, no início de `js/script.js`.

### Links dos botões

Preencha:

```js
regularCheckoutUrl: "https://seu-checkout-do-ingresso-regular.com",
vipCheckoutUrl: "https://seu-checkout-vip.com",
```

Comportamento dos botões:

1. Abrem o checkout correspondente, quando configurado.
2. Na falta de checkout, abrem o WhatsApp.
3. Sem checkout e sem WhatsApp, rolam até a seção de ingressos e informam que os links serão liberados em breve.

### Número do WhatsApp

Informe o número com DDI e DDD, de preferência apenas com dígitos:

```js
whatsappNumber: "5511999999999",
```

Você também pode editar `whatsappMessage` no mesmo objeto.

### Preços e parcelamento

Os cards exibem “Em breve” enquanto os valores estiverem vazios. Para publicar os preços:

```js
regularPrice: "R$ 297,00",
regularInstallments: "ou 12x de R$ 29,70",
vipPrice: "R$ 597,00",
vipInstallments: "ou 12x de R$ 59,70",
```

Use apenas valores e condições oficialmente definidos. Não inclua preços riscados ou descontos sem comprovação.

## Logo e imagens

A logo oficial foi extraída do PDF fornecido, convertida em PNG transparente e integrada diretamente ao site sem alteração de proporção ou cores.

Adicione os arquivos autorizados nestes caminhos:

```text
assets/images/logo-next-beauty.png
assets/images/logo-next-beauty-monograma.png
assets/images/hero-evento.webp
assets/images/local.png
```

Depois de adicionar as fotografias, confira em `EVENT_CONFIG`:

```js
officialEventImageEnabled: true,
officialVenueImageEnabled: true, // já está ativo
```

Use WebP ou AVIF para fotografias, dimensões adequadas ao uso e autorização expressa da organização. Não copie imagens do Instagram sem permissão.

## Palestrantes

As palestrantes ficam totalmente ocultas enquanto `speakersEnabled` estiver como `false` ou o array estiver vazio.

Adicione as fotos em `assets/images/palestrantes/` e preencha:

```js
speakersEnabled: true,
speakers: [
  {
    photo: "assets/images/palestrantes/nome.webp",
    name: "Nome confirmado",
    role: "Cargo ou especialidade",
    topic: "Tema da palestra",
    instagram: "https://www.instagram.com/perfil",
    bio: "Pequena biografia aprovada."
  }
],
```

Não use nomes, fotos ou biografias genéricas.

## Patrocinadores

Adicione as logos em `assets/images/patrocinadores/` e configure:

```js
sponsorsEnabled: true,
sponsors: [
  {
    name: "Marca confirmada",
    logo: "assets/images/patrocinadores/marca.webp",
    url: "https://site-oficial.com"
  }
],
```

A seção permanece oculta se não houver patrocinadores confirmados.

## Depoimentos

Adicione fotos autorizadas em `assets/images/depoimentos/` e configure:

```js
testimonialsEnabled: true,
testimonials: [
  {
    photo: "assets/images/depoimentos/nome.webp",
    name: "Nome real",
    profession: "Profissão",
    city: "Cidade — UF",
    text: "Depoimento aprovado pela participante.",
    video: "https://link-opcional-do-video.com"
  }
],
```

Nunca publique depoimentos fictícios.

## Local, mapa e redes sociais

Confirme os dados antes da publicação e preencha:

```js
venueName: "Pousada do PC",
venueAddress: "Endereço oficial completo",
mapUrl: "https://maps.google.com/...",
instagramUrl: "https://www.instagram.com/perfil-do-evento",
officialUrl: "https://dominio-oficial.com.br",
```

O botão “Como chegar”, o Instagram oficial e a canonical só aparecem quando seus links estiverem configurados. Há um comentário no HTML lembrando que o endereço precisa ser confirmado antes da publicação.

## Contagem regressiva

A contagem está desativada por padrão. Para ativá-la, use uma data e hora ISO com fuso horário:

```js
countdownEnabled: true,
countdownDate: "2026-10-10T09:00:00-03:00",
```

Ative somente depois que o horário oficial estiver confirmado.

## Dados estruturados do evento

O JSON-LD não é publicado com dados incompletos. Ele só é inserido quando URL oficial, endereço, cidade, estado, horários, imagem oficial, preço numérico, moeda e disponibilidade estiverem preenchidos no `EVENT_CONFIG`.

Use uma URL válida do Schema.org em `ticketAvailability`, por exemplo `https://schema.org/InStock`, apenas se essa condição for verdadeira.

## Política de privacidade e termos

Os textos no rodapé são avisos provisórios. Substitua-os por documentos revisados antes de iniciar coleta de dados ou vendas. As regras definitivas de compra, transferência, cancelamento e reembolso devem coincidir com o checkout.

## Publicar na Vercel

1. Envie esta pasta para um repositório Git.
2. Na Vercel, crie um projeto a partir do repositório.
3. Selecione “Other” como framework.
4. Não informe comando de build.
5. Use `.` como diretório de saída, se o painel solicitar.
6. Publique e depois preencha `officialUrl` com o domínio definitivo.

Também é possível usar a Vercel CLI na raiz do projeto:

```powershell
npx vercel --prod
```

## Publicar no GitHub Pages

1. Envie os arquivos para a branch principal do repositório.
2. Abra **Settings → Pages**.
3. Em **Build and deployment**, selecione **Deploy from a branch**.
4. Escolha a branch principal e a pasta `/ (root)`.
5. Salve e aguarde a URL publicada.
6. Preencha `officialUrl` com essa URL.

Todos os caminhos são relativos e funcionam em hospedagem estática, inclusive em subpastas do GitHub Pages.

## Checklist antes de publicar

- Confirmar a aplicação final da logo oficial já integrada.
- Confirmar endereço e horários.
- Configurar checkout ou WhatsApp.
- Informar preços e condições reais.
- Inserir Instagram e URL oficial.
- Revisar política de privacidade e termos.
- Cadastrar somente palestrantes, patrocinadores e depoimentos confirmados.
- Testar os dois tipos de ingresso em celular e desktop.
- Confirmar que o dia 11 continua claramente marcado como exclusivo para VIP.
