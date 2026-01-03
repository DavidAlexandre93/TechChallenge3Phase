import api from "./api";
import type { Post, PostPayload } from "@/models/postModel";

export async function getAllPosts(): Promise<Post[]> {
  const { data } = await api.get("/posts");
  return data;
}

export async function getPostById(id: string): Promise<Post> {
  const res = await api.get(`/posts/${id}`);
  return res.data;
}

export async function createPost(data: PostPayload): Promise<Post> {
  const res = await api.post("/posts", data);
  return res.data;
}

export async function updatePost(id: string, data: PostPayload): Promise<Post> {
  const res = await api.put(`/posts/${id}`, data);
  return res.data;
}

export async function deletePost(id: string): Promise<void> {
  await api.delete(`/posts/${id}`);
}
