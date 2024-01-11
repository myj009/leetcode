import * as jwt from "jose";
import { LangType } from "../problems/types";

export async function decodeJWTToken(token: string): Promise<{
  token: string;
  email: string;
  userId: string;
  userType: "admin" | "user";
  language: LangType;
}> {
  const payload = await jwt.decodeJwt(token);

  // Extract and return the relevant information from the decoded payload
  const { email, userId, userType, language } = payload as {
    email: string;
    userId: string;
    userType: "admin" | "user";
    language: LangType;
  };

  return { token, email, userId, userType, language };
}
