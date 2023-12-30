import { Router } from "express";
import {
  getProblems,
  getProblem,
  postProblem,
} from "../controllers/problemController";
import { adminAuthorization } from "../middleware/auth";

const router = Router();
router.get("/", getProblems);
router.get("/:id", getProblem);
router.post("/", adminAuthorization, postProblem);

export default router;
