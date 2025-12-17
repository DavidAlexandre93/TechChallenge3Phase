import "dotenv/config";
import app from "./app";
import mongoose from "mongoose";

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI!;

if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI não definida");
}

app.get("/health", (req, res) => res.send("ok"));


mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("\n=====================================");
    console.log("✅ MongoDB conectado");
    app.listen(PORT, () => {
      console.log(`Servidor BFF rodando na porta ${PORT}`);
      console.log("=====================================\n");
      console.log(`🔗 Healthcheck:        http://localhost:${PORT}/health`);
      console.log(`🔗 Posts API:          http://localhost:${PORT}/posts`);
      console.log(`🔗 Frontend (Nginx):   http://localhost:5173/`);
      console.log("\n=====================================\n");
    });
  })
  .catch(err => console.error("Erro ao conectar ao Mongo:", err));
