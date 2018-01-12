var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database(':memory:');
var router = new express.Router();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

app.get('/favourites', function (req, res) {
  console.log("inside get");
    db.serialize(function () {
      db.all("select ROWID as id, title, category, description, link from favourites", (err, rows) => {
        res.send(rows);
      })
    });
})

app.post('/favourites', function (req, res) {
    console.log("inside post");
    var newFavourite = req.body;
    db.serialize(function () {
        var stmt = db.prepare('INSERT INTO favourites (title, category, description, link) VALUES (?, ?, ?, ?)');
        stmt.run([newFavourite.title, newFavourite.category, newFavourite.description, newFavourite.link],
            function(){
                newFavourite.id = this.lastID;
                res.send(newFavourite);
            });
        stmt.finalize();
    });
})

app.put('/favourites', function (req, res) {
    var updatedFavourite = req.body;
    db.serialize(function () {
        db.run("UPDATE favourites SET title = ?, description = ?, link = ? WHERE ROWID = ?",
            updatedFavourite.title,
            updatedFavourite.description,
            updatedFavourite.link,
            updatedFavourite.id);
        res.send(updatedFavourite);
    });
})

db.serialize(function () {
    db.run('CREATE TABLE favourites (title VARCHAR(400), category VARCHAR(200), description VARCHAR(200), link VARCHAR(500))')
    var stmt = db.prepare('INSERT INTO favourites (title, category, description, link) VALUES (?, ?, ?, ?)')

    stmt.run(["facebook", "social networks", "My facebook acc", "https://www.facebook.com/"]);
    stmt.run(["gmail", "social networks", "My @mail", "https://www.gmail.com.com/"]);
    stmt.run(["vkontakte", "social networks", "My vk acc", "https://www.vk.com/"]);


    stmt.finalize()

    db.each('SELECT title, ROWID as id, category, description, link FROM favourites', function (err, row) {
        console.log(row.id + ': ' + row.description)
    })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use(router);

module.exports = app;
