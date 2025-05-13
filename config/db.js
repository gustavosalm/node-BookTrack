const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../booktrack.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('SQLite3 connection failed:', err.message);
  } else {
    console.log('SQLite3 connected successfully.');
  }
});

// Tabela de Usuário
db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL CHECK (LENGTH(nome) >= 3),
      email TEXT NOT NULL UNIQUE CHECK (email LIKE '%@%.%'),
      senha TEXT
    )
`);

// Tabela de Livros
db.run(`
  CREATE TABLE IF NOT EXISTS livros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL CHECK (LENGTH(titulo) BETWEEN 3 AND 100),
    autor TEXT,
    status TEXT NOT NULL CHECK (status IN ('Quero Ler', 'Lendo', 'Lido')),
    avaliacao INTEGER CHECK (avaliacao BETWEEN 1 AND 5),
    data_conclusao DATE,
    usuario_id INTEGER NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
  )
`);

module.exports = db;