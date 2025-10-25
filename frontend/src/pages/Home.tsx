import { useEffect, useState } from "react";
import { getAllPosts } from "@/api/postService";
import { Link } from "react-router-dom";
// import { Link } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";


export function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  // const { user } = useAuth();
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

  return (
    <div className="home-container">
      <div className="home-cabecalho">
        <h1>Posts</h1>

        <Link to="/create" className="home-cabecalho-button">
          <button>{ textoCriarPost }</button>
        </Link>
      </div>

      <div className="posts-container">
      {posts.map((p) => (
          <div className="post" key={p._id}>
            <Link to={`/post/${p._id}`}>
              <h3>{p.title}</h3>
              <p>{p.content}</p>
              {/* <p>{p.content.slice(0, 100)}...</p> */}
            </Link>
          </div>
      ))}
      

      {/* 🔒 Só professores veem o botão */}
      {/* {user?.role === "TEACHER" && (
        <Link to="/create">
          <button>Criar novo post</button>
        </Link>
      )}

      <ul>
        {posts.map((p) => (
          <li key={p._id}>
            <Link to={`/post/${p._id}`}>
              <h3>{p.title}</h3>
              <p>{p.content.slice(0, 100)}...</p>
            </Link>
          </li>
        ))}
      </ul> */}
      </div>
    </div>
  );
}
