var locomotive = require('locomotive'),
  Controller = locomotive.Controller;

var pagesController = new Controller();

pagesController.main = function () {
  if (!this.req.user) {
    this.redirect('/login');
  }
  else {
    this.redirect('/test');
  }
}

pagesController.test = function () {
  this.render({
    user: this.req.user.username
  });
}

pagesController.done = function () {
  this.render();
}

pagesController.login = function () {
  this.render();
}

pagesController.logout = function () {
  this.req.logout();
  this.redirect('/');
}

pagesController.whoami = function () {
  this.res.json({
    identity: this.req.user
  });
}

module.exports = pagesController;