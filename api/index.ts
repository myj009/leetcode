import adminRoute from "./routes/adminRoute";
import problemRoute from "./routes/problemRoute";
import userRoute from "./routes/userRoute";
import submissionRoute from "./routes/submissionRoute";
import cors from "cors";
import { receiveFromQueue } from "./controllers/rabbitmq";
import { PrismaClient } from "@prisma/client";

const express = require("express");

const app = express();
const port = 3001;

export const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());
app.use("/admin", adminRoute);
app.use("/user", userRoute);
app.use("/problems", problemRoute);
app.use("/submissions", submissionRoute);

receiveFromQueue();

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
