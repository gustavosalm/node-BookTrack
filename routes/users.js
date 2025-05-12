var express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const jwt = require('jsonwebtoken');

// Lembrar de por em um .env
const SECRET = "chave";

var router = express.Router();

router.get('/', function(req, res, next) {
  db.all('SELECT id, nome, email FROM usuarios', [], (err, rows) => {
    if (err) {
      return res.status(500).send(`fetch users error: ${err.message}`);
    }
    res.json(rows);
  });
});

router.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;
  const passwordHash = await bcrypt.hash(senha, 12);

  if (!nome || nome.length < 3 || !email || !senha) {
    return res.status(400).json({ error: "Dados inválidos." });
  }

  db.run(`INSERT INTO usuarios (nome, email, senha)
          VALUES (?, ?, ?)`,
      [nome, email, passwordHash],
      function(err) {
          if (err) {
              return res.status(400).json({ error: err.message });
          }
          res.status(201).json({ sucess: true, id: this.lastID });
      });
});

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  db.get(
    `SELECT * FROM usuarios WHERE email = ?`,
    [email],
    async function(err, user) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      if (!user){
        return res.status(400).json({ error: "Email ou senha inválidos." });
      }

      const valid = await bcrypt.compare(senha, user.senha);
      if (!valid)
        return res.status(400).json({ error: 'E-mail ou senha inválidos' });
      
      const token = jwt.sign({ id: user.id, name: user.nome, email: user.email }, SECRET, { expiresIn: '1d' });
      res.status(200).json({ success: true, token });
    }
  )
})

router.delete('/', async (req, res) => {
  const { usuario_id } = req.body;

  db.run('PRAGMA foreign_keys = ON');

  db.run(
    `DELETE FROM usuarios WHERE id=?`,
    [usuario_id],
    function(err) {
      if (err) {
        return res.status(400).json({error: err.message });
      }
      res.status(204).json({ success: true });
    }
  );
})

module.exports = router;
