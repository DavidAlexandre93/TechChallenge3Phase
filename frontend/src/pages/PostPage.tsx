import { useEffect, useState } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import { getPostById, deletePost } from "@/api/postService";
import { useParams } from "react-router-dom";
import { getPostById } from "@/api/postService";
// import { useAuth } from "@/context/AuthContext";

export function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  // const { user } = useAuth();
  // const navigate = useNavigate();

  useEffect(() => {
    if (id) getPostById(id).then(setPost);
  }, [id]);

  if (!post) return <p>Carregando...</p>;

  // async function handleDelete() {
  //   if (confirm("Tem certeza que deseja excluir este post?")) {
  //     await deletePost(post._id);
  //     navigate("/admin");
  //   }
  // }

  return (
    <article className="post-view">
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <small>Autor: {post.author?.name}</small>

      {/* 🔒 Só TEACHER pode editar/excluir */}
      {/* {user?.role === "TEACHER" && (
        <div style={{ marginTop: "1rem" }}>
          <Link to={`/edit/${post._id}`}>
            <button>Editar</button>
          </Link>
          <button onClick={handleDelete}>Excluir</button>
        </div>
      )} */}
    </article>
  );
}
