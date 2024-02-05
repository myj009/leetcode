import { atom } from "recoil";

export interface submissionState {
  accepted: boolean;
  logs: string;
  submission_id: string;
}

export const submissionState = atom<submissionState | null>({
  key: "submissionState",
  default: null,
});
