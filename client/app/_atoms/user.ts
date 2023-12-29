import { atom } from "recoil";

export const userState = atom({
  key: "user",
  default: (() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  })() as {
    token: string;
    email: string;
    userId: string;
    userType: "admin" | "user";
  } | null,
});
