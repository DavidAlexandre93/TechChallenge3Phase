import { useEffect, useState } from "react";
import styled from "styled-components";

const FooterBar = styled.footer`
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  /* border-top: 1px solid ${({ theme }) => theme.colors.border}; */
  text-align: center;
  padding: 10px;
  font-size: 0.9rem;
  z-index: 1000;

  position: fixed;
  bottom: 0;
  width: calc(100% - 5rem);
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
`;

export function Footer() {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 550);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 550);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <FooterBar>
      © {new Date().getFullYear()}{" "}
      {isMobile ? (
        <>
          Plataforma Educacional <br /> Desenvolvido pelo Grupo 20
        </>
      ) : (
        <>Plataforma Educacional — Desenvolvido pelo Grupo 20</>
      )}
    </FooterBar>
  );
}