import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

// Localização do arquivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔓 libera acesso externo
app.use(cors());
app.use(express.json());

// Página inicial
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "O robô está vivo, lê e escreve no caderno 📖✍️🤖"
  });
});

// Ler todos os prompts
app.get("/prompts", (req, res) => {
  const caminho = path.join(__dirname, "prompts.json");
  const prompts = JSON.parse(fs.readFileSync(caminho, "utf-8"));
  res.json(prompts);
});

// Filtrar por categoria
app.get("/prompts/categoria/:categoria", (req, res) => {
  const { categoria } = req.params;

  const caminho = path.join(__dirname, "prompts.json");
  const prompts = JSON.parse(fs.readFileSync(caminho, "utf-8"));

  const encontrados = prompts.filter(
    (p) => p.categoria === categoria
  );

  res.json(encontrados);
});

// Adicionar novo prompt
app.post("/prompts", (req, res) => {
  const { titulo, categoria, conteudo } = req.body;

  if (!titulo || !categoria || !conteudo) {
    return res.status(400).json({
      erro: "Envie titulo, categoria e conteudo"
    });
  }

  const caminho = path.join(__dirname, "prompts.json");
  const prompts = JSON.parse(fs.readFileSync(caminho, "utf-8"));

  const novoPrompt = {
    id: prompts.length + 1,
    titulo,
    categoria,
    conteudo
  };

  prompts.push(novoPrompt);

  fs.writeFileSync(caminho, JSON.stringify(prompts, null, 2));

  res.json({
    mensagem: "Prompt salvo com sucesso ✨",
    prompt: novoPrompt
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

