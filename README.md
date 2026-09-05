# 📊 CRM Kanban Didático (Node.js + Express + SQLite3)

Bem-vindo(a) ao seu primeiro CRM Kanban completo, didático e pronto para produção! 🎉

Este projeto foi especialmente desenhado para **quem nunca programou na vida**. Ele mostra de forma clara e visual como funciona uma aplicação web completa de ponta a ponta: do banco de dados até a tela do usuário.

---

## 🧠 Metáforas Simples (Para fixar o aprendizado)

| Conceito | Metáfora do Mundo Real | Função no Projeto |
| :--- | :--- | :--- |
| **🍽️ Express** | **O Garçom** | Recebe os pedidos vindos do navegador e traz a resposta em JSON. |
| **📓 SQLite3** | **O Caderno de Anotações** | Nosso banco de dados leve gravado no arquivo local `crm.db`. |
| **🏛️ HTML** | **O Esqueleto da Sala** | As paredes e divisões onde ficam as colunas e os cards. |
| **🎨 Tailwind CSS** | **As Tintas e a Decoração** | O design elegante, cores, sombras e cantos arredondados. |
| **🕊️ Fetch** | **O Mensageiro Silencioso** | Atualiza a tela instantaneamente sem precisar recarregar a página. |

---

## 📁 Estrutura Mínima do Projeto

```text
crm-kanban-didatico/
├── 📄 api/index.js        -> Servidor Express + rotas + banco de dados SQLite (Coração da aplicação)
├── 📄 public/index.html   -> Interface visual Kanban (HTML5 + Tailwind CDN + JavaScript)
├── 📄 package.json        -> Lista de dependências (express, sqlite3, cors) e scripts
└── 📄 README.md           -> Este guia passo a passo para iniciantes
```

---

## 🚀 Passo a Passo: Rodando no seu Computador

### Passo 1: Instalar o Node.js
1. Baixe o instalador oficial gratuito em: [https://nodejs.org](https://nodejs.org) (recomendado: versão **LTS**).
2. Conclua a instalação padrão clicando em *Avançar / Next*.

### Passo 2: Abrir o Terminal na Pasta do Projeto
- **Windows**: Na pasta do projeto, segure `Shift` e clique com o botão direito em um espaço vazio, selecionando **Abrir no Terminal** (ou abra o Prompt de Comando / PowerShell).
- **Mac**: Pressione `Command + Espaço`, digite `Terminal` e navegue até a pasta usando `cd /caminho/da/pasta`.
- **Linux**: Pressione `Ctrl + Alt + T` e use `cd /caminho/da/pasta`.

### Passo 3: Instalar as Dependências
No terminal, digite:
```bash
npm install
```
*(ou se preferir instalar manualmente: `npm i express sqlite3 cors`)*

### Passo 4: Iniciar o Servidor
Execute:
```bash
npm start
```
*(ou: `node api/index.js`)*

Abra seu navegador no endereço:
👉 **http://localhost:3000**

---

## ⚡ Como Fazer Deploy Grátis na Vercel (Pronto com vercel.json)

O projeto já está 100% configurado com `vercel.json` e rotas Serverless Express para deploy em 1 clique na Vercel!

### Opção A: Pelo Dashboard da Vercel (Mais Fácil - Sem Terminal)
1. Suba seu código para um repositório no seu GitHub (público ou privado).
2. Acesse [https://vercel.com](https://vercel.com) e conecte sua conta do GitHub.
3. Clique em **"Add New..."** → **"Project"**.
4. Selecione o repositório do CRM.
5. Deixe todas as opções em padrão (o arquivo `vercel.json` configura tudo sozinho).
6. Clique em **Deploy**! Em menos de 1 minuto seu CRM estará no ar com link público HTTPS.

### Opção B: Pelo Terminal com Vercel CLI
1. Instale o utilitário oficial:
   ```bash
   npm install -g vercel
   ```
2. Na pasta do projeto, execute:
   ```bash
   vercel
   ```
3. Pressione `Enter` para confirmar as perguntas padrão.
4. Para publicar na URL final de produção:
   ```bash
   vercel --prod
   ```

> 💡 **Dica Técnica Didática**: Na Vercel, o ambiente é *Serverless*. O nosso servidor detecta automaticamente o deploy e cria o banco SQLite em `/tmp/crm.db` com permissão total de escrita, garantindo que você cadastre e mova leads sem nenhuma configuração adicional!

---

## 📋 Rotas da API Disponíveis

- `GET /api/leads` - Retorna a lista de todos os leads cadastrados.
- `POST /api/leads` - Cadastra um novo lead (`nome`, `whatsapp`, `valor`).
- `PATCH /api/leads/:id/status` - Altera a coluna/etapa do lead (`Novo`, `Em Negociação`, `Fechado`, `Perdido`).
- `DELETE /api/leads/:id` - Remove um lead específico.
- `POST /api/leads/reset` - Restaura os 3 leads didáticos originais de demonstração.
- `POST /api/leads/import` - Importa lista de leads em formato JSON.
- `GET /api/download-zip` - Faz o download instantâneo do projeto completo empacotado em `.zip`.

---

## 💡 Recursos da Interface

- **Dashboard de Métricas**: Total de Leads, Em Negociação e Total em R$ de Vendas Fechadas.
- **Kanban Interativo**: 4 colunas com cores intuitivas (Azul, Amarelo, Verde, Vermelho).
- **Drag & Drop**: Arraste os cards entre as colunas ou use as setas `←` e `→` para mover de status.
- **WhatsApp Direto**: Botão que abre a conversa com o cliente no WhatsApp com um clique.
- **Backup e Restauração**: Botões para exportar e importar arquivos `.json`.
- **Sem Recarregamento de Página**: Experiência fluida alimentada por chamadas assíncronas `fetch()`.

Bons estudos e boas vendas! 🚀
