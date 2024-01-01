import { LangType } from "../../types";

type SubmissionStatus = "AC" | "WA";

export type SubmissionSchema = {
  id: string;
  userId: string;
  problemId: number;
  code: string;
  language: LangType;
  status: SubmissionStatus;
  submittedOn: Date;
};
