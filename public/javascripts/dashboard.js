const token = localStorage.getItem('token');

const tabelaLivros = document.getElementById('tabela-livros');

if (!token) {
    window.location.href = '/login';
}

async function carregarLivros() {
    try {
        // Trocar para Autorization por token !!
        const response = await fetch('http://localhost:3000/books?usuario_id=13', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                window.location.href = '/login.html';
            } else {
                console.log(data.error || 'Erro ao carregar livros.');
            }

            return;
        }

        if (data.length === 0) {
            tabelaLivros.innerHTML = '<tr><td colspan="5">Nenhum livro cadastrado.</td></tr>';
            return;
        }

        data.forEach(livro => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${livro.titulo}</td>
                <td>${livro.autor || '- -'}</td>
                <td>${livro.status}</td>
                <td>${livro.avaliacao || '- -'}</td>
                <td>${livro.data_conclusao || '- -'}</td>
            `;
            tabelaLivros.appendChild(tr);
        });
    } catch (err) {
        console.log(err.message)
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
}

carregarLivros();