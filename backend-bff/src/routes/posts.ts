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
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(post);
});

// Excluir post com soft delete (apenas TEACHER)
router.delete("/:id", authenticate, authorizeRole("TEACHER"), async (req, res) => {
  // await Post.findByIdAndDelete(req.params.id);
  await Post.findById(req.params.id).updateOne({ status: "deletado" });
  res.json({ message: "Post deletado" });
});

export default router;
