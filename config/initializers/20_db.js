var Sequelize = require('sequelize');

module.exports = function (done) {

  // the application is executed on the local machine ... use mysql
  var sequelize = new Sequelize(this.config.db.database, this.config.db.user,
    this.config.db.host);
  var modelPath = __dirname + '/../../app/models';
  var registry = require(modelPath);

  // register each sequelize model...
  registry.register(sequelize.import(modelPath + '/user'));
  registry.register(sequelize.import(modelPath + '/question'));
  registry.register(sequelize.import(modelPath + '/answer'));

  sequelize.sync()
    .then(function () {
      done();
    })
    .catch(function (error) {
      done(new Error(error));
    });
}