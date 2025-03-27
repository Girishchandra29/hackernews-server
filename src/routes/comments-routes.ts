import { Hono } from "hono";
import { tokenMiddleware } from "./middleware/token-middleware";

export const commentsRoutes = new Hono();

commentsRoutes.get("/me", async (context) => {


});

commentsRoutes.get("",tokenMiddleware, async () =>{
    
})