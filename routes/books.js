var express = require('express');
const db = require('../config/db');

var router = express.Router();

router.get('/', function(req, res, next) {
    const { usuario_id } = req.query;
    db.all(`SELECT * FROM livros WHERE usuario_id = ? ORDER BY id
    `, [usuario_id], (err, rows) => {
        if (err) {
            return res.status(500).send(`fetch users error: ${err.message}`);
        }
        res.json(rows);
    });
});

router.post('/', async (req, res) => {
  const { titulo, autor, status, avaliacao, data_conclusao, usuario_id } = req.body;

    db.run(`INSERT INTO livros (titulo, autor, status, avaliacao, data_conclusao, usuario_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [titulo, autor, status, avaliacao, data_conclusao, usuario_id],
        function(err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.status(201).json({ sucess: true });
        });
});

module.exports = router;
