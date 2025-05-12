document.getElementById('signUpForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const nome = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const mensagem = document.getElementById('mensagem');

    try {
        const response = await fetch('http://localhost:3000/users/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha })
        });

        const data = await response.json();

        if (response.ok) {
            // localStorage.setItem('token', data.token);
            mensagem.textContent = "Usuário criado com sucesso";
            mensagem.classList.remove('text_danger');
            mensagem.classList.add('text_success');

            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1000);
        } else {
            mensagem.textContent = data.error || 'Erro no cadastro.';
        }
    } catch (err) {
        mensagem.textContent = 'Erro ao conectar com o servidor.';
    }
});