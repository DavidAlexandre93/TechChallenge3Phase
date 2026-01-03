import { useContext } from "react";
import { PostContext } from "@/context/PostProvider";

export function usePosts() {
  const context = useContext(PostContext);

  if (!context) {
    throw new Error("usePosts deve ser usado dentro de um PostProvider");
  }

  return context;
}
