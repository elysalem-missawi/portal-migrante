import {
  http,
} from "./api";

import type {
  Need,
} from "./needs.service";

/* =========================================================
   Types
========================================================= */

export type ForumPostType =
  | "announcement"
  | "question";

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

  type:
    ForumPostType;

  title:
    string;

  body:
    string;

  authorName:
    string;

  authorCity?:
    string;

  /*
   * Temporary legacy field.
   */
  category?:
    string;

  /*
   * Need-centred relation.
   *
   * API may return either ObjectIds
   * or populated Need objects.
   */
  needIds:
    Array<
      string |
      Need
    >;

  status:
    string;

  comments:
    ForumComment[];

  createdAt:
    string;

  updatedAt:
    string;
};

export type ForumMessage = {
  _id:
    string;

  authorUserId?:
    string;

  authorName:
    string;

  authorCity?:
    string;

  body:
    string;

  status:
    string;

  createdAt:
    string;

  updatedAt:
    string;
};

export type ForumProfile = {
  userId:
    string;
};

/* =========================================================
   Filters
========================================================= */

export type ForumPostFilters = {
  type?:
    ForumPostType |
    "all";

  q?:
    string;

  authorUserId?:
    string;

  needId?:
    string;
};

/* =========================================================
   Create inputs
========================================================= */

export type CreateForumPostInput =
  ForumProfile & {
    type:
      ForumPostType;

    title:
      string;

    body:
      string;

    /*
     * Temporary legacy field.
     */
    category?:
      string;

    /*
     * Semantic needs selected
     * for this publication.
     */
    needIds?:
      string[];
  };

export type CreateForumCommentInput =
  ForumProfile & {
    body:
      string;
  };

export type CreateForumMessageInput =
  ForumProfile & {
    body:
      string;
  };

/* =========================================================
   Query helper
========================================================= */

function buildPostQuery(
  params?: ForumPostFilters
) {
  const search =
    new URLSearchParams();

  if (
    params?.type &&
    params.type !==
      "all"
  ) {
    search.set(
      "type",

      params.type
    );
  }

  if (
    params?.q
  ) {
    search.set(
      "q",

      params.q
    );
  }

  if (
    params?.authorUserId
  ) {
    search.set(
      "authorUserId",

      params.authorUserId
    );
  }

  if (
    params?.needId
  ) {
    search.set(
      "needId",

      params.needId
    );
  }

  const query =
    search.toString();

  return query
    ? `?${query}`
    : "";
}

/* =========================================================
   Service
========================================================= */

export const forumService = {
  /* =======================================================
     Posts
  ======================================================= */

  async listPosts(
    params?: ForumPostFilters
  ) {
    const suffix =
      buildPostQuery(
        params
      );

    return http<
      ForumPost[]
    >(
      `/forum/posts${suffix}`
    );
  },

  async createPost(
    input:
      CreateForumPostInput
  ) {
    return http<
      ForumPost
    >(
      "/forum/posts",

      {
        method:
          "POST",

        headers: {
          "x-user-id":
            input.userId,
        },

        body:
          JSON.stringify(
            input
          ),
      }
    );
  },

  async addComment(
    postId:
      string,

    input:
      CreateForumCommentInput
  ) {
    return http<
      ForumPost
    >(
      `/forum/posts/${postId}/comments`,

      {
        method:
          "POST",

        headers: {
          "x-user-id":
            input.userId,
        },

        body:
          JSON.stringify(
            input
          ),
      }
    );
  },

  /* =======================================================
     Community chat
  ======================================================= */

  async listMessages() {
    return http<
      ForumMessage[]
    >(
      "/forum/messages"
    );
  },

  async createMessage(
    input:
      CreateForumMessageInput
  ) {
    return http<
      ForumMessage
    >(
      "/forum/messages",

      {
        method:
          "POST",

        headers: {
          "x-user-id":
            input.userId,
        },

        body:
          JSON.stringify(
            input
          ),
      }
    );
  },
};