const http = require("node:http");
const { cifrar, decifrar, decifrarForcaBruta } = require("./cifra");
const { especificacao, paginaSwagger } = require("./swagger");

const rotasPost = ["/cifrar", "/decifrar", "/decifrarForcaBruta"];

function responder(res, status, dados) {
    res.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8"
    });
    res.end(JSON.stringify(dados));
}

const servidor = http.createServer(async (req, res) => {
    const rota = req.url;

    if (req.method === "GET" && rota === "/swagger.json") {
        return responder(res, 200, especificacao);
    }

    if (req.method === "GET" && (rota === "/docs" || rota === "/docs/")) {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        return res.end(paginaSwagger());
    }

    if (!rotasPost.includes(rota)) {
        return responder(res, 404, { erro: "Rota não encontrada." });
    }

    if (req.method !== "POST") {
        return responder(res, 405, { erro: "Use o método POST." });
    }

    let dados;

    try {
        let corpo = "";
        for await (const parte of req.setEncoding("utf8")) {
            corpo += parte;
        }
        dados = JSON.parse(corpo);
    } catch {
        return responder(res, 400, { erro: "Envie um JSON válido." });
    }

    const campo = rota === "/cifrar" ? "textoClaro" : "textoCifrado";
    const texto = dados?.[campo];
    const deslocamento = dados?.deslocamento;

    if (typeof texto !== "string" || texto.trim() === "") {
        return responder(res, 400, { erro: `Informe o campo ${campo}.` });
    }
    if (rota === "/decifrarForcaBruta") {
        const textoClaro = decifrarForcaBruta(texto);

        if (textoClaro === null) {
            return responder(res, 400, {
                erro: "Não foi possível identificar a mensagem em português."
            });
        }

        return responder(res, 200, { textoClaro });
    }
    if (!Number.isSafeInteger(deslocamento)) {
        return responder(res, 400, { erro: "Informe um deslocamento inteiro." });
    }

    if (rota === "/cifrar") {
        return responder(res, 200, {
            textoCifrado: cifrar(texto, deslocamento)
        });
    }

    return responder(res, 200, {
        textoClaro: decifrar(texto, deslocamento)
    });
});

const porta = Number(process.env.PORT) || 3000;

servidor.listen(porta, "127.0.0.1", () => {
    console.log(`API rodando em http://127.0.0.1:${porta}`);
    console.log(`Documentação em http://127.0.0.1:${porta}/docs`);
});