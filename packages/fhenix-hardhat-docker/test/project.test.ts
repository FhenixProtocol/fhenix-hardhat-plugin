import {
  LOCALFHENIX_CONTAINER_NAME,
  TASK_FHENIX_DOCKER_START,
  TASK_FHENIX_DOCKER_STOP,
} from "../src/const";
import { isContainerRunning, stopLocalFhenix } from "../src/docker";
import fs from "fs";
import path from "path";

import { useEnvironment } from "./helpers";

describe("Fhenix Docker Tests", function () {
  afterEach(async () => {
    if (isContainerRunning("localfhenix")) {
      stopLocalFhenix();
    }
  });

  describe("Task Fhenix Docker Startup", function () {
    useEnvironment("localfhenix");

    const sleep = (ms: number): Promise<void> =>
      new Promise((resolve) => setTimeout(resolve, ms));

    it("Should successfully start and stop the server", async function () {
      // Start the server by running the task
      // spawn('ts-node', ['runTask.js', TASK_FHENIX_DOCKER], {
      //   cwd: path.join(__dirname, 'fixture-projects', 'localfhenix'),
      // });

      await this.hre.run(TASK_FHENIX_DOCKER_START);

      const maxTries = 10;
      for (let tries = 0; tries <= maxTries; tries++) {
        if (tries === maxTries) {
          throw new Error("Server did not start");
        }
        if (isContainerRunning(LOCALFHENIX_CONTAINER_NAME)) {
          break;
        }
        await sleep(500);
      }

      // Wait for the server to stop
      await this.hre.run(TASK_FHENIX_DOCKER_STOP);

      if (isContainerRunning(LOCALFHENIX_CONTAINER_NAME)) {
        throw new Error("Server did not stop");
      }
    });

    it("Should clean deployments when clean flag is set", async function () {
      // Create a test deployment file/directory
      const deploymentsPath = path.join(process.cwd(), "deployments/localfhenix");

      if (!fs.existsSync(deploymentsPath)) {
        fs.mkdirSync(deploymentsPath, { recursive: true });
        fs.writeFileSync(path.join(deploymentsPath, "test.json"), "{}");
      }

      try {
        // Start server with clean flag
        await this.hre.run(TASK_FHENIX_DOCKER_START, { clean: true });

        // Verify deployments directory was cleaned
        const deploymentsExist = fs.existsSync(deploymentsPath);
        if (deploymentsExist) {
          throw new Error("Deployments directory still exists");
        }
      } finally {
        // Cleanup
        const deploymentsRootPath = path.join(process.cwd(), "deployments");
        if (fs.existsSync(deploymentsRootPath)) {
          fs.rmSync(deploymentsRootPath, { recursive: true, force: true });
        }
        await this.hre.run(TASK_FHENIX_DOCKER_STOP);
      }
    });

    it("Should not clean deployments when clean flag is not set", async function () {
      // Create a test deployment file/directory
      const deploymentsPath = path.join(process.cwd(), "deployments/localfhenix");

      if (!fs.existsSync(deploymentsPath)) {
        fs.mkdirSync(deploymentsPath, { recursive: true });
        fs.writeFileSync(path.join(deploymentsPath, "test.json"), "{}");
      }

      try {
        // Start server without clean flag
        await this.hre.run(TASK_FHENIX_DOCKER_START);

        // Verify deployments directory still exists
        const deploymentsExist = fs.existsSync(deploymentsPath);
        if (!deploymentsExist) {
          throw new Error("Deployments directory was unexpectedly removed");
        }
      } finally {
        // Cleanup
        const deploymentsRootPath = path.join(process.cwd(), "deployments");
        if (fs.existsSync(deploymentsRootPath)) {
          fs.rmSync(deploymentsRootPath, { recursive: true, force: true });
        }
        await this.hre.run(TASK_FHENIX_DOCKER_STOP);
      }
    });
  });
});
