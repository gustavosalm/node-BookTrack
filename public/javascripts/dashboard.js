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

        tabelaLivros.innerHTML = '';
        data.forEach((livro) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${livro.titulo}</td>
                <td>${livro.autor || '- -'}</td>
                <td>${livro.status}</td>
                <td>${livro.avaliacao || '- -'}</td>
                <td>${livro.data_conclusao || '- -'}</td>
                <td><button title="Editar livro" class="edit_button" onclick='editarLivro(${JSON.stringify(livro)})'></button></td>
                <td><button title="Excluir livro" class="delete_button" onclick='deletarLivro(${livro.id})'></button></td>
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

async function deletarLivro(livro_id) {
    const response = await fetch('http://localhost:3000/books', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({livro_id})
    });

    if (response.ok) {
        carregarLivros();
    }
}

function editarLivro(livro) {
    console.log(livro);
    overlay.classList.remove('hidden');

    document.getElementById('overlay_title').innerText = 'Editar Livro';
    document.getElementById('livro_titulo').value = livro.titulo;
    document.getElementById('livro_autor').value = livro.autor || '';
    document.getElementById('livro_status').value = livro.status;
    document.getElementById('livro_avaliacao').value = livro.avaliacao || '';
    document.getElementById('livro_data_conclusao').innerText = `Data de Conclusão: ${livro.data_conclusao || ''}`;
    
    document.getElementById('create_book_button').classList.add('hidden');
}

function criarLivroStart() {
    overlay.classList.remove('hidden');

    document.getElementById('overlay_title').innerText = 'Adicionar Livro';
    document.getElementById('livro_titulo').value = '';
    document.getElementById('livro_autor').value = '';
    document.getElementById('livro_status').value = '';
    document.getElementById('livro_avaliacao').value = '';
    document.getElementById('livro_data_conclusao').innerText = '';

    document.getElementById('create_book_button').classList.remove('hidden');
}

async function criarLivro() {
    const titulo = document.getElementById('livro_titulo').value;
    const autor = document.getElementById('livro_autor').value;
    const status = document.getElementById('livro_status').value;
    const avaliacao = document.getElementById('livro_avaliacao').value;

    const livro = {
        titulo,
        autor: (autor === '') ? undefined : autor,
        status: (status === '') ? undefined : status,
        avaliacao: (avaliacao === '') ? undefined : avaliacao
    }

    console.log(livro);

    const response = await fetch('http://localhost:3000/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(livro)
    });

    const data = await response.json();
    if (data.sucess) {
        carregarLivros();
    }

    closeOverlay()
}

function closeOverlay() {
    overlay.classList.add('hidden');
}

carregarHeader();
carregarLivros();