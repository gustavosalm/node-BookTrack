const token = localStorage.getItem('token');

const tabelaLivros = document.getElementById('tabela-livros');
const overlay = document.getElementById('overlay');
const username = document.getElementById('username');

if (!token) {
    window.location.href = '/login';
}

async function carregarHeader() {
    const response = await fetch('http://localhost:3000/users/currentUser', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
    });

    const data = await response.json();
    username.innerText = data.name;
}

async function carregarLivros() {
    try {
        const response = await fetch('http://localhost:3000/books', {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            } else {
                console.log(data.error || 'Erro ao carregar livros.');
            }

            return;
        }

        if (data.length === 0) {
            tabelaLivros.innerHTML = '<tr><td colspan="5">Nenhum livro cadastrado.</td></tr>';
            return;
        }

        data.forEach((livro) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${livro.titulo}</td>
                <td>${livro.autor || '- -'}</td>
                <td>${livro.status}</td>
                <td>${livro.avaliacao || '- -'}</td>
                <td>${livro.data_conclusao || '- -'}</td>
                <td><button title="Editar livro" class="edit_button" onclick='editBook(${JSON.stringify(livro)})'></button></td>
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

function editBook(livro) {
    overlay.classList.remove('hidden');

    document.getElementById('livro_titulo').value = livro.titulo;
    document.getElementById('livro_autor').value = livro.autor || '';
    document.getElementById('livro_status').value = livro.status;
    document.getElementById('livro_avaliacao').value = livro.avaliacao || '';
    document.getElementById('livro_data_conclusao').innerText = livro.data_conclusao || '';
}

function closeOverlay() {
    overlay.classList.add('hidden');
}

carregarHeader();
carregarLivros();