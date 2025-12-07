import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthProvider";
import { SearchProvider } from "@/context/SearchProvider";
import { PrivateRoute } from "@/components/PrivateRoute";
import { Home } from "@/pages/Home";
import { PostPage } from "@/pages/PostPage";
import { Login } from "@/pages/Login";
import { CreatePost } from "@/pages/CreatePost";
import { EditPost } from "@/pages/EditPost";
import { MainLayout } from "@/layout/MainLayout";
import { MainLayoutWithHeader } from "@/layout/MainLayoutWithHeader";

function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <BrowserRouter>
          <Routes>
            {/* 🔓 Páginas sem Header */}
            <Route element={<MainLayout />}>
              <Route path="/login" element={<Login />} />
            </Route>

            {/* 🔒 Páginas com Header */}
            <Route element={<MainLayoutWithHeader />}>
              <Route path="/" element={<Home />} />
              <Route path="/post/:id" element={<PostPage />} />
              <Route path="/create" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
              <Route path="/edit/:id" element={<PrivateRoute><EditPost /></PrivateRoute>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SearchProvider>
    </AuthProvider>
  );
}

export default App;
