import express from "express";
import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import questionsRoutes from "./routes/questions";

import { runQuery } from "./helpers";
import { configPassport, findUserByUID } from "./auth";

const app = express();

// Configure authentication using pasport.js
configPassport(passport);

app.use(cookieParser(process.env.CookieSecret));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.CookieSecret,
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.set("port", process.env.PORT || 3001);

// Serve react app statically in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.get("/api/current_user", (req, res) => {
  if (!req.user) {
    res.end();
    return;
  }

  findUserByUID(req.user._uid_)
    .then(user => {
      console.log("user found", user);
      res.json(user);
    })
    .catch(err => {
      res.status(500).send(err.message);
    });
});

app.get("/api/auth", passport.authenticate("github"));
app.get(
  "/api/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/error" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

app.use("/api/questions", questionsRoutes);

app.listen(app.get("port"), () => {
  console.log(`Server running on: http://127.0.0.1:${app.get("port")}/`); // eslint-disable-line no-console
});
