const child_process = require('child_process');
const config = require(require('path').join(__dirname, "src", "config.json"));

console.log('Removing old localfhenix instances...');
child_process.execSync(`docker rm -f "${config.container_name}" 2> /dev/null`)

console.log('Pulling current localfhenix docker image...');
child_process.execSync(`docker pull "${config.image}"`)
