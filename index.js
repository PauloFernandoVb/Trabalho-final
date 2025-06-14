import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";

const host = "0.0.0.0";
const port = 5500;
const app = express();

let listaUsuarios = [];
let listaProdutos = [];

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/login", (req, res) => {
    res.send(`
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <title>Login</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body { background-color: #121212; color: #eee; }
                ::placeholder { color: #bbb; opacity: 1; }
            </style>
        </head>
        <body class="d-flex justify-content-center align-items-center vh-100">
            <div class="card bg-secondary text-light" style="width: 360px;">
                <div class="card-header bg-dark text-center">
                    <h4>Login</h4>
                </div>
                <div class="card-body">
                    <form method="POST" action="/login" novalidate>
                        <div class="mb-3">
                            <label for="usuario" class="form-label">Usuário</label>
                            <input type="text" class="form-control bg-dark text-light border-light" id="usuario" name="usuario" placeholder="Digite seu usuário" required>
                        </div>
                        <div class="mb-3">
                            <label for="senha" class="form-label">Senha</label>
                            <input type="password" class="form-control bg-dark text-light border-light" id="senha" name="senha" placeholder="Digite sua senha" required>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Entrar</button>
                    </form>
                </div>
            </div>
        </body>
        </html>
    `);
});

app.post("/login", (req, res) => {
    const { usuario, senha } = req.body;
    if (usuario === "admin" && senha === "123") {
        req.session.logado = true;
        req.session.usuarioNome = usuario;
        res.cookie("ultimoLogin", new Date().toLocaleString(), { maxAge: 1000 * 60 * 60 * 24 * 30 });
        res.redirect("/");
    } else {
        res.send(`
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <title>Erro no Login</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
                <style> body { background-color: #121212; color: #f44336; } </style>
            </head>
            <body class="d-flex flex-column justify-content-center align-items-center vh-100">
                <h3>Usuário ou senha inválidos.</h3>
                <a href="/login" class="btn btn-outline-light mt-3">Tentar novamente</a>
            </body>
            </html>
        `);
    }
});

app.listen(port, host, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});