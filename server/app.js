const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const mongoose = require('mongoose');
const sendMail = require('./mail');
const studentRouter = require('./routes/student-router');
const teacherRouter = require('./routes/teacher-router');
// const adminRouter = require('./routes/admin-routes');
const userRouter = require('./routes/user-router');

const app = express();

const dbName = 'TestingSystem';
const connection = `mongodb://localhost:27017/${dbName}`;
mongoose.Promise = global.Promise;

async function connectDatabase() {
  mongoose.connect(connection, { useNewUrlParser: true })
    .then(() => {
      console.log('Connected to database!!!');
    })
    .catch((err) => {
      throw new Error(err);
    });
}

connectDatabase();

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('ups');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'EXADELULGOSHIPKE-HE',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    url: `${connection}-session`,
    ttl: 3 * 24 * 60 * 60,
  }),
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// app.use('/api/', authorization??);
app.use('/api/student', studentRouter);
app.use('/api/user', userRouter);
app.use('/api/teacher', teacherRouter);
// app.use('/api/admin', adminRouter);

const server = app.listen(3001, () => console.log(`Server is listening on port ${server.address().port}`));
