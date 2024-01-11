import { CustomRequest, User } from "../types/user";
import { Response } from "express";
import cuid from "cuid";
import { PrismaClient } from "@prisma/client";
import { submissionSchema } from "../types/submission";
import { ZodError } from "zod";

const prisma = new PrismaClient();

export const getSubmissions = async (req: CustomRequest, res: Response) => {
  const userId = req.userId;
  const problemId = parseInt(req.body.problem_id);
  console.log("getSubmissions", userId, problemId);
  try {
    console.log("here");
    const submissions = await prisma.submission.findMany({
      where: {
        userId,
        problemId,
      },
    });
    console.log(submissions);
    res.status(200).json(submissions);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const postSubmissions = async (req: CustomRequest, res: Response) => {
  const userId = req.userId!;
  try {
    const parsedReq = await submissionSchema.parseAsync(req.body);
    const isCorrect = Math.random() > 0.5;

    const sub = await prisma.submission.create({
      data: {
        id: cuid(),
        userId: userId,
        problemId: parseInt(req.params.id),
        code: parsedReq.code,
        language: parsedReq.lang,
        status: isCorrect ? "AC" : "WA",
      },
    });

    res.status(201).json({ submission_id: sub.id, accepted: isCorrect });
  } catch (e) {
    console.log(e);
    if (e instanceof ZodError) {
      return res.status(400).send(e.issues[0].message);
    }
    res.status(500).send(e);
  }
};
