/**
 * ==============================================================================================
 *                     🎓 GUIA DIDÁTICO: CRM KANBAN EM NODE.JS + SQLITE
 * ==============================================================================================
 * 
 * Olá, futuro(a) desenvolvedor(a)! 👋
 * Se você NUNCA programou na vida, respire fundo: você está no lugar certo!
 * Este arquivo único é o "coração" (servidor) da nossa aplicação. 
 * Abaixo está o passo a passo completo para você entender e rodar tudo no seu computador.
 * 
 * ----------------------------------------------------------------------------------------------
 * 🧠 METÁFORAS DO MUNDO REAL (Para você nunca mais esquecer):
 * ----------------------------------------------------------------------------------------------
 * 1. 🍽️ EXPRESS (O Garçom):
 *    Imagine um restaurante. O cliente (navegador/browser) faz um pedido da mesa.
 *    O Express é o garçom atencioso: ele ouve o pedido ("quero ver os leads", "anota esse lead novo"),
 *    leva até a cozinha (nosso código e banco), pega o prato pronto e devolve para a mesa em JSON.
 * 
 * 2. 📓 SQLITE3 (O Caderno de Anotações):
 *    É o caderno de pedidos da cozinha. Em vez de instalar um banco gigante e pesado, o SQLite
 *    guarda tudo num arquivo simples chamado `crm.db` no próprio computador. Se o computador desligar,
 *    o caderno continua lá intacto com todos os seus clientes salvos!
 * 
 * 3. 🏛️ HTML (O Esqueleto da Sala):
 *    As paredes, mesas, portas e janelas do restaurante. Define onde fica cada card, cada botão
 *    e cada coluna do nosso quadro Kanban.
 * 
 * 4. 🎨 TAILWIND CSS (A Decoração e as Tintas):
 *    As cores nas paredes, a iluminação suave, o formato arredondado dos pratos e a elegância
 *    visual que torna o restaurante agradável aos olhos.
 * 
 * 5. 🕊️ FETCH (O Mensageiro Silencioso):
 *    No passado, para pedir algo novo, era preciso recarregar a página inteira (como se derrubassem
 *    o restaurante e construíssem outro). O `fetch` é um mensageiro rápido que vai até o garçom,
 *    pega a informação nova e atualiza só o pedacinho da tela que mudou, sem piscar nada!
 * 
 * ----------------------------------------------------------------------------------------------
 * 🚀 PASSO A PASSO PARA O INICIANTE RODAR NO COMPUTADOR:
 * ----------------------------------------------------------------------------------------------
 * PASSO 1: BAIXAR E INSTALAR O NODE.JS
 * 1. Acesse o site oficial: https://nodejs.org
 * 2. Baixe a versão "LTS" (Long Term Support - que é a mais estável e recomendada).
 * 3. Instale normalmente (clicando em "Avançar / Next" até o final).
 * 
 * PASSO 2: ABRIR O TERMINAL
 * - No Windows: Pressione as teclas [Windows + R], digite `cmd` ou abra o "Terminal / PowerShell".
 * - No Mac: Pressione [Command + Espaço], digite `Terminal` e aperte Enter.
 * - No Linux: Pressione [Ctrl + Alt + T].
 * 
 * PASSO 3: ENTRAR NA PASTA DO PROJETO E INSTALAR AS DEPENDÊNCIAS
 * Navegue até a pasta onde descompactou os arquivos (usando o comando `cd nome-da-pasta`).
 * Depois, digite o seguinte comando e aperte Enter:
 * 
 *    npm install express sqlite3 cors
 * 
 * (O `npm` é a loja oficial de ferramentas gratuitas do Node. Ele vai baixar o garçom `express`,
 * o caderno `sqlite3` e o segurança `cors` automaticamente para você!)
 * 
 * PASSO 4: RODAR O PROJETO
 * Digite no seu terminal:
 * 
 *    node api/index.js
 *    (ou simplesmente: npm start)
 * 
 * Você verá a mensagem: "🚀 Servidor do CRM rodando em http://localhost:3000".
 * Abra seu navegador favorito (Chrome, Edge, Firefox) e acesse:
 * 👉 http://localhost:3000
 * 
 * PASSO 5: COMO FAZER DEPLOY GRATUITO NA VERCEL
 * 1. Crie uma conta gratuita em https://vercel.com
 * 2. No terminal, instale a ferramenta da Vercel:
 *       npm i -g vercel
 * 3. Digite apenas:
 *       vercel
 * 4. Responda 'y' para confirmar e pronto! Seu CRM estará online na internet com link público!
 * ==============================================================================================
 */

// ----------------------------------------------------------------------------------------------
// 📦 1. IMPORTANDO AS FERRAMENTAS NECESSÁRIAS
// ----------------------------------------------------------------------------------------------
const express = require('express');   // Nosso garçom inteligente
const cors = require('cors');         // Segurança que permite nosso site conversar com a API
const path = require('path');         // Utilitário para lidar com caminhos de pastas e arquivos
const fs = require('fs');             // Utilitário para ler/gravar arquivos no disco

// Criamos a nossa aplicação Express (o nosso restaurante abre as portas!)
const app = express();

// Porta onde o servidor vai atender (a porta 3000 é o padrão de desenvolvimento)
const PORT = 3000;

// ----------------------------------------------------------------------------------------------
// 🛡️ 2. MIDDLEWARES (Regras de boas-vindas do restaurante)
// ----------------------------------------------------------------------------------------------
// Habilita o CORS para que qualquer navegador consiga fazer requisições sem bloqueios
app.use(cors());

// Ensina o garçom (Express) a entender pedidos que chegam no formato JSON (o idioma da web)
app.use(express.json());

// Serve arquivos estáticos da pasta "public" (onde mora o nosso index.html decorado com Tailwind)
const publicDir = path.resolve(process.cwd(), 'public');
app.use(express.static(publicDir));

// ----------------------------------------------------------------------------------------------
// 📓 3. BANCO DE DADOS (SQLite - O Caderno de Anotações)
// ----------------------------------------------------------------------------------------------
/**
 * Onde salvar o arquivo `crm.db`?
 * - Localmente no seu PC: salva em `./crm.db` (dentro da pasta do projeto).
 * - Na Vercel (ambiente Serverless): o disco principal é somente leitura, então usamos `/tmp/crm.db`.
 */
const isVercel = Boolean(process.env.VERCEL);
const dbPath = isVercel 
  ? path.join('/tmp', 'crm.db') 
  : path.resolve(process.cwd(), 'crm.db');

console.log(`[BANCO DE DADOS] 📁 Local do arquivo SQLite: ${dbPath}`);

/**
 * Conexão Resiliente com SQLite:
 * Tentamos carregar a biblioteca 'sqlite3' padrão.
 * Se o ambiente tiver divergência de versão C++/GLIBC, ativamos com elegância
 * o driver nativo 'node:sqlite' integrado ao Node.js com o mesmíssimo arquivo `crm.db`.
 */
let db;

try {
  const sqlite3 = require('sqlite3').verbose();
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) throw err;
    console.log('✅ Conexão estabelecida com sucesso via biblioteca sqlite3!');
  });
} catch (libErr) {
  console.log('ℹ️ Ativando motor nativo SQLite do Node.js (node:sqlite) com máxima compatibilidade.');
  const { DatabaseSync } = require('node:sqlite');
  const nativeDb = new DatabaseSync(dbPath);

  // Criamos uma camada de compatibilidade idêntica à interface do sqlite3 (serialize, run, all, get, prepare)
  db = {
    serialize: (fn) => fn(),
    run: function (sql, params, callback) {
      if (typeof params === 'function') {
        callback = params;
        params = [];
      }
      try {
        const stmt = nativeDb.prepare(sql);
        const result = stmt.run(...(params || []));
        const context = {
          lastID: Number(result.lastInsertRowid),
          changes: Number(result.changes)
        };
        if (callback) callback.call(context, null);
      } catch (err) {
        if (callback) callback(err);
      }
    },
    all: function (sql, params, callback) {
      if (typeof params === 'function') {
        callback = params;
        params = [];
      }
      try {
        const stmt = nativeDb.prepare(sql);
        const rows = stmt.all(...(params || []));
        if (callback) callback(null, rows);
      } catch (err) {
        if (callback) callback(err);
      }
    },
    get: function (sql, params, callback) {
      if (typeof params === 'function') {
        callback = params;
        params = [];
      }
      try {
        const stmt = nativeDb.prepare(sql);
        const row = stmt.get(...(params || []));
        if (callback) callback(null, row);
      } catch (err) {
        if (callback) callback(err);
      }
    },
    prepare: function (sql) {
      const stmt = nativeDb.prepare(sql);
      return {
        run: function (...args) {
          const params = args.filter(a => typeof a !== 'function');
          const cb = args.find(a => typeof a === 'function');
          try {
            const res = stmt.run(...params);
            if (cb) cb.call({ lastID: Number(res.lastInsertRowid), changes: Number(res.changes) }, null);
          } catch (err) {
            if (cb) cb(err);
          }
        },
        finalize: function (cb) {
          if (cb) cb();
        }
      };
    }
  };
}

// Inicializamos a tabela e os dados de teste assim que o servidor liga
db.serialize(() => {
  /**
   * CRIANDO A TABELA `leads`:
   * - id: Número único de cada cliente (1, 2, 3...) gerado automaticamente.
   * - nome: Nome completo do cliente (obrigatório).
   * - whatsapp: Número do WhatsApp para contato direto.
   * - valor: Valor financeiro estimado da oportunidade em Reais (R$).
   * - status: Em qual etapa do Kanban o cliente está: 'Novo', 'Em Negociação', 'Fechado' ou 'Perdido'.
   * - criado_em: Data e hora em que o lead foi registrado.
   */
  db.run(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      whatsapp TEXT,
      valor REAL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'Novo',
      criado_em TEXT DEFAULT (datetime('now', 'localtime'))
    )
  `, (err) => {
    if (err) {
      console.error('❌ Erro ao criar a tabela leads:', err.message);
      return;
    }
    console.log('✅ Tabela "leads" pronta para receber cadastros.');

    // Verificamos se a tabela está vazia. Se estiver, inserimos 3 leads de exemplo!
    db.get('SELECT COUNT(*) AS total FROM leads', (countErr, row) => {
      if (!countErr && row && (row.total === 0 || row.total === '0')) {
        console.log('🌱 Tabela vazia detectada. Inserindo 3 leads didáticos de demonstração...');
        const seedStmt = db.prepare(`
          INSERT INTO leads (nome, whatsapp, valor, status) VALUES (?, ?, ?, ?)
        `);
        seedStmt.run('Carlos Silva', '+55 11 98765-4321', 2500, 'Novo');
        seedStmt.run('Mariana Souza', '+55 21 99876-5432', 4800, 'Em Negociação');
        seedStmt.run('Pedro Henrique', '+55 31 91234-5678', 7200, 'Fechado');
        seedStmt.finalize(() => {
          console.log('✨ 3 leads de exemplo inseridos com sucesso!');
        });
      }
    });
  });
});

// ----------------------------------------------------------------------------------------------
// 🌐 4. ROTAS DA API (Os caminhos que o Garçom Express atende)
// ----------------------------------------------------------------------------------------------

/**
 * ⚡ ROTA STATUS: GET /api
 * Devolve status da API e confirmação de prontidão para Vercel
 */
app.get('/api', (req, res) => {
  res.json({
    status: 'online',
    plataforma: isVercel ? 'Vercel Serverless' : 'Node.js Local',
    banco: 'SQLite3',
    dbPath: dbPath,
    mensagem: '🚀 API do CRM Kanban Didático operacional e pronta para deploy na Vercel!'
  });
});

/**
 * 📥 ROTA 1: GET /api/leads
 * Metáfora: "Garçom, por favor, me traga o cardápio com todos os leads anotados!"
 * Devolve todos os leads em formato JSON, ordenados do mais recente para o mais antigo.
 */
app.get('/api/leads', (req, res) => {
  const query = 'SELECT * FROM leads ORDER BY id DESC';
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar leads:', err.message);
      return res.status(500).json({ error: 'Erro interno ao consultar o banco de dados.' });
    }
    res.json(rows || []);
  });
});

/**
 * ➕ ROTA 2: POST /api/leads
 * Metáfora: "Garçom, anote este novo cliente no caderno de pedidos!"
 * Recebe nome, whatsapp e valor do novo lead e salva no SQLite.
 */
app.post('/api/leads', (req, res) => {
  const { nome, whatsapp, valor } = req.body;

  // Validação didática simples: ninguém pode salvar um cliente sem nome!
  if (!nome || typeof nome !== 'string' || nome.trim() === '') {
    return res.status(400).json({ error: 'O campo "nome" é obrigatório!' });
  }

  // Tratamento de valor numérico amigável
  const valorNumerico = parseFloat(valor) || 0;
  const whatsappLimpo = whatsapp ? String(whatsapp).trim() : '';
  const statusInicial = 'Novo';

  const sql = `
    INSERT INTO leads (nome, whatsapp, valor, status, criado_em)
    VALUES (?, ?, ?, ?, datetime('now', 'localtime'))
  `;

  db.run(sql, [nome.trim(), whatsappLimpo, valorNumerico, statusInicial], function (err) {
    if (err) {
      console.error('Erro ao inserir lead:', err.message);
      return res.status(500).json({ error: 'Erro ao salvar novo lead no banco.' });
    }

    // Devolvemos o lead criado com seu ID gerado
    res.status(201).json({
      id: this.lastID,
      nome: nome.trim(),
      whatsapp: whatsappLimpo,
      valor: valorNumerico,
      status: statusInicial,
      criado_em: new Date().toISOString(),
      message: 'Lead cadastrado com sucesso!'
    });
  });
});

/**
 * 🔄 ROTA 3: PATCH /api/leads/:id/status
 * Metáfora: "Garçom, mova o pedido nº 5 para a coluna 'Em Negociação'!"
 * Atualiza o status de um lead quando ele é arrastado no Kanban ou quando usamos as setinhas.
 */
app.patch('/api/leads/:id/status', (req, res) => {
  const leadId = req.params.id;
  const { status } = req.body;

  // As 4 colunas oficiais do nosso Kanban
  const statusValidos = ['Novo', 'Em Negociação', 'Fechado', 'Perdido'];

  if (!statusValidos.includes(status)) {
    return res.status(400).json({
      error: `Status inválido! Escolha um entre: ${statusValidos.join(', ')}`
    });
  }

  const sql = 'UPDATE leads SET status = ? WHERE id = ?';
  db.run(sql, [status, leadId], function (err) {
    if (err) {
      console.error('Erro ao atualizar status do lead:', err.message);
      return res.status(500).json({ error: 'Erro ao atualizar status no banco.' });
    }

    if (this && this.changes === 0) {
      return res.status(404).json({ error: 'Lead não encontrado para atualização.' });
    }

    res.json({
      success: true,
      id: Number(leadId),
      status,
      message: `Lead ${leadId} atualizado para "${status}".`
    });
  });
});

/**
 * 🗑️ ROTA EXTRA 4: DELETE /api/leads/:id
 * Permite apagar um lead individual com segurança.
 */
app.delete('/api/leads/:id', (req, res) => {
  const leadId = req.params.id;
  db.run('DELETE FROM leads WHERE id = ?', [leadId], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Erro ao deletar o lead.' });
    }
    res.json({ success: true, message: `Lead ${leadId} removido.` });
  });
});

/**
 * 🧹 ROTA EXTRA 5: POST /api/leads/reset
 * "Limpar Dados de Teste": esvazia e reinstala os 3 exemplos didáticos.
 */
app.post('/api/leads/reset', (req, res) => {
  db.serialize(() => {
    db.run('DELETE FROM leads', (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao limpar leads.' });
      }
      const seedStmt = db.prepare(`
        INSERT INTO leads (nome, whatsapp, valor, status) VALUES (?, ?, ?, ?)
      `);
      seedStmt.run('Carlos Silva', '+55 11 98765-4321', 2500, 'Novo');
      seedStmt.run('Mariana Souza', '+55 21 99876-5432', 4800, 'Em Negociação');
      seedStmt.run('Pedro Henrique', '+55 31 91234-5678', 7200, 'Fechado');
      seedStmt.finalize(() => {
        res.json({ success: true, message: 'Dados restaurados para o estado padrão de teste!' });
      });
    });
  });
});

/**
 * 📤 ROTA EXTRA 6: POST /api/leads/import
 * Importa uma lista de leads vinda de um arquivo JSON de backup.
 */
app.post('/api/leads/import', (req, res) => {
  const leads = req.body;
  if (!Array.isArray(leads)) {
    return res.status(400).json({ error: 'O formato do backup precisa ser uma lista de leads (array JSON).' });
  }

  db.serialize(() => {
    const stmt = db.prepare(`
      INSERT INTO leads (nome, whatsapp, valor, status, criado_em)
      VALUES (?, ?, ?, ?, COALESCE(?, datetime('now', 'localtime')))
    `);

    let inseridos = 0;
    leads.forEach((l) => {
      if (l && l.nome) {
        stmt.run(
          l.nome,
          l.whatsapp || '',
          Number(l.valor) || 0,
          l.status || 'Novo',
          l.criado_em || null
        );
        inseridos++;
      }
    });

    stmt.finalize(() => {
      res.json({ success: true, count: inseridos, message: `${inseridos} leads importados com sucesso!` });
    });
  });
});

/**
 * 📦 ROTA EXTRA 7: GET /api/download-zip
 * Permite ao usuário baixar instantaneamente o projeto COMPLETO empacotado em .ZIP
 * com api/index.js, public/index.html, package.json e README.md!
 */
app.get('/api/download-zip', async (req, res) => {
  try {
    const JSZip = require('jszip');
    const zip = new JSZip();

    // 1. api/index.js
    const indexJsContent = fs.readFileSync(__filename, 'utf8');
    zip.file('api/index.js', indexJsContent);

    // 2. public/index.html
    const htmlPath = path.resolve(process.cwd(), 'public', 'index.html');
    if (fs.existsSync(htmlPath)) {
      zip.file('public/index.html', fs.readFileSync(htmlPath, 'utf8'));
    }

    // 3. package.json limpo para o iniciante
    const cleanPackageJson = {
      name: "crm-kanban-didatico",
      version: "1.0.0",
      description: "CRM Kanban Didático em Node.js com Express e SQLite",
      main: "api/index.js",
      scripts: {
        "start": "node api/index.js",
        "build": "node -e \"console.log('Build Vercel concluído com sucesso')\""
      },
      keywords: ["crm", "kanban", "didatico", "express", "sqlite", "vercel"],
      author: "Iniciante em Programação",
      license: "ISC",
      dependencies: {
        "express": "^4.21.2",
        "sqlite3": "^5.1.7",
        "cors": "^2.8.5"
      }
    };
    zip.file('package.json', JSON.stringify(cleanPackageJson, null, 2));

    // 4. README.md
    const readmePath = path.resolve(process.cwd(), 'README.md');
    if (fs.existsSync(readmePath)) {
      zip.file('README.md', fs.readFileSync(readmePath, 'utf8'));
    }

    // 5. vercel.json para deploy zero-config na Vercel
    const vercelConfigPath = path.resolve(process.cwd(), 'vercel.json');
    if (fs.existsSync(vercelConfigPath)) {
      zip.file('vercel.json', fs.readFileSync(vercelConfigPath, 'utf8'));
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="crm-kanban-didatico.zip"',
      'Content-Length': zipBuffer.length
    });

    res.send(zipBuffer);
  } catch (error) {
    console.error('Erro ao gerar ZIP:', error);
    res.status(500).json({ error: 'Erro ao gerar o arquivo ZIP.' });
  }
});

// ----------------------------------------------------------------------------------------------
// 🏠 5. ROTA PRINCIPAL (Servindo o Frontend)
// ----------------------------------------------------------------------------------------------
app.get('/', (req, res) => {
  const indexPath = path.join(publicDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send(`
      <h1 style="font-family:sans-serif; text-align:center; margin-top:50px;">
        🚀 CRM Kanban Didático - Backend Operacional!<br/>
        <small style="color:#666">Arquivo public/index.html carregado.</small>
      </h1>
    `);
  }
});

// ----------------------------------------------------------------------------------------------
// 🚀 6. INICIALIZAÇÃO DO SERVIDOR
// ----------------------------------------------------------------------------------------------
// Se rodado diretamente via `node api/index.js`, inicia o servidor HTTP.
// Na Vercel ou quando importado como módulo, o Express é exportado como Serverless Function!
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`
===================================================================
✨ CRM KANBAN DIDÁTICO INICIADO COM SUCESSO!
🍽️  Garçom Express: Pronto para servir pedidos
📓 Caderno SQLite:  Armazenando em ${dbPath}
🌐 Acesse agora:    http://localhost:${PORT}
===================================================================
    `);
  });
}

// Exportamos o app para a Vercel executar como Serverless Function
module.exports = app;
