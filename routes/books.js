var express = require('express');
const db = require('../config/db');

var router = express.Router();
const autenticate = require('../middleware/auth');

router.get('/', autenticate, function(req, res) {
    const { id } = req.usuario;

    db.all(`SELECT * FROM livros WHERE usuario_id = ? ORDER BY id
    `, [id], (err, rows) => {
        if (err) {
            return res.status(500).send(`fetch users error: ${err.message}`);
        }
        res.json(rows);
    });
});

router.post('/', autenticate, async (req, res) => {
    const { titulo, autor, status, avaliacao, data_conclusao } = req.body;
    const { id } = req.usuario;

    db.run(`INSERT INTO livros (titulo, autor, status, avaliacao, data_conclusao, usuario_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [titulo, autor, status, avaliacao, data_conclusao, id],
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
});

router.delete('/', async (req, res) => {
    const { livro_id } = req.body;

    db.run(
        `DELETE FROM livros WHERE id=?`,
        [livro_id],
        function(err) {
            if (err) {
                return res.status(400).json({error: err.message });
            }
            res.status(204).json({ success: true });
        }
    );
});

router.put('/grade', async (req, res) => {
    const { livro_id, nota } = req.body;

    db.get(
        `SELECT status FROM livros WHERE id = ?`,
        [livro_id], 
        (err, row) => {
            if (err)
                return res.status(400).json({ error: "Erro ao buscar livro." });

            if (row.status !== "Lido")
                return res.status(400).json({ error: "Só é possível avaliar livros com status 'Lido'." });

            db.run(
                `UPDATE livros SET avaliacao = ? WHERE id = ?`,
                [nota, livro_id],
                function (err) {
                    if (err)
                        return res.status(500).json({ error: "Erro ao atualizar a avaliação." });
                    res.json({ message: "Avaliação atualizada com sucesso." });
                }
            );
        }
    );
});

module.exports = router;
