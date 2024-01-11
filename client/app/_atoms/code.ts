import { atom } from "recoil";

interface CodeAtom {
  value: string;
  enabled: boolean;
}

export const codeAtom = atom<CodeAtom>({
  key: "codeAtom",
  default: {
    value: "",
    enabled: true,
  },
});
