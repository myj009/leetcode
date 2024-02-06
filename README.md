# Leetcode

This monorepo contains both the client and server components of the leetcode project. The client folder uses Nextjs with shadcn for the frontend, while the server folder uses Node.js for the backend. This project allows you to submit solutions in C++ for the problems on the website and run them in a containerised environment.
The backend system which gets new submissions, pushes it to a RabbitMQ queue. A receiver reads it off the queue, starts (or creates) a container, and executes the code inside the sandbox environment. The result of the evaluation is the passed back to the caller, which updates the frontend.

## Demo

https://github.com/myj009/leetcode/assets/54302833/2218d40f-0946-4127-ae9c-de1e64af1be8


## Prerequisites

Before running this project, please ensure that you have the following dependencies installed:

- Node.js (v14 or higher)
- Docker

## Getting Started

Follow the steps below to start the project locally:

1. Start the rabbitmq docker container
   Go to the /api directory and run

```
npm run start-containers
```

2. Start the backend server
   Go to the /api directory and run

```
npm install
npm run dev
```

3. Start the frontend server
   Go to the /client directory and run

```
npm install
npm run dev
```

Make sure ports 3000, 3001 and 5672 are not in use.
