import { Router } from "express";
import Post from "../models/Post";
import { authenticate, authorizeRole, AuthRequest } from "../middleware/auth";

const router = Router();

// Listar todos os posts
router.get("/", async (_req, res) => {
  const posts = await Post.find().populate("author", "name email");
  res.json(posts);
});

// Obter post específico
router.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id).populate("author", "name email");
  if (!post) return res.status(404).json({ error: "Post não encontrado" });
  res.json(post);
});

// Criar post (apenas TEACHER)
router.post("/", authenticate, authorizeRole("TEACHER"), async (req: AuthRequest, res) => {
  const post = new Post({ ...req.body, author: req.user!.name });
  await post.save();
  res.json(post);
});

// Editar post (apenas TEACHER)
router.put("/:id", authenticate, authorizeRole("TEACHER"), async (req, res) => {
  try {
    // 1. Log para garantir que passou pela autenticação
    console.log(`Tentando atualizar post ${req.params.id} com dados:`, req.body);

    const post = await Post.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { 
        new: true,           // Retorna o objeto novo, não o antigo
        runValidators: true  // OBRIGA o Mongo a checar as regras do seu Schema
      }
    );

    // 2. Checa se o post realmente existe
    if (!post) {
      console.log("Post não encontrado no banco.");
      return res.status(404).json({ error: "Post não encontrado" });
    }

    console.log("Post atualizado com sucesso:", post);
    res.json(post);

  } catch (error: any) {
    // 3. Captura erros de validação ou de conexão
    console.error("ERRO AO ATUALIZAR:", error);
    res.status(400).json({ error: "Erro ao atualizar post", details: error.message });
  }
});

// Excluir post com soft delete (apenas TEACHER)
router.delete("/:id", authenticate, authorizeRole("TEACHER"), async (req, res) => {
  // await Post.findByIdAndDelete(req.params.id);
  await Post.findById(req.params.id).updateOne({ status: "deletado", publicationDate: null });
  res.json({ message: "Post deletado" });
});

export default router;
