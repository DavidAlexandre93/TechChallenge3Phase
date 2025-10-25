import { Router } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();
const SECRET = process.env.JWT_SECRET || "changeme";

// Registro (apenas para testes)
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hash, role });
  await user.save();
  res.json(user);
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Usuário não encontrado" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Senha incorreta" });

  const token = jwt.sign({ id: user._id, role: user.role }, SECRET, { expiresIn: "8h" });
  res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
});

export default router;
