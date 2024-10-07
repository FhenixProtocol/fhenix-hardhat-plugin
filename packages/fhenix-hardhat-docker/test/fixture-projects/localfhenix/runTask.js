import hre from "hardhat";

async function runTask(taskName) {
  await hre.run(taskName);
}

const taskName = process.argv[2];

runTask(taskName);
