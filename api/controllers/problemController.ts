import { CustomRequest, User } from "../types/user";
import { Response } from "express";
import { problemSchema } from "../types/problem";
import { ZodError } from "zod";
import { prisma } from "..";

export const getProblems = async (req: CustomRequest, res: Response) => {
  const problems = await prisma.problem.findMany();
  console.log("getProblems");
  res.status(200).json(problems);
};

export const getProblem = async (req: CustomRequest, res: Response) => {
  console.log("getProblem");
  const problemId = parseInt(req.params.id);
  try {
    const problem = await prisma.problem.findUnique({
      where: {
        id: problemId,
      },
      include: {
        BoilerPlateCode: true,
      },
    });
    if (!problem) {
      return res.status(400).send("Problem not found");
    }
    const modifiedProblem = {
      ...problem,
      boilerPlate: problem?.BoilerPlateCode,
    };

    res.status(200).json(modifiedProblem);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const postProblem = async (req: CustomRequest, res: Response) => {
  try {
    const parsedReq = await problemSchema.parseAsync(req.body);
    const problem = await prisma.problem.create({
      data: {
        title: parsedReq.title,
        description: parsedReq.description,
        level: parsedReq.level,
        testCases: parsedReq.test_cases,
      },
    });

    console.log(problem.id);
    res.status(200).json({ id: problem.id });
  } catch (e) {
    console.log(e);
    if (e instanceof ZodError) {
      return res.status(400).send(e.issues[0].message);
    }
    res.status(500).send(e);
  }
};
