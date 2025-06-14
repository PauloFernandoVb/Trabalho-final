import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";

const host = "0.0.0.0";
const port = 5500;
const app = express();

let listaEquipes = [];
let listaJogadores = [];

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: "NovaChaveSegura123",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 15,
        httpOnly: true,
        secure: false
    }
}));

function verificarAutenticacao(req, res, next) {
    if (req.session.logado) {
        next();
    } else {
        res.send(`
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <title>Acesso Negado</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body class="bg-dark text-light d-flex justify-content-center align-items-center vh-100">
                <div class="text-center">
                    <h3>Faça o login para se inscrever no Campeonato</h3>
                    <a href="/login" class="btn btn-primary mt-3">Ir para Login</a>
                </div>
            </body>
            </html>
        `);
    }
}
app.use(express.static("public"));

app.get("/", verificarAutenticacao, (req, res) => {
    const ultimoLogin = req.cookies.ultimoLogin;
    res.send(`
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .container-fundo {
            background-image: url('/img/volei.jpg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            padding: 40px;
            border-radius: 10px;
        }
        .container-fundo h2,
        .container-fundo h4 {
            background-color: rgba(0, 0, 0, 0.6);
            padding: 10px;
            border-radius: 5px;
        }
        .nav-link {
        font-weight: bold;
        font-family: 18px;
        }
    </style>
</head>
<body class="bg-dark text-light">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">1º Campeonato Amador de Voleibol</a>
            <div class="collapse navbar-collapse">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item"><a class="nav-link text-light" href="/cadastroEquipes">Cadastrar equipe</a></li>
                    <li class="nav-item"><a class="nav-link text-light" href="/cadastroJogador">Cadastrar Jogadores</a></li>
                </ul>
                <span class="navbar-text me-3">
                    Usuário: <strong>${req.session.usuarioNome || "Desconhecido"}</strong>
                </span>
                <span class="navbar-text me-3">
                    Último acesso: ${ultimoLogin ? ultimoLogin : "N/D"}
                </span>
                <a href="/logout" class="btn btn-outline-light">Sair</a>
            </div>
        </div>
    </nav>

    <div class="container container-fundo mt-4">
        <h2>1º Campeonato de Vôlei Amador</h2>
        <h4>É com grande entusiasmo que anunciamos o 1º Campeonato de Vôlei Amador da nossa comunidade!
        Mais do que uma competição, este campeonato é uma celebração do esporte, da amizade e do espírito de equipe. Criamos este evento com o objetivo de reunir amantes do vôlei, valorizar talentos locais e proporcionar um ambiente saudável, competitivo e, acima de tudo, divertido para todos os participantes.</h4>
        <br>
        <h4>🏆 Categorias: Masculino, Feminino e Misto</h4>
        <h4>📍 Local: Ginásio Municipal Presidente Prudente</h4>
        <h4>📅 Data: 19/04/2026</h4>
        <h4>🕒 Horário: A partir das 19:00</h4>
        <h4>Se você joga por paixão ou está apenas começando, aqui é o seu lugar. Venha com seu time, traga sua torcida e viva essa experiência com a gente.</h4>
        <h4>Inscrições abertas!</h4>
    </div>
</body>
</html>
    `);
});
app.get("/login", (req, res) => {
    res.send(`
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <title>Login</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body { background-color: #121212; color: #eee; }
                .form-control::placeholder { color: #bbb !important;opacity: 1 !important;}
            </style>
        </head>
        <body class="bg-dark text-light m-0">
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark border-bottom     border-secondary fixed-top">
                <div class="container-fluid">
                 <a class="navbar-brand" href="#">1º Campeonato Amador de Voleibol</a>
                </div>
            </nav>
            <div class="d-flex justify-content-center align-items-center" style="min-height: 100vh; padding-top: 70px;" >
                    <div class="card bg-secondary text-light" style="width: 360px;">
                        <div class="card-header bg-dark text-center">
                            <h4>Login</h4>
                        </div>
                <div class="card-body">
                    <form method="POST" action="/login" novalidate>
                        <div class="mb-3">
                            <label for="usuario" class="form-label">Usuário</label>
                            <input type="text" class="form-control bg-dark text-light border-light" id="usuario" name="usuario" placeholder="Digite seu usuário : admin" required>
                        </div>
                            <div class="mb-3">
                                <label for="senha" class="form-label">Senha</label>
                                <input type="password" class="form-control bg-dark text-light border-light" id="senha" name="senha" placeholder="Digite sua senha : 123" required>
                            </div>
                            <button type="submit" class="btn btn-primary w-100">Entrar</button>
                        </form>
                    </div>
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
app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

app.get("/cadastroEquipes", verificarAutenticacao, (req, res) => {
    res.send(`
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Cadastro de Equipes</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {background-color: #121212;color: #eee;}
        .form-control::placeholder { color: #bbb !important;opacity: 1 !important;}
    </style>
</head>
<body>
    <div class="container mt-5">
        <h3>Cadastro de Equipes</h3>
        <form method="POST" action="/cadastroEquipes" novalidate>
            <div class="mb-3">
                <label class="form-label">Nome da equipe</label>
                <input type="text" name="NomeE" class="form-control bg-dark text-light border-light" placeholder="Digite o nome da equipe" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Nome do Técnico</label>
                <input type="text" name="NomeT" class="form-control bg-dark text-light border-light" placeholder="Digite o Nome do Técnico" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Telefone do técnico</label>
                <input type="tel" name="TelTec" class="form-control bg-dark text-light border-light" placeholder="Digite o Telefone" title="(99)99999-9999" required>
            </div>
            <button type="submit" class="btn btn-primary">Cadastrar Equipe</button>
        </form>
    </div>
</body>
</html>
    `);
});

app.post("/cadastroEquipes", verificarAutenticacao, (req, res) => {
    const { NomeE,NomeT,TelTec } = req.body;
    if (NomeE && NomeT && TelTec) {
        listaEquipes.push({ NomeE, NomeT, TelTec });
        res.redirect("/listaEquipes");
    }
    else {

        let conteudo = `
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Cadastro de Equipes</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {background-color: #121212;color: #eee;}
        .form-control::placeholder { color: #bbb !important;opacity: 1 !important;}
    </style>
</head>
<body>
    <div class="container mt-5">
        <h3>Cadastro de Equipes</h3>
        <form method="POST" action="/cadastroEquipes" novalidate>
            <div class="mb-3">`;
        if (!NomeE) {
            conteudo = conteudo + `
                        <label class="form-label">Nome da equipe</label>
                        <input type="text" name="NomeE" class="form-control bg-dark text-light border-light" placeholder="Digite o nome da equipe" required>
                        <span class="text-danger">Por favor informe o nome da equipe</span>`;
        }
        else {
            conteudo = conteudo + `
                                <label for="nome" class="form-label">Nome da Equipe</label>
                                <input type="text" class="form-control bg-dark text-light border-light" id="NomeE" name="NomeE" value="${NomeE}" placeholder="Digite o nome da equipe" required>
                                `;
        }

        conteudo = conteudo + `</div>
                            <div class="mb-3"> `;
        if (!NomeT) {
            conteudo = conteudo + `
                                    <label for="nometec" class="form-label">Nome do Técnico</label>
                                    <input type="text" class="form-control bg-dark text-light border-light" id="NomeT" name="NomeT" placeholder="Digite o nome do Técnico"  required>                                
                                    <span class="text-danger">Por favor informe o Nome do tecnico</span>`;
        }
        else {
            conteudo = conteudo + `
                                    <label for="nometec" class="form-label">Nome do Técnico</label>
                                    <input type="text" class="form-control bg-dark text-light border-light" id="NomeT" name="NomeT" placeholder="Digite o nome do Técnico" value="${NomeT}" required>
                                    `;
        }

        conteudo = conteudo + `</div>
                            <div class="mb-3"> `;
        if (!TelTec) {
            conteudo = conteudo +
                `<label for="telefone" class="form-label">Telefone do Tecnico</label>
                                     <input type="tel" class="form-control bg-dark text-light border-light" id="telefone" name="TelTec" placeholder="Digite o Telefone do Técnico" required>
                                     <span class="text-danger">Por favor informe a telefone!</span>`;
        }
        else {
            conteudo = conteudo + `
                                <label for="telefone" class="form-label">telefone</label>
                                <input type="text" class="form-control bg-dark text-light border-light" id="telefone" name="TelTec" value="${TelTec}"  required>`;
        }
        conteudo = conteudo + `
                            </div>
                            <div class="md-3">
                                <button class="btn btn-primary" type="submit">Cadastrar</button>
                                <a class="btn btn-secondary" href="/">Voltar</a>
                            </div>
                        </form>
                    </div>
                </body>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>
            </html>`;
        res.send(conteudo);
        res.end();
    }
});
app.get("/listaEquipes", verificarAutenticacao, (req, res) => {
    let tabela = listaEquipes.map(eqp => `<tr>
        <td>${eqp.NomeE}</td><td>${eqp.NomeT}</td><td>${eqp.TelTec}</td><td>
    </tr>`).join("");
    res.send(`
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <title>Lista de Equipes</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>body { background-color: #121212; color: #eee; }</style>
        </head>
        <body>
            <div class="container mt-4">
                <h3>Equipes Cadastrados</h3>
                <table class="table table-striped table-dark">
                    <thead><tr><th>Nome da Equipe</th><th>Nome do Tecnico</th><th>Telefone do tecnico</th></tr></thead>
                    <tbody>${tabela}</tbody>
                </table>
                <a href="/cadastroEquipes" class="btn btn-secondary">Novo Cadastro</a>
                <a href="/" class="btn btn-primary ms-2">Menu</a>
            </div>
        </body>
        </html>
    `);
});

app.get("/listaEquipes", verificarAutenticacao,(req, res) => {
    let conteudo = `
            <html lang="pt-br">
                <head>
                    <meta charset="UTF-8">
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
                    <title>Página inicial</title>
                </head>
                <body>
                    <div class="container w-75 mb-5 mt-5">
                        <table class="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">Nome da Equipe</th>
                                    <th scope="col">Nome do Técnico</th>
                                    <th scope="col">Telefone do técnico</th>
                                </tr>
                            </thead>
                            <tbody> `;
    for (let i = 0; i < listaEquipes.length; i++) {
        conteudo = conteudo + `
                                    <tr>
                                        <td>${listaEquipes[i].NomeE}</td>
                                        <td>${listaEquipes[i].NomeT}</td>
                                        <td>${listaEquipes[i].TelTec}</td>
                                    </tr>
                                `;
    }

    conteudo = conteudo + ` </tbody>
                        </table>
                        <a class="btn btn-secondary" href="/cadastroEquipes">Continuar cadastrando</a>
                    </div>
                </body>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>
            </html>`
    res.send(conteudo);
    res.end();
});


app.get("/cadastroJogador", verificarAutenticacao, (req, res) => {
    let opcoesEquipes = "";

    if (listaEquipes.length > 0) {
        listaEquipes.forEach(equipe => {
            opcoesEquipes += `<option value="${equipe.NomeE}">${equipe.NomeE}</option>`;
        });
    } else {
        opcoesEquipes = `<option disabled selected>Nenhuma equipe cadastrada</option>`;
    }

    res.send(`
        <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <title>Cadastro de Jogadores</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
                    <style>
                        body {background-color: #121212;color: #eee;}
                        .form-control::placeholder { color: #bbb !important;opacity: 1 !important;}
                    </style>
            </head>
            <body>
                <div class="container mt-5">
                    <h3>Cadastro de Jogadores</h3>
                    <form method="POST" action="/cadastroJogador" novalidate>
                        <div class="mb-3">
                            <label class="form-label">Nome do Jogador</label>
                            <input type="text" name="NomeJ" class="form-control bg-dark text-light border-light" placeholder="Digite o seu nome" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Data de nasciemnto</label>
                            <input type="date" name="data" class="form-control bg-dark text-light border-light" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Altura </label>
                            <input type="text" name="altura" class="form-control bg-dark text-light border-light" placeholder="altura em centimetros" title="1.91 " required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Genero</label>
                            <select name="genero" class="form-control bg-dark text-light border-light" required>
                                        <option value=""disabled selected>Selecione</option>
                                        <option value="masc">Masculino</option>
                                        <option value="fem">Feminino</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Posição</label>
                            <input type="text" name="posi" class="form-control bg-dark text-light border-light" placeholder="libero, atacante ..." required>
                        </div>
                    <div class="mb-3">
                        <label class="form-label">Equipe</label>
                        <select name="equipe" class="form-control bg-dark text-light border-light" required>
                                    <option value=""disabled selected>Selecione</option>
                                        ${opcoesEquipes}
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">Cadastrar Jogador</button>
                    </form>
            </div>
        </body>
</html>
    `);
});
app.post("/cadastroJogador", verificarAutenticacao, (req, res) => {
    const { NomeJ, data, altura, genero, posi, equipe } = req.body;

    if (NomeJ && data && altura && genero && posi && equipe) {
        listaJogadores.push({ NomeJ, data, altura, genero, posi, equipe });
        res.redirect("/listaJogadores");
    } else {
        let conteudo = `
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <title>Cadastro de Jogadores</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body {background-color: #121212;color: #eee;}
                .form-control::placeholder { color: #bbb !important;opacity: 1 !important;}
            </style>
        </head>
        <body>
            <div class="container mt-5">
                <h3>Cadastro de Jogadores</h3>
                <form method="POST" action="/cadastroJogador" novalidate>
        `;
        conteudo += `<div class="mb-3">`;
        if (!NomeJ) {
            conteudo += `
                <label class="form-label">Nome do Jogador</label>
                <input type="text" name="NomeJ" class="form-control bg-dark text-light border-light" placeholder="Digite o seu nome" required>
                <span class="text-danger">Informe o nome do jogador</span>`;
        } else {
            conteudo += `
                <label class="form-label">Nome do Jogador</label>
                <input type="text" name="NomeJ" class="form-control bg-dark text-light border-light" value="${NomeJ}" required>`;
        }
        conteudo += `</div>`;
        conteudo += `<div class="mb-3">`;
        if (!data) {
            conteudo += `
                <label class="form-label">Data de nascimento</label>
                <input type="date" name="data" class="form-control bg-dark text-light border-light" required>
                <span class="text-danger">Informe a data de nascimento</span>`;
        } else {
            conteudo += `
                <label class="form-label">Data de nascimento</label>
                <input type="date" name="data" class="form-control bg-dark text-light border-light" value="${data}" required>`;
        }
        conteudo += `</div>`;
        conteudo += `<div class="mb-3">`;
        if (!altura) {
            conteudo += `
                <label class="form-label">Altura</label>
                <input type="text" name="altura" class="form-control bg-dark text-light border-light" placeholder="altura em centimetros" required>
                <span class="text-danger">Informe a altura</span>`;
        } else {
            conteudo += `
                <label class="form-label">Altura</label>
                <input type="text" name="altura" class="form-control bg-dark text-light border-light" value="${altura}" required>`;
        }
        conteudo += `</div>`;
        conteudo += `<div class="mb-3">
            <label class="form-label">Gênero</label>
            <select name="genero" class="form-control bg-dark text-light border-light" required>`;
        if (!genero) {
            conteudo += `<option value="" disabled selected>Selecione</option>`;
        }
        conteudo += `
                <option value="masc" ${genero === "masc" ? "selected" : ""}>Masculino</option>
                <option value="fem" ${genero === "fem" ? "selected" : ""}>Feminino</option>
            </select>`;
        if (!genero) conteudo += `<span class="text-danger">Informe o gênero</span>`;
        conteudo += `</div>`;
        conteudo += `<div class="mb-3">`;
        if (!posi) {
            conteudo += `
                <label class="form-label">Posição</label>
                <input type="text" name="posi" class="form-control bg-dark text-light border-light" placeholder="libero, atacante ..." required>
                <span class="text-danger">Informe a posição</span>`;
        } else {
            conteudo += `
                <label class="form-label">Posição</label>
                <input type="text" name="posi" class="form-control bg-dark text-light border-light" value="${posi}" required>`;
        }
        conteudo += `</div>`;
        conteudo += `<div class="mb-3">
            <label class="form-label">Equipe</label>
            <select name="equipe" class="form-control bg-dark text-light border-light" required>`;
        if (!equipe) {
            conteudo += `<option value="" disabled selected>Selecione</option>`;
        }
        conteudo += `
                <option value="masc" ${equipe === "masc" ? "selected" : ""}>Equipe A</option>
                <option value="fem" ${equipe === "fem" ? "selected" : ""}>Equipe B</option>
            </select>`;
        if (!equipe) conteudo += `<span class="text-danger">Informe a equipe</span>`;
        conteudo += `</div>`;
        conteudo += `
            <div class="mb-3">
                <button type="submit" class="btn btn-primary">Cadastrar Jogador</button>
                <a class="btn btn-secondary" href="/">Voltar</a>
            </div>
        </form>
    </div>
</body>
</html>`;

        res.send(conteudo);
        res.end();
    }
});

app.get("/listaJogadores", verificarAutenticacao, (req, res) => {
    let grupos = {};

  for (let i = 0; i < listaJogadores.length; i++) {
    const jogador = listaJogadores[i];
    if (!grupos[jogador.equipe]) {
        grupos[jogador.equipe] = [];
    }
    grupos[jogador.equipe].push(jogador);
}


    let conteudo = `
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <title>Lista de Jogadores</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
            body { background-color: #121212; color: #eee; }
        </style>
            </head>
                <body>
                    <div class="container mt-4">
                        <h3>Jogadores Cadastrados por Equipe</h3>`;

for (const equipe in grupos) {
    conteudo += `
        <h5 class="mt-4">${equipe}</h5>
        <table class="table table-dark table-striped">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Data de Nascimento</th>
                    <th>Altura</th>
                    <th>Gênero</th>
                    <th>Posição</th>
                </tr>
            </thead>
            <tbody>`;

    const jogadores = grupos[equipe];
    for (let i = 0; i < jogadores.length; i++) {
        const j = jogadores[i];
        conteudo += `
                <tr>
                    <td>${j.NomeJ}</td>
                    <td>${j.data}</td>
                    <td>${j.altura}</td>
                    <td>${j.genero}</td>
                    <td>${j.posi}</td>
                </tr>`;
    }

    conteudo += `</tbody></table>`;
}

    conteudo += `
        <a href="/cadastroJogador" class="btn btn-secondary mt-3">Novo Cadastro</a>
        <a href="/" class="btn btn-primary mt-3 ms-2">Menu</a>
        </div>
    </body>
    </html>
    `;

    res.send(conteudo);
});


app.listen(port, host, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});