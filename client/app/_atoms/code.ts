import { atom } from "recoil";

interface CodeState {
  value: string;
  enabled: boolean;
}

export const codeState = atom<CodeState>({
  key: "codeAtom",
  default: {
    value: "",
    enabled: true,
  },
});
