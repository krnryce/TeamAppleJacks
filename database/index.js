var token = require('../config.js')
var mongoose = require('mongoose');

mongoose.connect(token.mongoURI);


var db = mongoose.connection;

db.on('error', function () {
  console.log('mongoose connection error');
});

db.once('open', function () {
  console.log('quizdb connected successfully');
});

var userSchema = mongoose.Schema({
  name:String,
  email:String,
  password:String,
  googleId: String,
  displayName: String,
  globalScore: {
    type: Number,
    default: 0
  },
  attempts: [{
    quizName: String,
    score: Number
  }]
});

var User = mongoose.model('User', userSchema);

// Save user data
var saveUser = function (googleId, displayName, callback) {
  var info = {
    'googleId': googleId,
    'displayName': displayName
  };
  var newUser = new User(info);
  newUser.save(function (err, savedEntry) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, savedEntry);
    }
  })
};

var quizSchema = mongoose.Schema({
  quizzes: [{
    creator: String,
    quizName: String,
    imgUrl: String,
    questions: [{
      text: String,
      options: [String],
      correctAnswer: String,
    }],
  }]
});

var Quiz = mongoose.model('Quiz', quizSchema);

// Save quiz data
var saveQuiz = function (info, callback) {
  var newQuiz = new Quiz(info);
  newQuiz.save(function (err, savedEntry) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, savedEntry);
    }
  })
};

//CREATING GAMES SCHEMA - FROOTLOOPS - DONOT DELETE
var gameSchema = mongoose.Schema({
    Question: String,
    Answer: String,
    Option1: String,
    Option2: String,
});

var Games = mongoose.model('Games', gameSchema);

var saveGames = (gameQuestion) => {
  var game = new Games({
    Question: gameQuestion.Question,
    Answer: gameQuestion.Answer,
    Option1: gameQuestion.Option1,
    Option2: gameQuestion.Option2
  });
  game.save((err, savedGames) => {
    if(err) console.log('Error in saving game question', err);
    console.log('Success in saving game Questions', savedGames);
  });
}

var retrieveGames = (res) => {
  Games.find({}, (err, gameData) => {
    if(err) console.log('Error in getting game data from database ', err);
    console.log('Success in getting game data from database ');
    var data = JSON.stringify(gameData);
    res.status(200).send(data);
  })
}



// Confirm if user exists
var confirmUser = function (googleId, callback) {
  User.find({
    'googleId': googleId
  }, function (err, results) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  })
};

// Find by quiz name and return object with with quiz name and quiz questions
var returnQuiz = function (query, callback) {
  Quiz.find({
    'quizzes.quizName': query
  }, function (err, results) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  })
};

// Update quiz score and increment global score
var incrementScore = function (googleId, quizName, points, callback) {
  User.find({
    'googleId': googleId,
    'attempts.quizName': quizName
  }, function (err, result) {
    if (err) {
      callback(err, null);
    } else if (result.length === 0) {
      User.findOneAndUpdate({
          'googleId': googleId
        }, {
          $inc: {
            'globalScore': points
          },
          $push: {
            'attempts': {
              'quizName': quizName,
              'score': points
            }
          }
        }, {
          new: true
        },
        function (err, updatedEntry) {
          if (err) {
            callback(err, null);
          } else {
            callback(null, updatedEntry);
          }
        })
    } else {
      callback(null, result);
    }
  });
};

// Returns leaderboard (an array with objects) with ten highest scores in descending order
var leaderboardScore = function (callback) {
  User.find({}, function (err, results) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, results);
      }
    })
    .sort('-globalScore')
    .limit(10);
};


module.exports = User = mongoose.model('users',userSchema);
module.exports.saveUser = saveUser;
module.exports.saveQuiz = saveQuiz;
module.exports.confirmUser = confirmUser;
module.exports.returnQuiz = returnQuiz;
module.exports.incrementScore = incrementScore;
module.exports.leaderboardScore = leaderboardScore;
module.exports.saveGames = saveGames;
module.exports.retrieveGames = retrieveGames;
