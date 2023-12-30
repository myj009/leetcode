export interface Problem {
  id: number;
  title: string;
  description: string;
  testCases: {
    input: string;
    output: string;
  };
  level: "easy" | "medium" | "hard";
}
