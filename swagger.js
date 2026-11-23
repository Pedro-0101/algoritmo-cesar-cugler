const especificacao = {
    openapi: "3.0.3",
    info: {
        title: "Algoritmo César Cugler - API",
        description:
            "API da Cifra de César. Todas as rotas recebem e devolvem JSON.",
        version: "1.0.0"
    },
    servers: [
        {
            url: "http://127.0.0.1:3000",
            description: "Servidor local"
        }
    ],
    tags: [
        {
            name: "Cifra de César",
            description: "Operações de cifrar, decifrar e quebrar a cifra."
        }
    ],
    paths: {
        "/cifrar": {
            post: {
                tags: ["Cifra de César"],
                summary: "Cifra um texto",
                description:
                    "Desloca cada letra do texto claro no alfabeto pelo deslocamento informado.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/RequisicaoCifrar"
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: "Texto cifrado com sucesso.",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/RespostaTexto"
                                }
                            }
                        }
                    },
                    400: {
                        $ref: "#/components/responses/ErroRequisicao"
                    },
                    405: {
                        $ref: "#/components/responses/MetodoInvalido"
                    }
                }
            }
        },
        "/decifrar": {
            post: {
                tags: ["Cifra de César"],
                summary: "Decifra um texto",
                description:
                    "Desfaz o deslocamento aplicado ao texto cifrado usando o deslocamento informado.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/RequisicaoDecifrar"
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: "Texto claro obtido com sucesso.",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/RespostaTexto"
                                }
                            }
                        }
                    },
                    400: {
                        $ref: "#/components/responses/ErroRequisicao"
                    },
                    405: {
                        $ref: "#/components/responses/MetodoInvalido"
                    }
                }
            }
        },
        "/decifrarForcaBruta": {
            post: {
                tags: ["Cifra de César"],
                summary: "Decifra um texto por força bruta",
                description:
                    "Testa todos os deslocamentos possíveis e devolve o texto em português identificado. Não é necessário informar o deslocamento.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/RequisicaoForcaBruta"
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: "Texto claro identificado com sucesso.",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/RespostaTexto"
                                }
                            }
                        }
                    },
                    400: {
                        $ref: "#/components/responses/ErroRequisicao"
                    },
                    405: {
                        $ref: "#/components/responses/MetodoInvalido"
                    }
                }
            }
        }
    },
    components: {
        schemas: {
            RequisicaoCifrar: {
                type: "object",
                required: ["textoClaro", "deslocamento"],
                properties: {
                    textoClaro: {
                        type: "string",
                        description: "Texto que será cifrado.",
                        example: "abc"
                    },
                    deslocamento: {
                        type: "integer",
                        description: "Número de posições a deslocar no alfabeto.",
                        example: 3
                    }
                }
            },
            RequisicaoDecifrar: {
                type: "object",
                required: ["textoCifrado", "deslocamento"],
                properties: {
                    textoCifrado: {
                        type: "string",
                        description: "Texto que será decifrado.",
                        example: "def"
                    },
                    deslocamento: {
                        type: "integer",
                        description: "Número de posições usado na cifra.",
                        example: 3
                    }
                }
            },
            RequisicaoForcaBruta: {
                type: "object",
                required: ["textoCifrado"],
                properties: {
                    textoCifrado: {
                        type: "string",
                        description: "Texto cifrado que será analisado.",
                        example: "def"
                    }
                }
            },
            RespostaTexto: {
                type: "object",
                properties: {
                    textoCifrado: {
                        type: "string",
                        description: "Resultado da cifragem.",
                        example: "def"
                    },
                    textoClaro: {
                        type: "string",
                        description: "Resultado da decifragem.",
                        example: "abc"
                    }
                }
            },
            Erro: {
                type: "object",
                properties: {
                    erro: {
                        type: "string",
                        description: "Mensagem descrevendo o problema.",
                        example: "Informe o campo textoClaro."
                    }
                }
            }
        },
        responses: {
            ErroRequisicao: {
                description:
                    "JSON inválido, campo obrigatório ausente ou deslocamento inválido.",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/Erro"
                        }
                    }
                }
            },
            MetodoInvalido: {
                description: "A rota aceita apenas o método POST.",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/Erro"
                        }
                    }
                }
            }
        }
    }
};

function paginaSwagger() {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>API Cifra de César - Documentação</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js" crossorigin></script>
    <script>
        window.onload = function () {
            window.ui = SwaggerUIBundle({
                url: "/swagger.json",
                dom_id: "#swagger-ui",
                deepLinking: true,
                tryItOutEnabled: true
            });
        };
    </script>
</body>
</html>`;
}

module.exports = { especificacao, paginaSwagger };
