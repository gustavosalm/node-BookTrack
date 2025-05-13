var express = require('express');
const db = require('../config/db');

var router = express.Router();
const autenticate = require('../middleware/auth');

// Pega a lista de livros do usuário logado atualmente
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

// Exporta em um arquivo .json a lista de livros do usuário logado atualmente
router.get('/export', autenticate, function(req, res) {
    const { id } = req.usuario;

    db.all(`SELECT * FROM livros WHERE usuario_id = ? ORDER BY id
    `, [id], (err, rows) => {
        if (err) {
            return res.status(500).send(`fetch users error: ${err.message}`);
        }

        res.setHeader('Content-Disposition', 'attachment; filename=livros.json');
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(rows, null, 2));
    });
});

// Cria um novo livro para o usuário logado atualmente
router.post('/', autenticate, async (req, res) => {
    const { titulo, autor, status, avaliacao } = req.body;
    const { id } = req.usuario;

    if (status === "Lido")
        data_conclusao = new Date().toISOString().split("T")[0];
    else if (avaliacao)
        return res.status(400).json({ error: "Só é possível avaliar livros com status 'Lido'." });

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

// Deleta um livro do usuário logado atualmente
router.delete('/', autenticate, async (req, res) => {
    const { livro_id } = req.body;
    const { id } = req.usuario;
    
    db.get(
        'SELECT * FROM livros WHERE id = ?',
        [livro_id],
        function(err, livro) {
            if (err) {
                return res.status(400).json({error: err.message });
            }
            if (!livro) {
                return res.status(404).json({error: 'Livro não encontrado' });
            }
            if (livro.usuario_id !== id) {
                return res.status(403).json({error: 'Você não tem permissão para excluir este livro' });
            }

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
        }
    )
});

// Edita os dados de um livro
router.put('/edit', autenticate, async (req, res) => {
    const { livro_id, titulo, autor, status, avaliacao } = req.body;
    const { id } = req.usuario;
    let data = null;

    if (status === "Lido")
        data = new Date().toISOString().split("T")[0];
    else if (avaliacao)
        return res.status(400).json({ error: "Só é possível avaliar livros com status 'Lido'." }); 

    db.get(
        'SELECT * FROM livros WHERE id = ?',
        [livro_id],
        function(err, livro) {
            if (err) {
                return res.status(400).json({error: err.message });
            }
            if (!livro) {
                return res.status(404).json({error: 'Livro não encontrado' });
            }
            if (livro.usuario_id !== id) {
                return res.status(403).json({error: 'Você não tem permissão para editar este livro' });
            }
            if (livro.status === 'Lido') {
                return res.status(403).json({error: 'Esse livro não pode ser editado.' });              
            }

            db.run(
                `UPDATE livros
                 SET titulo = ?, autor = ?, status = ?, avaliacao = ?, data_conclusao = ?
                 WHERE id = ?`,
                [titulo, autor, status, avaliacao, data, livro_id],
                function(err) {
                    if (err) {
                        return res.status(400).json({ error: err.message });
                    }
                    res.status(200).json({ sucess: true });
                }
            )
        }
    )
});

module.exports = router;
