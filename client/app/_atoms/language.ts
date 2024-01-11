import { atom } from "recoil";
import { LangType } from "../problems/types";

export const languageState = atom<LangType>({
  key: "languageAtom",
  default: "javascript",
});
