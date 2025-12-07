import { useEffect, useState } from "react";
import styled from "styled-components";
import { BookOpen } from "lucide-react"; // ícone semelhante ao da imagem

const FooterWrapper = styled.footer`
  width: 100%;
  background: #fff;
  border-top: 1px solid #e5e7eb;
  padding: 10px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #6b7280;
  position: relative;
  bottom: 0;
`;

const LeftText = styled.div`
  color: #374151;

  a {
    color: #2563eb;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const RightLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  svg {
    color: #2563eb;
    width: 18px;
    height: 18px;
  }

  a {
    color: #2563eb;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export function Footer() {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 550);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 550);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <FooterWrapper>
      <LeftText>
        © {new Date().getFullYear()}{" "}
        Tech Challenge. Desenvolvimento Web Full Stack.
      </LeftText>

      {!isMobile && (
        <RightLinks>
          <BookOpen />
          <a href="https://github.com/Group10Fiap/TechChallenge3Phase" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="#">Docs</a>
        </RightLinks>
      )}
    </FooterWrapper>
  );
}
