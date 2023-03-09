
const isPortReachable = require('is-port-reachable');
const path = require('path');
const dockerCompose = require('docker-compose');
const { execSync } = require('child_process');

module.exports = async () => {
  console.time('global-setup')

  const isDBReachable = await isPortReachable(3306)

  if (!isDBReachable) {
    console.log('\n🐳 Starting docker-compose for testing...')

    try {
      await dockerCompose.upAll({
        // env: path.join(__dirname, '.env'),
        cwd: path.join(__dirname),
        log: true,
      })

      // wait for the mysql database to be ready
      // sleep 1 is not enough -> 3
      await dockerCompose.exec(
        'db',
        ['sh', '-c', `while ! mysqladmin ping -h localhost -uroot -uroot --silent; do
        sleep 3
        done`],
        {
          cwd: path.join(__dirname),
        },
      )
    } catch (error) {
      console.error(error)
      throw error
    }


    // ️️️✅ Best Practice: Use npm script for data seeding and migrations
    execSync('yarn workspace server prisma generate && yarn workspace server prisma db push && yarn workspace server prisma migrate dev --name init', {
      stdio: 'inherit',
    })
  }
  console.timeEnd('global-setup')
}
