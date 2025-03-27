import { Hono } from "hono";
import { tokenMiddleware } from "./middlewares/token-middleware";

export const commentsRoutes = new Hono();

commentsRoutes.get("/me", async (context) => {


});

commentsRoutes.get("",tokenMiddleware, async () =>{
    
})