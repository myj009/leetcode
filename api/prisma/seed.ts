import { PrismaClient, ProblemLevel, Language } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Problem 1: Sort Array
  const sortArrayProblem = await prisma.problem.upsert({
    where: {
      id: 1,
    },
    update: {
      title: "Sort Array",
      description:
        "Given an array of integers, return the sorted array in ascending order.",
      testCases: JSON.stringify([
        {
          input: "3, 1, 4, 1, 5, 9, 2, 6, 5",
          output: "1, 1, 2, 3, 4, 5, 5, 6, 9",
        },
        { input: "5, 2, 8, 12, 1, 5", output: "1, 2, 5, 5, 8, 12" },
        { input: "1", output: "1" },
      ]),
      level: ProblemLevel.easy,
      boilerPlate: {
        create: {
          language: Language.cpp,
          code: `
#include <vector>
using namespace std;

vector<int> sortArray(vector<int>& nums) {
  // Your code here
}
          `.trim(),
        },
      },
    },
    create: {
      id: 1,
      title: "Sort Array",
      description:
        "Given an array of integers, return the sorted array in ascending order.",
      testCases: JSON.stringify([
        {
          input: "3, 1, 4, 1, 5, 9, 2, 6, 5",
          output: "1, 1, 2, 3, 4, 5, 5, 6, 9",
        },
        { input: "5, 2, 8, 12, 1, 5", output: "1, 2, 5, 5, 8, 12" },
        { input: "1", output: "1" },
      ]),
      level: ProblemLevel.easy,
      boilerPlate: {
        create: {
          language: Language.cpp,
          code: `
#include <vector>
using namespace std;

vector<int> sortArray(vector<int>& nums) {
  // Your code here
}
          `.trim(),
        },
      },
    },
  });

  // Problem 2: Max Element
  const maxElementProblem = await prisma.problem.upsert({
    where: {
      id: 2,
    },
    update: {
      title: "Maximum Element in Array",
      description: "Given an array of integers, find the maximum element.",
      testCases: JSON.stringify([
        { input: "1, 3, 2, 5, 4", output: "5" },
        { input: "-1, -5, -2, -8, -3", output: "-1" },
        { input: "100", output: "100" },
      ]),
      level: ProblemLevel.easy,
      boilerPlate: {
        create: {
          language: Language.cpp,
          code: `
#include <vector>
using namespace std;

int maxElement(vector<int>& nums) {
  // Your code here
}
          `.trim(),
        },
      },
    },
    create: {
      id: 2,
      title: "Maximum Element in Array",
      description: "Given an array of integers, find the maximum element.",
      testCases: JSON.stringify([
        { input: "1, 3, 2, 5, 4", output: "5" },
        { input: "-1, -5, -2, -8, -3", output: "-1" },
        { input: "100", output: "100" },
      ]),
      level: ProblemLevel.easy,
      boilerPlate: {
        create: {
          language: Language.cpp,
          code: `
#include <vector>
using namespace std;

int maxElement(vector<int>& nums) {
  // Your code here
}
          `.trim(),
        },
      },
    },
  });

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
