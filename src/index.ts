import "dotenv/config"
import { serve } from "@hono/node-server";
import { allRoutes } from "./routes/routes";


serve(allRoutes);

console.log("server is running at http://localhost:3000/")
