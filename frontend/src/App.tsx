import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthProvider";
import { SearchProvider } from "@/context/SearchProvider";
import { PrivateRoute } from "@/components/PrivateRoute";

// 🧩 Páginas
import { Home } from "@/pages/Home";
import { PostPage } from "@/pages/PostPage";
import { Login } from "@/pages/Login";
import { CreatePost } from "@/pages/CreatePost";
import { EditPost } from "@/pages/EditPost";
import { Dashboard } from "@/pages/Dashboard";

// 🧱 Layouts
import { MainLayout } from "@/layout/MainLayout";
import { MainLayoutWithHeader } from "@/layout/MainLayoutWithHeader";

function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <BrowserRouter>
          <Routes>
            {/* 🔓 Páginas SEM Header */}
            <Route element={<MainLayout />}>
              <Route path="/login" element={<Login />} />
            </Route>

            {/* 🔒 Páginas COM Header */}
            <Route element={<MainLayoutWithHeader />}>
              {/* 🏠 Página pública */}
              <Route path="/" element={<Home />} />

              {/* 📖 Leitura de post */}
              <Route path="/post/:id" element={<PostPage />} />

              {/* 🧑‍🏫 Área administrativa (protegida) */}
             <Route path="/dashboard" element={<Dashboard />} />

              <Route
                path="/create"
                element={
                  <PrivateRoute>
                    <CreatePost />
                  </PrivateRoute>
                }
              />
              <Route
                path="/edit/:id"
                element={
                  <PrivateRoute>
                    <EditPost />
                  </PrivateRoute>
                }
              />
            </Route>

            {/* 🚫 Fallback opcional */}
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </BrowserRouter>
      </SearchProvider>
    </AuthProvider>
  );
}

export default App;
