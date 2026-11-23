# AlgoritmoCesarCugler

# Integrantes: Pedro Paulino e Victoria Benfica

API da Cifra de César feita com Node.js puro (sem dependências).

## Como rodar (passo a passo)

1. Instale o Node.js: <https://nodejs.org> (baixe a versão LTS e clique em "Avançar" até o fim).
2. Abra a pasta do projeto no terminal (no VS Code: **Terminal → New Terminal**).
3. Digite o comando abaixo e aperte **Enter**:

   ```powershell
   node servidor.js
   ```

4. Abra o navegador em <http://127.0.0.1:3000/docs>.
5. Para parar o servidor, aperte **Ctrl + C** no terminal.

Também funciona com `npm start`. Se aparecer `EADDRINUSE` (porta ocupada), rode com outra porta:

```powershell
$env:PORT=4000; node servidor.js
```

Não precisa de `npm install`: o projeto não tem dependências.

## Documentação (Swagger)

Com o servidor rodando, acesse:

- `http://127.0.0.1:3000/docs` — interface do Swagger UI
- `http://127.0.0.1:3000/swagger.json` — especificação OpenAPI 3.0

## Rotas

Todas as rotas são `POST` e recebem JSON.

| Rota | Corpo | Resposta |
| --- | --- | --- |
| `POST /cifrar` | `{"textoClaro": "abc", "deslocamento": 3}` | `{"textoCifrado": "def"}` |
| `POST /decifrar` | `{"textoCifrado": "def", "deslocamento": 3}` | `{"textoClaro": "abc"}` |
| `POST /decifrarForcaBruta` | `{"textoCifrado": "def"}` | `{"textoClaro": "abc"}` |

Exemplo com `curl`:

```powershell
curl.exe -X POST http://127.0.0.1:3000/cifrar -H "Content-Type: application/json" -d "{\"textoClaro\":\"abc\",\"deslocamento\":3}"
```

## Como funciona a força bruta

A rota `/decifrarForcaBruta` não recebe o deslocamento. Ela testa os 26 deslocamentos possíveis e escolhe o resultado que mais parece português:

1. Decifra o texto com cada deslocamento de 0 a 25.
2. Para cada resultado, separa as palavras (sem acento, minúsculas, sem repetição) e conta quantas existem em `dicionario.txt` (20.000 palavras comuns do português).
3. Calcula a confiança: `palavras encontradas / palavras do texto`. Como é uma proporção de palavras, uma palavra desconhecida longa não derruba a frase inteira.
4. Devolve o candidato de maior confiança. Em caso de empate, ganha o que tiver a maior palavra encontrada.

Se a confiança for menor que 0,5, ou se houver apenas uma palavra curta encontrada, a API responde `400` com a mensagem "Não foi possível identificar a mensagem em português" — assim ela não "adivinha" um texto que não é português.

O dicionário foi gerado a partir da lista de frequência [FrequencyWords](https://github.com/hermitdave/FrequencyWords) (MIT), com um filtro para remover palavras comuns do inglês. As palavras ficam sem acento e em minúsculas, uma por linha.

## Hospedagem no Railway

O projeto já está pronto para o Railway:

- `package.json` — define `npm start` (que roda `node servidor.js`) e Node `>= 20`.
- `railway.json` — usa o builder NIXPACKS, roda `npm start` e reinicia em caso de falha.
- O servidor escuta em `0.0.0.0` e na porta da variável `PORT`, que o Railway define automaticamente.

Passo a passo:

1. Faça o push do projeto para o GitHub.
2. No <https://railway.app>, clique em **New Project → Deploy from GitHub repo** e escolha o repositório.
3. Aguarde o build. Não precisa configurar nada: o Railway detecta o Node e roda `npm start`.
4. Em **Settings → Networking**, clique em **Generate Domain** para ter a URL pública.
5. Acesse `https://SEU-DOMINIO.up.railway.app/docs` para a documentação e teste das rotas.

Para simular o ambiente do Railway localmente:

```powershell
$env:PORT=8080; npm start
```
