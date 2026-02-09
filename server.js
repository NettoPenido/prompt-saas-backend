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
    message: "O robô está vivo e sabe ler o caderno 📖🤖"
  });
});

// 👉 AQUI o robô abre o caderno e mostra os prompts
app.get("/prompts", (req, res) => {
  const caminhoDoCaderno = path.join(__dirname, "prompts.json");
  const textoDoCaderno = fs.readFileSync(caminhoDoCaderno, "utf-8");
  const prompts = JSON.parse(textoDoCaderno);

  res.json(prompts);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
