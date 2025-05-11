var express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/db');

var router = express.Router();

router.get('/', function(req, res, next) {
  db.all('SELECT id, nome, email FROM usuarios', [], (err, rows) => {
    if (err) {
      return res.status(500).send(`fetch users error: ${err.message}`);
    }
    res.json(rows);
  });
});

router.post('/', async (req, res) => {
  const { nome, email, senha } = req.body;
  const passwordHash = await bcrypt.hash(senha, 10);

  db.run(`INSERT INTO usuarios (nome, email, senha)
          VALUES (?, ?, ?)`,
      [nome, email, passwordHash],
      function(err) {
          if (err) {
              return res.status(400).json({ error: err.message });
          }
          res.status(201).json({ sucess: true });
      });
});

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
