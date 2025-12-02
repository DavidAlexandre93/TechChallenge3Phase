import { useEffect, useState } from "react";
import { getAllPosts } from "@/api/postService";
import { Link } from "react-router-dom";
import { useSearch } from "@/hooks/useSearch";
import type { Post } from "@/models/postModel";
import { useAuth } from "@/hooks/useAuth";


export function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { searchTerm } = useSearch();
  const { user } = useAuth();
  const [textoCriarPost, setTextoCriarPost] = useState<string>("Criar novo post");

  useEffect(() => {
    getAllPosts().then(setPosts);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setTextoCriarPost("Criar");
      } else {
        setTextoCriarPost("Criar novo post");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const postsFiltrados = posts.filter((p) => {
    if (user?.role === "TEACHER") {
      return (p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.content.toLowerCase().includes(searchTerm.toLowerCase()) || p.author.toLowerCase().includes(searchTerm.toLowerCase()));
    } else {
      return (
        (p.title.toLowerCase().includes(searchTerm.toLowerCase()) && p.status == "publicado") || (p.content.toLowerCase().includes(searchTerm.toLowerCase()) && p.status == "publicado") || (p.author.toLowerCase().includes(searchTerm.toLowerCase()) && p.status == "publicado"));
    }
  }
  );

  return (
    <div className="home-container">
      <div className="home-cabecalho">
        <h1>Posts</h1>

        {user?.role === "TEACHER" && (
          <Link to="/create" className="home-cabecalho-button">
            <button className="btn-ghost">{textoCriarPost}</button>
          </Link>
        )}
      </div>

      <div className="posts-container">
        {postsFiltrados.length === 0 ? (
          <p style={{ fontSize: 20, fontWeight: "bold", paddingTop: 10 }}>Nenhum post encontrado.</p>
        ) : (
          postsFiltrados.map((p) => (
            <div className="post" key={p._id}>
              <Link to={`/post/${p._id}`}>
                <h3>{p.title}</h3>
                <p>{p.content.length <= 450 ? p.content : (p.content.slice(0,450)+"...")}</p>
              </Link>
            </div>
          )))}
      </div>
    </div>
  );
}
