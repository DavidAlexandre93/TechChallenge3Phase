import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import '@/App.css'
import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "@/styles/GlobalStyle";
import { lightTheme, darkTheme } from "@/styles/theme";
import { AuthProvider } from '@/context/AuthProvider';
import { SearchProvider } from "@/context/SearchProvider";
import { Header } from '@/components/Header';
import { Home } from "@/pages/Home.tsx";
import { PostPage } from '@/pages/PostPage';
import { Login } from '@/pages/Login.tsx';
import { CreatePost } from "@/pages/CreatePost";
import { EditPost } from "@/pages/EditPost";
import { Footer } from '@/components/Footer';
import { PrivateRoute } from '@/components/PrivateRoute';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <AuthProvider>
      <SearchProvider>
        <GlobalStyle />
        <BrowserRouter>
          <Header isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} >
          </Header>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/login" element={<Login />} />

            {/* Páginas protegidas */}
            <Route path="/create" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
            <Route path="/edit/:id" element={<PrivateRoute><EditPost /></PrivateRoute>} />
          </Routes>

          <Footer></Footer>
        </BrowserRouter>
      </SearchProvider>
      </AuthProvider>
    </ThemeProvider>

  )
}

export default App
