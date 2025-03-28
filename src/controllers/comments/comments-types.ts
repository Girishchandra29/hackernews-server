import type { Comment } from "@prisma/client";

export type GetCommentsResult = {
  comments: Comment[];
};

export type CreateCommentResult = {
  comment: Comment;
};

export type UpdateCommentResult = {
  comment: Comment;
};
