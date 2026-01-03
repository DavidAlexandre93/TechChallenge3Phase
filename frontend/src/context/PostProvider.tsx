import type { ReactNode } from "react";
import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  createPost as createPostRequest,
  deletePost as deletePostRequest,
  getAllPosts,
  getPostById,
  updatePost as updatePostRequest,
} from "@/api/postService";
import type { Post, PostPayload } from "@/models/postModel";

interface PostContextType {
  posts: Post[];
  loading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  fetchPostById: (id: string) => Promise<Post | null>;
  createPost: (data: PostPayload) => Promise<Post>;
  updatePost: (id: string, data: PostPayload) => Promise<Post>;
  deletePost: (id: string) => Promise<void>;
}

export const PostContext = createContext<PostContextType | undefined>(undefined);

export function PostProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const postsRef = useRef<Post[]>([]);

  useEffect(() => {
    postsRef.current = posts;
  }, [posts]);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllPosts();
      setPosts(response);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar posts:", err);
      setError("Erro ao carregar posts.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPostById = useCallback(async (id: string): Promise<Post | null> => {
    const existingPost = postsRef.current.find((post) => post._id === id);
    if (existingPost) return existingPost;

    setLoading(true);
    try {
      const post = await getPostById(id);
      setPosts((prev) => {
        const alreadyExists = prev.some((item) => item._id === post._id);
        if (alreadyExists) {
          return prev.map((item) => (item._id === post._id ? post : item));
        }
        return [...prev, post];
      });
      return post;
    } catch (err) {
      console.error("Erro ao buscar post específico:", err);
      setError("Erro ao carregar a postagem.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPost = useCallback(async (data: PostPayload) => {
    const created = await createPostRequest(data);
    setPosts((prev) => [...prev, created]);
    return created;
  }, []);

  const updatePost = useCallback(async (id: string, data: PostPayload) => {
    const updated = await updatePostRequest(id, data);
    setPosts((prev) =>
      prev.map((post) => (post._id === id ? updated : post)),
    );
    return updated;
  }, []);

  const deletePost = useCallback(async (id: string) => {
    await deletePostRequest(id);
    setPosts((prev) => prev.filter((post) => post._id !== id));
  }, []);

  const value = useMemo(
    () => ({
      posts,
      loading,
      error,
      fetchPosts,
      fetchPostById,
      createPost,
      updatePost,
      deletePost,
    }),
    [createPost, deletePost, error, fetchPostById, fetchPosts, loading, posts, updatePost],
  );

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
}
