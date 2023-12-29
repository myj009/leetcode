import * as jwt from "jose";

export async function decodeJWTToken(
  token: string
): Promise<{
  token: string;
  email: string;
  userId: string;
  userType: "admin" | "user";
}> {
  const payload = await jwt.decodeJwt(token);

  // Extract and return the relevant information from the decoded payload
  const { email, userId, userType } = payload as {
    email: string;
    userId: string;
    userType: "admin" | "user";
  };

  return { token, email, userId, userType };
}
