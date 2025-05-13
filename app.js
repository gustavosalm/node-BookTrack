var cookieParser = require('cookie-parser');
var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var path = require('path');

var usersRouter = require('./routes/users');
var booksRouter = require('./routes/books');

var app = express();
const port = 3000

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Rotas da API de usuários e livro
app.use('/users', usersRouter);
app.use('/books', booksRouter);

// Exibe a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Exibe a página do dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

// Exibe a página do login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.use(function(req, res, next) {
  next(createError(404));
});

// Exibe a tela de erro
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.sendFile(path.join(__dirname, 'views', 'error.html'));
});

module.exports = app;

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`)
})
