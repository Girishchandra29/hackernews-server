import { Hono } from "hono";
import { tokenMiddleware } from "./middlewares/token-middleware";
import { getAllUsers, getMe } from "../controllers/users/users-controller";
import { GetMeError } from "../controllers/users/users-types";


export const usersRoutes = new Hono();

usersRoutes.get("/me", tokenMiddleware, async (context) => {
  const userId = context.get("userId");
  try {
    const user = await getMe({
      userId,
    });
    return context.json({
      data: user,
    });
  } catch (e) {
    if (e === GetMeError.BAD_REQUEST) {
      return context.json(
        {
          error: "user not found",
        },
        400
      );
    }

    return context.json(
      {
        error: "Internal Server Error",
      },
      500
    );
  }
});

usersRoutes.get("", tokenMiddleware, async (context) => {
  const users = await getAllUsers();

  context.json(
    {
      data: users,
    },
    200
  );
});
