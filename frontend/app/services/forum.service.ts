import { http } from "./api";

export type ForumPostType = "announcement" | "question";

export type ForumComment = {
  _id?: string;
  authorUserId?: string;
  authorName: string;
  authorCity?: string;
  body: string;
  createdAt: string;
};

export type ForumPost = {
  _id: string;
  authorUserId?: string;
  type: ForumPostType;
  title: string;
  body: string;
  authorName: string;
  authorCity?: string;
  category?: string;
  status: string;
  comments: ForumComment[];
  createdAt: string;
  updatedAt: string;
};

export type ForumMessage = {
  _id: string;
  authorUserId?: string;
  authorName: string;
  authorCity?: string;
  body: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type ForumProfile = {
  userId: string;
};

export type CreateForumPostInput = ForumProfile & {
  type: ForumPostType;
  title: string;
  body: string;
  category?: string;
};

export type CreateForumCommentInput = ForumProfile & {
  body: string;
};

export type CreateForumMessageInput = ForumProfile & {
  body: string;
};

export const forumService = {
  async listPosts(params?: { type?: ForumPostType | "all"; q?: string }) {
    const search = new URLSearchParams();
    if (params?.type && params.type !== "all") search.set("type", params.type);
    if (params?.q) search.set("q", params.q);
    const suffix = search.toString() ? `?${search.toString()}` : "";
    return http<ForumPost[]>(`/forum/posts${suffix}`);
  },

  async createPost(input: CreateForumPostInput) {
    return http<ForumPost>("/forum/posts", {
      method: "POST",
      headers: { "x-user-id": input.userId },
      body: JSON.stringify(input),
    });
  },

  async addComment(postId: string, input: CreateForumCommentInput) {
    return http<ForumPost>(`/forum/posts/${postId}/comments`, {
      method: "POST",
      headers: { "x-user-id": input.userId },
      body: JSON.stringify(input),
    });
  },

  async listMessages() {
    return http<ForumMessage[]>("/forum/messages");
  },

  async createMessage(input: CreateForumMessageInput) {
    return http<ForumMessage>("/forum/messages", {
      method: "POST",
      headers: { "x-user-id": input.userId },
      body: JSON.stringify(input),
    });
  },
};
