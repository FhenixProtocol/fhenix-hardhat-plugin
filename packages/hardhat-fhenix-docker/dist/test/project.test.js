"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const const_1 = require("../src/const");
const docker_1 = require("../src/docker");
const helpers_1 = require("./helpers");
describe("Fhenix Docker Tests", function () {
    afterEach(async () => {
        if (await (0, docker_1.isRunningContainer)("localfhenix")) {
            (0, docker_1.stopLocalFhenix)();
        }
    });
    describe("Task Fhenix Docker Startup", function () {
        (0, helpers_1.useEnvironment)("localfhenix");
        function _delay(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        }
        it("Should successfully start and stop the server", async function () {
            // Start the server by running the task
            // spawn('ts-node', ['runTask.js', TASK_FHENIX_DOCKER], {
            //   cwd: path.join(__dirname, 'fixture-projects', 'localfhenix'),
            // });
            await this.hre.run(const_1.TASK_FHENIX_NODE);
            await _delay(3000);
            if (!(0, docker_1.isRunningContainer)(const_1.LOCALFHENIX_CONTAINER_NAME)) {
                throw new Error("Server did not start");
            }
            // Wait for the server to stop
            await this.hre.run(const_1.TASK_FHENIX_DOCKER_STOP);
            if ((0, docker_1.isRunningContainer)(const_1.LOCALFHENIX_CONTAINER_NAME)) {
                throw new Error("Server did not stop");
            }
        });
    });
});
//# sourceMappingURL=project.test.js.map