import { Outlet } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "@/styles/GlobalStyle";
import { lightTheme } from "@/styles/theme";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function MainLayoutWithHeader() {
  return (
    <ThemeProvider theme={lightTheme}>
      <GlobalStyle />
      <Header />
      <main style={{ margin: 0, padding: 0 }}>
        <Outlet />
      </main>
      <Footer />
    </ThemeProvider>
  );
}
