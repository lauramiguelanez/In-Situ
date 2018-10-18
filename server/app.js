require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");
const cors = require("cors");

//const {MONGODB_URI} = process.private.env;
mongoose.Promise = Promise;
mongoose
  .connect(
    process.env.MONGODB_URI,
    //"mongodb://localhost:27017",
    { useNewUrlParser: true }
  )
  .then(x => {
    console.log(
      `Connected to Mongo! Database`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

const app_name = require("./package.json").name;
const debug = require("debug")(`${app_name}:${path.basename(__filename).split(".")[0]}`);

const app = express();

// Middleware Setup
var whitelist = [
  'http://localhost:3000', 'http://localhost:3010',
];
var corsOptions = {
  origin: function(origin, callback){
      var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
      callback(null, originIsWhitelisted);
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Enable authentication using session + passport
app.use(
  session({
    secret: "irongenerator",
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);
require("./passport")(app);
// Express View engine setup

app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true
  })
);


hbs.registerHelper("ifUndefined", (value, options) => {
  if (arguments.length < 2)
    throw new Error("Handlebars Helper ifUndefined needs 1 parameter");
  if (typeof value !== undefined) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});

// default value for title local
app.locals.title = "Scope App";




app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());


const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);
const cloudinary = require('./routes/uploadCloud');
app.use('/api/uploadCloud', cloudinary);
const spacesCRUD = require('./routes/spacesCrud');
app.use('/api/spaces', spacesCRUD(require('./models/Space')));
const catalogCRUD = require('./routes/catalogCRUD');
app.use('/api/catalog', catalogCRUD(require('./models/Catalog')));
const mediaCRUD = require('./routes/mediaCRUD');
app.use('/api/media', mediaCRUD(require('./models/Media')));

app.use((req, res, next) => {
  // If no routes match, send them the React HTML.
  res.sendFile(__dirname + "/public/index.html");
});

module.exports = app;
