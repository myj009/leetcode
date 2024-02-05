import * as amqp from "amqplib";
import { Response } from "express";
import { CustomRequest } from "../types/user";
import cuid from "cuid";
import { submissionSchema } from "../types/submission";
import { prisma } from "..";
import Docker from "dockerode";
import fs from "fs";
import * as path from "path";

const submissionQueue = "submissions";
const responseQueue = "responses";

// Connect to rabbit mq
async function connectRabbitMQ() {
  const connection = await amqp.connect(
    "amqp://username:password@localhost:5672"
  );
  const channel = await connection.createChannel();
  return { connection, channel };
}

type Language = "cpp" | "java" | "javascript" | "go";

type msgContent = {
  problemId: number;
  code: string;
  lang: Language;
};

interface ExecutionResult {
  result: string;
  success: boolean;
}

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
          const result: ExecutionResult = JSON.parse(msg.content.toString());
          console.log("Returned - ", result);

          const sub = await prisma.submission.create({
            data: {
              id: cuid(),
              userId: userId,
              problemId: parseInt(req.params.id),
              code: parsedReq.code,
              language: parsedReq.lang,
              status: result.success ? "AC" : "WA",
            },
          });

          res.status(201).json({
            submission_id: sub.id,
            accepted: result.success,
            logs: result.result,
          });
          console.log("Received from queue", result);
          await channel.close();
          await connection.close();
        }
      },
      { noAck: true }
    );

    await channel.assertQueue(submissionQueue);
    console.log(correlationId, responseQueueName);
    channel.sendToQueue(submissionQueue, Buffer.from(JSON.stringify(msg)), {
      correlationId,
      replyTo: responseQueueName,
    });
    console.log("Sent to queue");
  } catch (e) {
    console.log(e);
  }
};

export const receiveFromQueue = async () => {
  try {
    const { connection, channel } = await connectRabbitMQ();
    channel.prefetch(1);
    await channel.assertQueue(submissionQueue);
    channel.consume(submissionQueue, async (msg) => {
      if (msg) {
        console.log("Received from queue");
        const content = JSON.parse(msg.content.toString()) as msgContent;
        try {
          const result = await ExecuteSolution(content);
          console.log(result);
          console.log(msg.properties);
          channel.sendToQueue(
            msg.properties.replyTo,
            Buffer.from(JSON.stringify(result)),
            {
              correlationId: msg.properties.correlationId,
            }
          );
        } catch (e) {
          console.log(e);
        } finally {
          channel.ack(msg);
        }
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
  console.log("creating container");
  let container: Docker.Container = {} as Docker.Container;
  try {
    container = await docker.createContainer(containerConfig);
    console.log("created container");
    // Start the container
    await container.start();
    console.log("started container");
  } catch (e) {
    console.log(e);
  }

  return container;
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
}

const ExecuteSolution = (content: msgContent) => {
  return new Promise<ExecutionResult>(async (resolve, reject) => {
    console.log("executing code");
    const container = await createDockerContainer(content);

    // send a TLE after 2sec
    const tle = setTimeout(async () => {
      console.log("sending a tle");
      resolve({
        result:
          "Time Limit Exceed!! 😔 \n \n - Optimize your code \n - Avoid infinite loops",
        success: false,
      });
      await container.stop();
    }, 2000);

    const containerExitStatus = await container.wait(); // wait for container to exit

    // get logs
    const logs = await container.logs({ stdout: true, stderr: true });
    console.log("raw logs", logs.toString());
    let cleanLogs = logs.toString().replace(/\x1B\[[0-9;]*[mGK]/g, "");
    console.log("clean logs", cleanLogs);

    // return output/error
    if (containerExitStatus.StatusCode === 0) {
      cleanLogs = cleanLogs.replace(/[\r\n]/g, "");
      resolve({ result: cleanLogs, success: true });
      clearTimeout(tle);
      await container.remove();
    } else {
      resolve({ result: cleanLogs, success: false });
      console.log("here");
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
      return "gcc";
    default:
      return "node:14";
  }
};

const GetDockerRunCommand = (lang: Language, code: string) => {
  const sourcePath = "../testfiles/1/test.cpp";
  const fileContent = fs.readFileSync(
    path.resolve(__dirname, sourcePath),
    "utf-8"
  );
  console.log(code);
  //console.log(fileContent);
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
        `mkdir app && cd app && echo "${fileContent}" > tests.cpp && echo "${code}" > myapp.cpp && g++ -o myapp tests.cpp myapp.cpp && ./myapp`,
      ];
      break;
    default:
      cmd = ["node", code];
  }

  console.log("returned cmd");
  return cmd;
};
