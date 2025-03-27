import { Hono } from "hono";
import { tokenMiddleware } from "./middleware/token-middleware";
import { getAllPosts, getMePosts } from "../controllers/posts/posts-controller";

export const postsRoutes = new Hono();

postsRoutes.get("/me", tokenMiddleware, async (context) => {
  const userId = context.get("userId" as keyof typeof context.req.header) as string;
  try{
    const userPosts = await getMePosts({ userId: userId as string });

    return context.json({
      data : userPosts,
    })
  }catch(e){
     
  }


});

postsRoutes.get("", tokenMiddleware, async (context) => {
  const allPosts = await getAllPosts();
  if (!allPosts) {
    return context.json({
      message: "No posts found",
    });
  }
  return context.json({
    allPosts,
  });
});
