import { useState } from "react";
import { createPost } from "@/api/postService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const author = useAuth().user?.name || "Autor Desconhecido";
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const action = (form.elements.namedItem("action") as HTMLInputElement)?.value;

    const finalStatus = action === "publicar" ? "publicado" : "rascunho";

    await createPost({
      title,
      content,
      author,
      status: finalStatus,
      publicationDate: finalStatus === "publicado" ? new Date() : null,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    navigate("/");
  }

  return (
    <form onSubmit={handleSubmit} className="form-create-post" id="form-create-post">
      <h2>Novo Post</h2>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título" />
      <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Conteúdo" className="form-create-post-content" />
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12 }}>
        <button type="submit" name="action" value="rascunho" className="btn-ghost">Salvar</button>
        <button type="submit" name="action" value="publicar" className="btn-primary">Publicar</button>
      </div>
    </form>
  );
}
