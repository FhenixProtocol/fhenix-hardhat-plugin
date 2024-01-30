// const path = require('path');
// process.chdir(path.join(__dirname)); 

const hre = require("hardhat");

async function runTask(taskName) {
  await hre.run(taskName);
}

const taskName = process.argv[2];

runTask(taskName);
