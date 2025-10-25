import { ThemeProvider } from "styled-components";
import { Header } from "@/pages/Header";
import { GlobalStyle } from "@/styles/GlobalStyle";
import { lightTheme, darkTheme } from "@/styles/theme";
import { useState } from "react";


export function MainLayout() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
        <Header isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} />
    </ThemeProvider>
  );
}
