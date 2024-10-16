import { CustomRequest, User } from "../types/user";
import { Response } from "express";
import cuid from "cuid";
import { submissionSchema } from "../types/submission";
import { ZodError } from "zod";
import { sendToQueue } from "./rabbitmq";
import { prisma } from "..";

export const getSubmissions = async (req: CustomRequest, res: Response) => {
  const userId = req.userId;
  const problemId = parseInt(req.body.problem_id);
  // console.log("getSubmissions", userId, problemId);
  try {
    // console.log("here");
    const submissions = await prisma.submission.findMany({
      where: {
        userId,
        problemId,
      },
      orderBy: {
        submittedOn: "desc",
      },
    });
    // console.log(submissions);
    res.status(200).json(submissions);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const getSubmission = async (req: CustomRequest, res: Response) => {
  const userId = req.userId;
  const submissionId = req.query["submissionId"] as string;

  try {
    const submission = await prisma.submission.findUnique({
      where: {
        id: submissionId,
      },
    });
    res.status(200).json(submission);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const postSubmissions = async (req: CustomRequest, res: Response) => {
  const userId = req.userId!;
  try {
    // Send to queue
    const msg = {
      problemId: parseInt(req.params.id),
      req,
      res,
    };
    await sendToQueue(req, res);
  } catch (e) {
    console.log(e);
    if (e instanceof ZodError) {
      return res.status(400).send(e.issues[0].message);
    }
    res.status(500).send(e);
  }
};
