import { createMiddleware } from "hono/factory";
import jwt from "jsonwebtoken";
import { jwtsecretKey } from "../../../environment";

export const tokenMiddleware = createMiddleware<{
  Variables: {
    userId: string;
  };
}>(async (context, next) => {
  const token = context.req.header("token");
  if (!token) {
    return context.json(
      {
        message: "missing Token",
      },
      401
    );
  }

  try {
    const payload = jwt.verify(token, jwtsecretKey) as jwt.JwtPayload;

    const userId = payload.sub;

    if (userId) {
      context.set("userId", userId);
    }

    await next();
  } catch (e) {
    return context.json({ message: "Unauthorized token" }, 401);
  }
});
