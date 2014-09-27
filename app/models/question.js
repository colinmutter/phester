module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Question', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          notEmpty: true
        }
      },
      description: {
        type: DataTypes.TEXT,
        validate: {
          notEmpty: true
        }
      },
      entryFunction: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true
        }
      },
      sampleInput: {
        type: DataTypes.TEXT,
        validate: {
          notEmpty: true
        }
      },
      testInput: {
        type: DataTypes.TEXT,
        validate: {
          notEmpty: true
        }
      }
    },

    {  
      classMethods: {    
        getQuestionsWithLastAnswers: function (userId) {      
          return sequelize.query(
            "SELECT  Q.*,  (SELECT isSuccessful FROM Answers WHERE questionId = Q.id AND userId = " +
            userId +
            " ORDER BY id DESC LIMIT 1) AS lastSubmissionSuccess,  (SELECT input FROM Answers WHERE questionId = Q.id AND userId = 1 ORDER BY id DESC LIMIT 1) AS lastSubmission FROM  Questions Q "
          );    
        }  
      }
    }
  );
};