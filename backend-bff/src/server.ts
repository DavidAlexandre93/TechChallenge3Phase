import app from "./app";
import mongoose from "mongoose";

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI!;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB conectado");
    app.listen(PORT, () => console.log(`Servidor BFF rodando na porta ${PORT}`));
  })
  .catch(err => console.error("Erro ao conectar ao Mongo:", err));
