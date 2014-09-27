/**
 * Pages Controller
 *
 * Standard UI pages
 *
 * @author  Colin Mutter <colin.mutter@gmail.com>
 */

/**
 * Deps
 */
var locomotive = require('locomotive'),
  Controller = locomotive.Controller,
  PagesController = new Controller(),
  auth = require('../../config/auth.js');

/**
 * Login before starting the test...
 */
PagesController.before(['test', 'main', 'whoami'], auth.ensureLoggedIn);

/**
 * Expose
 */
module.exports = PagesController;

/**
 * Site root, redirect to test
 */
PagesController.main = function () {
  this.redirect('/test');
}

/**
 * Actual test endpoint
 */
PagesController.test = function () {
  this.render({
    user: this.req.user.username
  });
}

/**
 * Completed test endpoint
 */
PagesController.done = function () {
  this.render();
}

/**
 * Login endpoint
 */
PagesController.login = function () {
  if (this.req.user) {
    return this.redirect('/test');
  }
  this.render();
}

/**
 * Logout endpoint
 */
PagesController.logout = function () {
  this.req.logout();
  this.redirect('/');
}

/**
 * Service to retrieve credentials
 */
PagesController.whoami = function () {
  this.res.json({
    identity: this.req.user
  });
}