const fs = require("node:fs");
const path = require("node:path");

const alfabeto = "abcdefghijklmnopqrstuvwxyz";
const limiteConfianca = 0.2;
const dicionario = carregarDicionario(path.join(__dirname, "dicionario.txt"));

function normalizar(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function carregarDicionario(caminho) {
  try {
    const palavras = fs.readFileSync(caminho, "utf8").split(/\r?\n/);
    return new Set(palavras.map((palavra) => palavra.trim()).filter(Boolean));
  } catch {
    return new Set();
  }
}

function pontuar(texto) {
  const palavras = normalizar(texto).split(/[^a-z]+/).filter((palavra) => palavra.length > 1);
  const unicas = [...new Set(palavras)];
  let encontradas = 0;
  let pontos = 0;
  let maiorPalavra = 0;

  for (const palavra of unicas) {
    if (!dicionario.has(palavra)) {
      continue;
    }

    encontradas += 1;
    pontos += Math.min(palavra.length, 10);
    maiorPalavra = Math.max(maiorPalavra, palavra.length);
  }

  return {
    confianca: unicas.length === 0 ? 0 : encontradas / unicas.length,
    maiorPalavra,
    encontradas,
    pontos
  };
}

function cifrar(texto, deslocamento) {
  let resultado = "";
  const passo = ((deslocamento % 26) + 26) % 26;

  for (const caractere of texto) {
    const indice = alfabeto.indexOf(caractere.toLowerCase());

    if (indice === -1) {
      resultado += caractere;
      continue;
    }

    const cifrado = alfabeto[(indice + passo) % 26];
    resultado += caractere === caractere.toUpperCase() ? cifrado.toUpperCase() : cifrado;
  }

  return resultado;
}

function decifrar(texto, deslocamento) {
  let resultado = "";
  const passo = ((deslocamento % 26) + 26) % 26;

  for (const caractere of texto) {
    const indice = alfabeto.indexOf(caractere.toLowerCase());

    if (indice === -1) {
      resultado += caractere;
      continue;
    }

    const decifrado = alfabeto[(indice - passo + 26) % 26];
    resultado += caractere === caractere.toUpperCase() ? decifrado.toUpperCase() : decifrado;
  }

  return resultado;
}

function decifrarForcaBruta(textoCifrado) {
  if (dicionario.size === 0) {
    return null;
  }

  let melhorTexto = null;
  let melhorConfianca = 0;
  let melhorPalavra = 0;
  let melhorEncontradas = 0;

  for (let deslocamento = 0; deslocamento < 26; deslocamento++) {
    const candidato = decifrar(textoCifrado, deslocamento);
    const { confianca, maiorPalavra, encontradas } = pontuar(candidato);

    const melhorou =
      confianca > melhorConfianca ||
      (confianca === melhorConfianca && maiorPalavra > melhorPalavra);

    if (melhorou) {
      melhorTexto = candidato;
      melhorConfianca = confianca;
      melhorPalavra = maiorPalavra;
      melhorEncontradas = encontradas;
    }
  }

  const evidenciaSuficiente = melhorEncontradas >= 2 || melhorPalavra >= 6;

  if (melhorConfianca < limiteConfianca || !evidenciaSuficiente) {
    return null;
  }

  return melhorTexto;
}

module.exports = { cifrar, decifrar, decifrarForcaBruta };
