const Express = require("express");
const app = Express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const port = process.env.PORT || 8080;
const signUpRoute = require("./api/routes/signup");
const loginRoute = require("./api/routes/login");
const favoriteMovieRoute = require("./api/routes/favoriteMovie");

const apiErrorHandler = require("./api/error-handler/apiErrorHandler");
const apiError = require("./api/error-handler/apiErrors");
mongoose.connect(
  `${process.env.MONGO_DB_URI}`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connected to db");
  }
);

mongoose.set("useFindAndModify", false);
app.all("*", (req, res, next) => {
  // CORS headers
  //use * to allow all or can set http://localhost:3000 for testing
  res.header(
    "Access-Control-Allow-Origin",
    "https://movies-detail.netlify.app"
  );
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Key, Authorization"
  );
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/auth/signup", signUpRoute);
app.use("/auth/login", loginRoute);
app.use("/movie/favorite", favoriteMovieRoute);

app.use((req, res, next) => {
  next(apiError.notFound("Route not found"));
});

app.use(apiErrorHandler);

app.listen(port, () => {
  console.log(`server started on =  http://localhost:${port}`);
});
