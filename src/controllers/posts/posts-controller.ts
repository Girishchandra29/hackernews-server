import { prismaClient } from "../../extras/prisma.js";
import type { getPostsResult } from "./posts-types.js";

export const getMePosts = async (parameters: {
  userId: string;
}): Promise<getPostsResult> => {
  const posts = await prismaClient.post.findMany({
    where: {
      id: parameters.userId,
    },
  });

  return {
    posts,
  };
};

export const getAllPosts = async (): Promise<getPostsResult> => {
  const posts = await prismaClient.post.findMany();

  return {
    posts,
  };
};
