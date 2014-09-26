var Sequelize = require('sequelize'),
  config = require('envcfg')(__dirname + '/../config/config.js'),
  bcrypt = require('bcrypt'),
  program = require('commander'),
  util = require('util');

program
  .version('0.0.1')
  .option('-u, --username [username]', 'Username')
  .option('-p, --password [password]', 'Password')
  .option('-e, --email [email]', 'Email Address')
  .parse(process.argv);

if (!program.password || !program.username || !program.email) {
  program.help();
}

// the application is executed on the local machine ... use mysql
var sequelize = new Sequelize(config.db.database, config.db.user,
  config.db.password, {
    host: config.db.host,
    port: config.db.port
  });

var User = sequelize.import(__dirname + '/../app/models/user');

sequelize.sync()
  .then(function () {

    var hash = bcrypt.hashSync(program.password, 4);

    console.log(util.format('Creating user %s (%s) with password hash %s',
      program.username,
      program.email, hash));

    User.create({
      username: program.username,
      password: hash,
      email: program.email,
      isAdmin: true
    })
      .then(function (u) {
        console.log(util.format('Created userId: %s', u.id));
        process.exit();
      })
      .catch(function (e) {
        console.error(e.parent.message);
        process.exit();
      });
  })
  .catch(function (err) {
    console.error(err);
    process.exit();
  });