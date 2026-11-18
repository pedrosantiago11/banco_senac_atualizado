// 1. Dados em Memória
const clientes = [
    { cpf: "111.222.333-44", senha: "123", nome: "Dennis Lopes", saldo: 5000 },
    { cpf: "222.333.444-55", senha: "123", nome: "Nicolas Silva", saldo: 1500 },
    { cpf: "333.444.555-66", senha: "123", nome: "Ana Maria", saldo: 3000 },
    { cpf: "444.555.666-77", senha: "123", nome: "Bruno Costa", saldo: 500 },
    { cpf: "555.666.777-88", senha: "123", nome: "Carla Souza", saldo: 10000 }
];

let usuarioLogado = null;

// 2. Seleção de Elementos (DOM)
const secaoLogin = document.querySelector('#login-section');
const secaoCadastro = document.querySelector('#cadastro-section');
const secaoSucesso = document.querySelector('#sucesso-section');
const secaoPainel = document.querySelector('#painel-section');

const campoSaldo = document.querySelector('#saldo-valor');
const boasVindas = document.querySelector('#boas-vindas');
const loginErro = document.querySelector('#login-erro');

// 3. Alternância entre Telas (Login <-> Cadastro)
document.querySelector('#link-ir-cadastro').addEventListener('click', (e) => {
    e.preventDefault();
    secaoLogin.style.display = 'none';
    secaoCadastro.style.display = 'block';
});

document.querySelector('#link-voltar-login').addEventListener('click', (e) => {
    e.preventDefault();
    secaoCadastro.style.display = 'none';
    secaoLogin.style.display = 'block';
});

// 4. Eventos de Login
document.querySelector('#btn-login').addEventListener('click', () => {
    const cpfDigitado = document.querySelector('#input-cpf').value.trim();
    const senhaDigitada = document.querySelector('#input-senha').value.trim();

    const clienteEncontrado = clientes.find(c => c.cpf === cpfDigitado && c.senha === senhaDigitada);

    if (clienteEncontrado) {
        usuarioLogado = clienteEncontrado;
        loginErro.style.display = 'none';
        secaoLogin.style.display = 'none';
        secaoPainel.style.display = 'block';

        campoSaldo.textContent = `R$ ${usuarioLogado.saldo.toFixed(2)}`;
        boasVindas.textContent = `Olá, ${usuarioLogado.nome}`;
    } else {
        loginErro.style.display = 'block';
    }
});

// 5. Lógica de Submissão de Cadastro com validação por Regex e integração com a API
const formularioCadastro = document.querySelector('#form-cadastro');
const cadastroErro = document.querySelector('#cadastro-erro');

formularioCadastro.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.querySelector('#cad-nome');
    const cpf = document.querySelector('#cad-cpf');
    const email = document.querySelector('#cad-email');
    const celular = document.querySelector('#cad-celular');
    const cep = document.querySelector('#cad-cep');
    const endereco = document.querySelector('#cad-endereco');
    const cidade = document.querySelector('#cad-cidade');
    const estado = document.querySelector('#cad-estado');
    const senha = document.querySelector('#cad-senha');
    const confirmaSenha = document.querySelector('#cad-confirma-senha');

    const validacoes = [
        {
            campo: nome,
            regex: /^\p{L}+(?:\s+\p{L}+)+$/u,
            mensagem: 'Informe o nome completo, com pelo menos nome e sobrenome.'
        },
        {
            campo: cpf,
            regex: /^(?:\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})$/,
            mensagem: 'Informe um CPF válido com 11 dígitos, com ou sem pontuação.'
        },
        {
            campo: email,
            regex: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
            mensagem: 'Informe um endereço de e-mail válido.'
        },
        {
            campo: celular,
            regex: /^(?:\(\d{2}\)\s?|\d{2})\d{5}-?\d{4}$/,
            mensagem: 'Informe um celular com DDD e 11 dígitos.'
        },
        {
            campo: cep,
            regex: /^(?:\d{8}|\d{5}-\d{3})$/,
            mensagem: 'Informe um CEP válido com 8 dígitos, com ou sem hífen.'
        },
        {
            campo: senha,
            regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
            mensagem: 'A senha deve ter no mínimo 8 caracteres, incluindo letra maiúscula, minúscula e número.'
        }
    ];

    cadastroErro.textContent = '';
    cadastroErro.style.display = 'none';

    for (const validacao of validacoes) {
        if (!validacao.regex.test(validacao.campo.value.trim())) {
            cadastroErro.textContent = validacao.mensagem;
            cadastroErro.style.display = 'block';
            validacao.campo.focus();
            return;
        }
    }

    if (confirmaSenha.value !== senha.value) {
        cadastroErro.textContent = 'A confirmação deve ser exatamente igual à senha informada.';
        cadastroErro.style.display = 'block';
        confirmaSenha.focus();
        return;
    }

    const dadosCadastro = {
        nome: nome.value.trim(),
        cpf: cpf.value.trim(),
        email: email.value.trim(),
        celular: celular.value.trim(),
        cep: cep.value.trim(),
        endereco: endereco.value.trim(),
        cidade: cidade.value.trim(),
        estado: estado.value.trim(),
        senha: senha.value
    };

    const botaoCadastrar = document.querySelector('#btn-cadastrar');
    botaoCadastrar.disabled = true;
    botaoCadastrar.textContent = 'Enviando...';

    try {
        const resposta = await fetch('https://senac-bank-api.dennislopes.com.br/api/clientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosCadastro)
        });

        const resultado = await resposta.json().catch(() => ({}));

        if (!resposta.ok) {
            throw new Error(resultado.message || resultado.mensagem || 'Não foi possível concluir o cadastro. Verifique os dados e tente novamente.');
        }

        secaoCadastro.style.display = 'none';
        secaoSucesso.style.display = 'block';
    } catch (erro) {
        cadastroErro.textContent = erro.message || 'Ocorreu um erro ao enviar o cadastro. Tente novamente.';
        cadastroErro.style.display = 'block';
    } finally {
        botaoCadastrar.disabled = false;
        botaoCadastrar.textContent = 'Concluir Registo';
    }
});

// 6. Botão para voltar ao início a partir da tela de sucesso
document.querySelector('#btn-voltar-inicio').addEventListener('click', () => {
    location.reload();
});

// 7. Operações Bancárias (Espaço reservado para as próximas aulas / API)
document.querySelector('#btn-depositar').addEventListener('click', () => { });
document.querySelector('#btn-sacar').addEventListener('click', () => { });
document.querySelector('#btn-transferir').addEventListener('click', () => { });

document.querySelector('#btn-sair').addEventListener('click', () => {
    location.reload();
});