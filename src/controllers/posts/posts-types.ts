import type { Post } from "@prisma/client";

export type getPostsResult = {
  posts: Post[];
};
