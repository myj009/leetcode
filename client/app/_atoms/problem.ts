import { atom, selectorFamily } from "recoil";
import { LangType } from "../problems/types";

interface BoilerPlateSchema {
  language: LangType | "";
  code: string;
  problemId: number;
}

export interface ProblemSchema {
  id: number;
  title: string;
  description: string;
  testCases: [
    {
      input: string;
      output: string;
    }
  ];
  level: "easy" | "medium" | "hard";
  boilerPlate: BoilerPlateSchema[];
}

export const problemState = atom<ProblemSchema | null>({
  key: "problemState",
  default: null,
});

export const boilerPlateforLanguage = selectorFamily<
  BoilerPlateSchema | undefined,
  LangType
>({
  key: "boilerPlateforLanguage",
  get:
    (language: LangType) =>
    ({ get }) => {
      const problem = get(problemState);
      const boilerPlateForLanguage = problem?.boilerPlate?.find(
        (bp) => bp.language === language
      );
      return boilerPlateForLanguage;
    },
});
