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

router.put('/status', async (req, res) => {
    const { livro_id, status } = req.body;
    let data = null;

    if (status === "Lido")
        data = new Date().toISOString().split("T")[0];

    db.run(
        `UPDATE livros
         SET status = ?, data_conclusao = ?
         WHERE id = ?`,
        [status, data, livro_id],
        function(err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.status(200).json({ sucess: true });
        }
    )
})

module.exports = router;
