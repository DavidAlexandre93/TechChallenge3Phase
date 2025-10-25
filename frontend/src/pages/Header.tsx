import { Link } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";

export function Header() {
  // const { user, logout } = useAuth();

  return (
    <header style={{ position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "70px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 2rem",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    zIndex: 1000}}>
      <nav>
        <Link to="/">Início</Link>
        {/* {user?.role === "TEACHER" && (
          <>
            {" | "}
            <Link to="/admin">Admin</Link>
            {" | "}
            <Link to="/create">Novo Post</Link>
          </>
        )} */}
      </nav>

      {/* {user ? (
        <div>
          <span>{user.email}</span>{" "}
          <button onClick={logout}>Sair</button>
        </div>
      ) : (
        <Link to="/login">Entrar</Link>
      )} */}
    </header>
  );
}
