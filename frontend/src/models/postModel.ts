interface Post {
  _id: string;
  status: "publicado" | "rascunho" | "deletado";
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  publicationDate?: Date;
}

export type { Post };