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
}

export type ProblemProps = {
  params: {
    problemId: string;
  };
};

export type LangType = "go" | "cpp" | "java" | "javascript";

export const languages = [
  {
    value: "cpp",
    label: "C++",
  },
  {
    value: "go",
    label: "Go",
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
