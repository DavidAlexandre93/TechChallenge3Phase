import { useState } from "react";
import { createPost } from "@/api/postService";
import { useNavigate } from "react-router-dom";

export function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createPost({ title, content });
    navigate("/admin");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Novo Post</h2>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título" />
      <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Conteúdo" />
      <button type="submit">Publicar</button>
    </form>
  );
}
