import { atom } from "recoil";
import { LangType } from "../problems/types";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const languageState = atom<LangType>({
  key: "languageAtom",
  default: "cpp",
  effects_UNSTABLE: [persistAtom],
});
