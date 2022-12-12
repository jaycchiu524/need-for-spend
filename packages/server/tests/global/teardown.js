const isCI = require('is-ci');
const dockerCompose = require('docker-compose');
const path = require('path');

module.exports = async () => {
  if (isCI) {
    await dockerCompose.down({
      cwd: path.join(__dirname),
      // config: 'docker-compose.yml',
      log: true,
    })
  }
}
