# 📚 Book Track

Este é um projeto de API REST em **Node.js + Express** com **SQLite3**, e com autenticação via **JWT**.

---

## 🚀 Como rodar o projeto localmente

### 1. Clone o repositório

```bash
git clone https://github.com/gustavosalm/node-BookTrack.git
cd node-BookTrack
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Crie um .env
É necessário que um .env seja criado e configurado com um valor para **KEY**. É utilizado na geração e autorização de tokens JWT.
```env
KEY="sua_chave"
```

### 4. Inicie o servidor

```bash
node app.js
```
O link do servidor será exibido no terminal, e as principais funções da API podem ser utilizadas pela interface web.

---

## 🚀 Como testar com o Postman
Primeiramente, baixe e execute o Postman Desktop Agent.

Em seguida, importe no Postman a [a coleção](BookTrack.postman_collection.json) fornecida neste repositório.
As requisições foram postas para serem executadas em ordem em nome de observar todas as principais requisições presentes na API, mas sinta-se livre para testar requisições novas.

Outro ponto importante é que as requisições da tabela de livros requerem em seu header um token JWT. Este token é gerado e retornado ao realizar o login/cadastro de usuário.

Salve este token e o coloque no header das requisições da tabela de livros sob a **Key** Authorization e **Value** Bearer *<seu_token>*.

