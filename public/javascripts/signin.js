document.getElementById('signInForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const mensagem = document.getElementById('mensagem');

    // Realiza o login e redireciona para o dashboard se bem sucedido
    try {
        const response = await fetch('http://localhost:3000/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            mensagem.textContent = "Login realizado com sucesso";
            mensagem.classList.remove('text_danger');
            mensagem.classList.add('text_success');

            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1000);
        } else {
            mensagem.textContent = data.error || 'Erro no login.';
        }
    } catch (err) {
        mensagem.textContent = 'Erro ao conectar com o servidor.';
    }
});