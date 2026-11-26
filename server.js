require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const BOOKS_API_KEY = process.env.BOOKS_API_KEY;

app.use(cors());
app.use(express.json());

app.get("/api/livros/busca", async (req, res) => {
    const q = (req.query.q || "").trim();

    if (!q) {
        return res.status(400).json({ erro: "Parâmetro de busca obrigatório." });
    }

    if (!BOOKS_API_KEY) {
        return res.status(500).json({ erro: "Chave de API não configurada no servidor." });
    }

    try {
        const endpoint = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&key=${encodeURIComponent(BOOKS_API_KEY)}&maxResults=5`;
        const response = await fetch(endpoint);

        if (!response.ok) {
            return res.status(response.status).json({ erro: "Falha ao consultar API externa." });
        }

        const data = await response.json();
        const livros = (data.items || []).map((item) => {
            const info = item.volumeInfo || {};
            const imagem = info.imageLinks ? (info.imageLinks.thumbnail || info.imageLinks.smallThumbnail || "") : "";
            return {
                titulo: info.title || "Título desconhecido",
                autor: Array.isArray(info.authors) && info.authors.length > 0 ? info.authors[0] : "Autor não informado",
                capa: imagem.replace(/^http:/, "https:")
            };
        });

        return res.json({ livros });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ erro: "Erro interno ao buscar livros." });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});