// import "dotenv/config";
// import jwt from "jsonwebtoken";

// const secretKey = process.env.SECRET_KEY;
// console.log(secretKey)

// const jwtsecretKey = process.env.JWT_SECRET_KEY || process.exit(1);
// console.log(jwtsecretKey)

// const payload: jwt.JwtPayload = {
//     iss: "https://github.com/",
//     sub: "kethan3"
// };

// const secretKey = "HelloWorld@1234";
// const token = jwt.sign(payload,secretKey,{

//   algorithm : "HS256",
//   expiresIn : "7d"
// })

// console.log("toke",token)

// try{

//   const verPayload = jwt.verify(token,secretKey)

//   console.log("verified payload :", verPayload)
// }catch(e)
// {
//   console.log("error:" , e);
// }
// const decodedPayload = jwt.decode(token);
// console.log("Decoded payload", decodedPayload)

import { createHash } from "crypto";
import {
  LogInWithUsernameAndPasswordError,
  SignUpWithUsernameAndPasswordError,
  type LogInWithUsernameAndPasswordResult,
  type SignUpWithUsernameAndPasswordResult,
} from "./authentication-types";

import jwt from "jsonwebtoken";
import { jwtsecretKey } from "../../../environment";
import { prismaClient } from "../../extras/prisma";

const createJWToken = (parameters: {
  id: string;
  username: string;
}): string => {
  // Generate token
  const jwtPayload: jwt.JwtPayload = {
    iss: "https://purpleshorts.co.in",
    sub: parameters.id,
    username: parameters.username,
  };

  const token = jwt.sign(jwtPayload, jwtsecretKey, {
    expiresIn: "30d",
  });

  return token;
};

export const checkIfUserExistsAlready = async (parameters: {
  username: string;
}): Promise<boolean> => {
  const existingUser = await prismaClient.user.findUnique({
    where: {
      username: parameters.username,
    },
  });

  if (existingUser) {
    return true;
  }

  return false;
};

export const createPasswordHash = (parameters: {
  password: string;
}): string => {
  return createHash("sha256").update(parameters.password).digest("hex");
};

export const signUpWithUsernameAndpassword = async (parameters: {
  username: string;
  password: string;
}): Promise<SignUpWithUsernameAndPasswordResult> => {
  try {
    const isUserExistingAlready = await checkIfUserExistsAlready({
      username: parameters.username,
    });

    if (isUserExistingAlready) {
      throw SignUpWithUsernameAndPasswordError.CONFLICTING_USERNAME;
    }

    const passwordHash = createPasswordHash({
      password: parameters.password,
    });

    const user = await prismaClient.user.create({
      data: {
        username: parameters.username,
        password: passwordHash,
      },
    });

    const token = createJWToken({
      id: user.id,
      username: user.username,
    });

    const result: SignUpWithUsernameAndPasswordResult = {
      token,
      user,
    };

    return result;
  } catch (e) {
    console.log("Error", e);
    throw SignUpWithUsernameAndPasswordError.UNKNOWN;
  }
};

export const logInWithUsernameAndPassword = async (parameters: {
  username: string;
  password: string;
}): Promise<LogInWithUsernameAndPasswordResult> => {
  const passwordHash = createPasswordHash({
    password: parameters.password,
  });

  const user = await prismaClient.user.findUnique({
    where: {
      username: parameters.username,
      password: passwordHash,
    },
  });

  if (!user) {
    throw LogInWithUsernameAndPasswordError.INCORRECT_USERNAME_OR_PASSWORD;
  }

  const token = createJWToken({
    id: user.id,
    username: user.username,
  });

  return {
    token,
    user,
  };
};
