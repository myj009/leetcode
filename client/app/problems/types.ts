interface ProblemSchema {
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
}

export type ProblemProps = {
  params: {
    problemId: string;
  };
};

export type LangType = "cpp" | "java" | "javascript" | "python";

export const languages = [
  {
    value: "cpp",
    label: "C++",
  },
  {
    value: "javascript",
    label: "Javascript",
  },
  {
    value: "java",
    label: "Java",
  },
];

export interface BoilerPlateSchema {
  problemId: number;
  language: LangType;
  code: string;
}
