import {
  LOCALFHENIX_CONTAINER_NAME,
  TASK_FHENIX_DOCKER_STOP,
  TASK_FHENIX_DOCKER_START,
} from "../src/const";
import { isContainerRunning, stopLocalFhenix } from "../src/docker";

import { useEnvironment } from "./helpers";

describe("Fhenix Docker Tests", function () {
  afterEach(async () => {
    if (await isContainerRunning("localfhenix")) {
      stopLocalFhenix();
    }
  });

  describe("Task Fhenix Docker Startup", function () {
    useEnvironment("localfhenix");

    function _delay(ms: number): Promise<void> {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    it("Should successfully start and stop the server", async function () {
      // Start the server by running the task
      // spawn('ts-node', ['runTask.js', TASK_FHENIX_DOCKER], {
      //   cwd: path.join(__dirname, 'fixture-projects', 'localfhenix'),
      // });

      await this.hre.run(TASK_FHENIX_DOCKER_START);

      await _delay(3000);

      if (!isContainerRunning(LOCALFHENIX_CONTAINER_NAME)) {
        throw new Error("Server did not start");
      }

      // Wait for the server to stop
      await this.hre.run(TASK_FHENIX_DOCKER_STOP);

      if (isContainerRunning(LOCALFHENIX_CONTAINER_NAME)) {
        throw new Error("Server did not stop");
      }
    });
  });
});
