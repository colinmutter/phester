/**
 * Answers Controller
 *
 * Submitted answers go here to be evaluated and persisted.
 *
 * @todo    add other language support
 * @author  Colin Mutter <colin.mutter@gmail.com>
 */

/**
 * Deps
 */
var locomotive = require('locomotive'),
  Controller = locomotive.Controller,
  Answer = require('../models').Answer,
  Question = require('../models').Question,
  AnswersController = new Controller(),
  auth = require('../../config/auth.js'),
  runner = require('../../config/runner-php.js');

/**
 * Expose
 */
module.exports = AnswersController;

/**
 * Ensure logged in for al ops
 */
AnswersController.before('*', auth.ensureLoggedIn);


// Ensure admin for viewing all answers
AnswersController.before(['index', 'show'], auth.ensureAdmin);

AnswersController.index = function () {
  var self = this;

  Answer.findAll()
    .then(function (answers) {
      self.respond({
        'json': function () {
          self.res.json({
            answers: answers
          });
        },
        default: function () {
          self.render({
            answers: answers
          });
        }
      });
    })
    .catch(function (error) {
      self.respond({
        'json': function () {
          self.res.json({
            error: error
          });
        },
        default: function () {
          self.render({
            error: error
          });
        }
      });
    });
};

AnswersController.show = function () {
  var self = this;
  var id = this.param('id');

  Question.find(id)
    .then(function (question) {
      if (!question) return self.res.send(404);
      self.respond({
        'json': function () {
          self.res.json({
            question: question
          });
        },
        default: function () {
          self.render({
            question: question
          });
        }
      });
    })
    .catch(function (error) {
      self.respond({
        'json': function () {
          self.res.json({
            question: null,
            error: error
          });
        },
        default: function () {
          self.next(error);
        }
      });
    });
};

/**
 * Persists and evaluates the code that was submitted
 */
AnswersController.run = function () {
  var self = this;
  saveAndRun(this.req, false, function (result) {
    self.res.json(result);
  });
};

/**
 * Persists and evaluates the code that was submitted
 * also sets the 'isFinal' flag
 */
AnswersController.submit = function () {
  var self = this;
  saveAndRun(this.req, true, function (result) {
    self.res.json(result);
  });
};

/**
 * Saves and runs the code submitted by the user.
 * @param  {Object}   req   request
 * @param  {Boolean}   final is final submission flag
 * @param  {Function} cb    callback(payload)
 */
function saveAndRun(req, final, cb) {
  var params = req.body;

  // Attach user id to the insertion params
  params.userId = req.user.id;

  Question.find(params.questionId)
  // Loaded the question
  .then(function (question) {

    // @todo validate this on input so try/catch no needed
    var testInput = JSON.parse(question.testInput);
    runner(params.input, question.entryFunction, testInput,
      function (err, res) {

        // Attach additional data to the answer record
        params.output = res.output || '';
        params.error = err || res.error;
        params.isSuccessful = !!res.isSuccessful;
        params.isFinal = final;

        // Create the answer
        Answer.create(params)
          .then(function (answer) {
            return cb({
              result: answer,
              inputOrig: res.inputOrig,
              error: null
            });
          })
          .catch(function (error) {
            return cb({
              result: null,
              inputOrig: res.inputOrig,
              error: error
            });
          });
      });
  })
  // Couldn't load question
  .catch(function (error) {
    return cb({
      result: null,
      error: error
    });
  });
}