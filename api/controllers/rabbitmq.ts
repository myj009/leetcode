import * as amqp from "amqplib";
import { Response } from "express";
import { CustomRequest } from "../types/user";
import cuid from "cuid";
import { submissionSchema } from "../types/submission";
import { prisma } from "..";
import Docker from "dockerode";
import fs from "fs";

const submissionQueue = "submissions";
const responseQueue = "responses";

// Connect to rabbit mq
async function connectRabbitMQ() {
  const connection = await amqp.connect("amqp://localhost:5672");
  const channel = await connection.createChannel();
  return { connection, channel };
}

type Language = "cpp" | "java" | "javascript" | "go";

type msgContent = {
  problemId: number;
  code: string;
  lang: Language;
};

export const sendToQueue = async (req: CustomRequest, res: Response) => {
  const parsedReq = await submissionSchema.parseAsync(req.body);
  const problemId = parseInt(req.params.id);
  const userId = req.userId!;
  const msg: msgContent = {
    problemId: problemId,
    code: parsedReq.code,
    lang: parsedReq.lang,
  };

  try {
    const { connection, channel } = await connectRabbitMQ();
    const responseQueue = await channel.assertQueue("", { exclusive: true });
    const responseQueueName = responseQueue.queue;
    const correlationId = cuid();

    channel.consume(
      responseQueueName,
      async (msg) => {
        if (msg) {
          const result = JSON.parse(msg.content.toString());

          const sub = await prisma.submission.create({
            data: {
              id: cuid(),
              userId: userId,
              problemId: parseInt(req.params.id),
              code: parsedReq.code,
              language: parsedReq.lang,
              status: result.isCorrect ? "AC" : "WA",
            },
          });

          res
            .status(201)
            .json({ submission_id: sub.id, accepted: result.isCorrect });
          console.log("Received from queue", result);
          await channel.close();
          await connection.close();
        }
      },
      { noAck: true }
    );

    await channel.assertQueue(submissionQueue);
    channel.sendToQueue(submissionQueue, Buffer.from(JSON.stringify(msg)), {
      correlationId,
      replyTo: responseQueueName,
    });
    console.log("Sent to queue", msg);
  } catch (e) {
    console.log(e);
  }
};

export const receiveFromQueue = async () => {
  try {
    const { connection, channel } = await connectRabbitMQ();
    channel.prefetch(1);
    await channel.assertQueue(submissionQueue);
    channel.consume(submissionQueue, (msg) => {
      if (msg) {
        const content = JSON.parse(msg.content.toString()) as msgContent;
        try {
          const result = ExecuteSolution(content);
          channel.sendToQueue(
            msg.properties.replyTo,
            Buffer.from(JSON.stringify(result)),
            {
              correlationId: msg.properties.correlationId,
            }
          );

          channel.ack(msg);
        } catch (e) {
          console.log(e);
        }
        console.log("Received from queue", content);
        channel.ack(msg);
      }
    });
  } catch (e) {
    console.log(e);
  }
};

// Create container according to user selected language
async function createDockerContainer(content: msgContent) {
  const docker = new Docker();
  const containerConfig = {
    Image: GetDockerBaseImage(content.lang),
    Cmd: GetDockerRunCommand(content.lang, content.code), // ["node", "-e", code]
    Tty: true,
    // HostConfig: {
    //   StopTimeout: 2, // Stop the container after 2 seconds
    // },
  };
  // same as docker create --image imageName --tty --command cmdToRun
  const container = await docker.createContainer(containerConfig);
  // Start the container
  await container.start();
  // Copy the file to the container
  // const containerId = container.id;
  // const sourcePath = "testfiles/1/test.cpp"; // Replace with your local file path
  // const destinationPath = "app/test.cpp"; // Replace with the desired path inside the container

  // try {
  //   const fileContent = fs.readFileSync(sourcePath, "utf-8");
  //   container.putArchive(fileContent, { path: destinationPath });
  // } catch (error) {
  //   console.error("Error copying file to container:", error);
  // }

  return container;
}

const ExecuteSolution = (content: msgContent) => {
  return new Promise(async (resolve, reject) => {
    console.log("executing code");
    const container = await createDockerContainer(content);

    // send a TLE after 2sec
    const tle = setTimeout(async () => {
      console.log("sending a tle");
      resolve({
        result:
          "Time Limit Exceed!! 😔 \n \n - Optimize your code \n - Avoid infinite loops",
        sucess: false,
      });
      await container.stop();
    }, 2000);

    const containerExitStatus = await container.wait(); // wait for container to exit

    // get logs
    const logs = await container.logs({ stdout: true, stderr: true });

    // return output/error
    if (containerExitStatus.StatusCode === 0) {
      resolve({ result: logs.toString(), sucess: true });
      clearTimeout(tle);
      await container.remove();
    } else {
      resolve({ result: logs.toString(), sucess: false });
      clearTimeout(tle);
      await container.remove();
    }
  });
};

const GetDockerBaseImage = (lang: Language) => {
  switch (lang) {
    case "javascript":
      return "node:14";
    case "java":
      return "openjdk:16";
    case "cpp":
      return "gcc:latest";
    default:
      return "node:14";
  }
};

const GetDockerRunCommand = (lang: Language, code: string) => {
  const sourcePath = "testfiles/1/test.cpp";
  const fileContent = fs.readFileSync(sourcePath, "utf-8");
  let cmd;
  switch (lang) {
    case "javascript":
      cmd = ["node", code];
    case "java":
      cmd = ["java", code];
    case "cpp":
      cmd = [
        "bash",
        "-c",
        `mkdir app && cd app && echo "${sourcePath} ? tests.cpp && echo "${code}" > myapp.cpp && g++ -o myapp tests.cpp && ./myapp`,
      ];
      break;
    default:
      cmd = ["node", code];
  }
  return cmd;
};
