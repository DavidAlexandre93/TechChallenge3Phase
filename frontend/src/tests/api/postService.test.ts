import { describe, it, expect, beforeEach, vi } from "vitest";
import api from "@/api/api";
import {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
} from "@/api/postService";
import type { AxiosRequestConfig } from "axios";

describe("postService", () => {
    let lastConfig: AxiosRequestConfig | null = null;

    beforeEach(() => {
        vi.clearAllMocks();
        lastConfig = null;

        api.defaults.adapter = vi.fn(async (config) => {
            lastConfig = config;

            return {
                data: config.data ? JSON.parse(config.data as string) : [{ id: "1", title: "Post 1" }],
                status: 200,
                statusText: "OK",
                headers: config.headers,
                config,
            };
        });
    });

    it("getAllPosts faz chamada correta", async () => {
        const result = await getAllPosts();

        expect(lastConfig!.url).toBe("/posts");
        expect(lastConfig!.method).toBe("get");

        expect(result).toEqual([{ id: "1", title: "Post 1" }]);
    });

    it("getPostById envia ID corretamente", async () => {
        await getPostById("123");

        expect(lastConfig!.url).toBe("/posts/123");
        expect(lastConfig!.method).toBe("get");
    });

    it("createPost envia os dados corretamente", async () => {
        const payload = {
            title: "New",
            content: "Post",
            author: "John",
            status: "published",
            publicationDate: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await createPost(payload);

        expect(lastConfig!.url).toBe("/posts");
        expect(lastConfig!.method).toBe("post");

        const sent = JSON.parse(lastConfig!.data as string);

        // compara campos comuns normalmente
        expect(sent.title).toBe(payload.title);
        expect(sent.content).toBe(payload.content);
        expect(sent.author).toBe(payload.author);
        expect(sent.status).toBe(payload.status);
        expect(sent.publicationDate).toBe(null);

        // compara datas convertendo
        expect(new Date(sent.createdAt).toISOString())
            .toBe(payload.createdAt.toISOString());

        expect(new Date(sent.updatedAt).toISOString())
            .toBe(payload.updatedAt.toISOString());

        expect(result).toEqual({
            ...payload,
            createdAt: payload.createdAt.toISOString(),
            updatedAt: payload.updatedAt.toISOString(),
        });
    });

    it("updatePost envia ID e dados corretamente", async () => {
        const payload = {
            title: "Updated",
            content: "Some content",
            author: "John",
            status: "draft",
            publicationDate: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await updatePost("55", payload);

        expect(lastConfig!.url).toBe("/posts/55");
        expect(lastConfig!.method).toBe("put");

        const sent = JSON.parse(lastConfig!.data as string);

        expect(sent.title).toBe(payload.title);
        expect(sent.content).toBe(payload.content);
        expect(sent.author).toBe(payload.author);
        expect(sent.status).toBe(payload.status);
        expect(sent.publicationDate).toBe(null);

        expect(new Date(sent.createdAt).toISOString())
            .toBe(payload.createdAt.toISOString());

        expect(new Date(sent.updatedAt).toISOString())
            .toBe(payload.updatedAt.toISOString());
    });

    it("deletePost envia ID corretamente", async () => {
        await deletePost("999");

        expect(lastConfig!.url).toBe("/posts/999");
        expect(lastConfig!.method).toBe("delete");
    });
});
