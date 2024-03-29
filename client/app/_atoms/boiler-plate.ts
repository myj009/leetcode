import { atom, selector, selectorFamily } from "recoil";
import { LangType } from "../problems/types";

interface BoilerPlateAtom {
  language: LangType | "";
  code: string;
  problemId: number;
}

const boilerPlateAtom = atom<BoilerPlateAtom[]>({
  key: "boilerPlateAtom",
  default: [],
});

const boilerPlateProblemId = selector<Number>({
  key: "boilerPlateProblemId",
  get: ({ get }) => {
    const boilerPlate = get(boilerPlateAtom);
    const problemId = boilerPlate[0]?.problemId;
    return problemId;
  },
});

const boilerPlateforLanguage = selectorFamily<
  BoilerPlateAtom | undefined,
  LangType
>({
  key: "boilerPlateforLanguage",
  get:
    (language: LangType) =>
    ({ get }) => {
      const boilerPlate = get(boilerPlateAtom);
      const boilerPlateForLanguage = boilerPlate.find(
        (bp) => bp.language === language
      );
      return boilerPlateForLanguage;
    },
});
