import { Schema, model, Model } from "mongoose";

export type PostStatus = "publicado" | "rascunho" | "deletado";

export interface IPost {
  title: string;
  content: string;
  author: string;
  status: PostStatus;            // requerido
  publicationDate: Date | null;  // <-- aceita null
  createdAt: Date;
  updatedAt: Date;
}

export interface PostModel extends Model<IPost> {}

const postSchema = new Schema<IPost>(
  {
    title:   { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    author:  { type: String, required: true, trim: true },

    status: {
      type: String,
      enum: ["publicado", "rascunho", "deletado"],
      default: "rascunho",
      required: true,
      index: true,
    },
    publicationDate: {
      type: Date,
      default: null,            // <-- coerente com o tipo (Date | null)
      index: true,
    },
  },
  { timestamps: true, versionKey: false }
);

// Índices úteis (opcional)
postSchema.index({ status: 1, publicationDate: -1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ author: 1 });

const Post = model<IPost, PostModel>("Post", postSchema);
export default Post;
