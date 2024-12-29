const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const useragent = require('express-useragent');

const app = express();
const port = 5001;

app.use(useragent.express());

// app.use((req, res, next) => {
//   const isMobilePhone = req.useragent.isMobile && !req.useragent.isTablet;

//   if (isMobilePhone) {
//     res.status(403).send(`
//       <h1>Acesso Bloqueado</h1>
//       <p>O acesso à plataforma não está disponível para smartphones.</p>
//     `);
//   } else {
//     next();
//   }
// });

// Configuração do express-session
app.use(session({
  secret: 'meu_segredo_super_secreto',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 * 30 } // 30 minutos
}));

// Configuração para servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para processar dados do formulário
app.use(bodyParser.urlencoded({ extended: false }));

// Configuração da pasta de views
app.set('views', path.join(__dirname, 'views'));

// Rota para renderizar o HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Lista de usuários simulada
const users = [
  { username: 'admin', password: '1234', painelRota: '/painel/admin' },
  { username: 'spazioandrier', password: 'senha1', painelRota: '/painel/spazioandrier' },
  { username: 'user2', password: 'senha2', painelRota: '/painel/user2' },
  { username: 'joao', password: 'senha123', painelRota: '/painel/joao' }
];

// Middleware para verificar se o usuário está autenticado e autorizado a acessar a rota
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    // Verifica se a rota solicitada corresponde à rota do painel do usuário logado
    if (req.session.user.painelRota === req.path) {
      return next();
    } else {
      // Se o usuário tentar acessar uma rota que não é a dele, redireciona para a rota correta
      return res.redirect(req.session.user.painelRota);
    }
  } else {
    res.redirect('/login');
  }
}

// Rota para a página de login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Rota para processar o login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Verifica se o usuário existe na lista
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    // Armazena informações do usuário na sessão
    req.session.user = { username: user.username, painelRota: user.painelRota };
    res.redirect(user.painelRota);
  } else {
    res.send('Usuário ou senha incorretos.');
  }
});

// Rota para logout
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send('Erro ao sair.');
    }
    res.redirect('/login');
  });
});

// Rotas específicas para cada painel (protegidas com o middleware isAuthenticated)
app.get('/painel/admin', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'paineladmin.html'));
});

app.get('/painel/spazioandrier', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'painelspazioandrier.html'));
});

app.get('/painel/user2', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'paineluser2.html'));
});

app.get('/painel/joao', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'paineljoao.html'));
});

// Configuração do servidor
app.listen(port, () => {
  console.log(`Está funcionando na porta ${port}`);
});
