import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

// Isso aqui ajuda o robô a saber "onde ele está"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

// Página de boas-vindas
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "O robô está vivo, lê e escreve no caderno 📖✍️🤖"
  });
});

// 👉 Ler TODOS os prompts
app.get("/prompts", (req, res) => {
  const caminhoDoCaderno = path.join(__dirname, "prompts.json");
  const textoDoCaderno = fs.readFileSync(caminhoDoCaderno, "utf-8");
  const prompts = JSON.parse(textoDoCaderno);

  res.json(prompts);
});

// 👉 Procurar prompts por categoria
app.get("/prompts/categoria/:categoria", (req, res) => {
  const categoriaPedida = req.params.categoria;

  const caminhoDoCaderno = path.join(__dirname, "prompts.json");
  const textoDoCaderno = fs.readFileSync(caminhoDoCaderno, "utf-8");
  const prompts = JSON.parse(textoDoCaderno);

  const encontrados = prompts.filter(
    (prompt) => prompt.categoria === categoriaPedida
  );

  res.json(encontrados);
});

// 👉 ADICIONAR novo prompt (ESCREVER no caderno)
app.post("/prompts", (req, res) => {
  const { titulo, categoria, conteudo } = req.body;

  if (!titulo || !categoria || !conteudo) {
    return res.status(400).json({
      erro: "Envie titulo, categoria e conteudo"
    });
  }

  const caminhoDoCaderno = path.join(__dirname, "prompts.json");
  const textoDoCaderno = fs.readFileSync(caminhoDoCaderno, "utf-8");
  const prompts = JSON.parse(textoDoCaderno);

  const novoPrompt = {
    id: prompts.length + 1,
    titulo,
    categoria,
    conteudo
  };

  prompts.push(novoPrompt);

  fs.writeFileSync(
    caminhoDoCaderno,
    JSON.stringify(prompts, null, 2)
  );

  res.json({
    mensagem: "Prompt salvo com sucesso ✍️",
    prompt: novoPrompt
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

