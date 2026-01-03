interface Post {
  _id: string;
  status: "publicado" | "rascunho" | "deletado";
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  publicationDate?: Date | null;
}

interface PostPayload {
  title: string;
  content: string;
  author: string;
  status: Post["status"];
  publicationDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type { Post, PostPayload };
