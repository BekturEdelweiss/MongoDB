const express = require("express");
const bodyParser = require("body-parser");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const Handlebars = require("handlebars");

var exphbs = require("express-handlebars");

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set("view engine", "handlebars");

mongoose.connect(
  "mongodb+srv://dbBektur:08069320beka@cluster0.qsmst.mongodb.net/test",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

// const Review = mongoose.model("Review", reviewSchema);
// var db = mongoose.connection;
// db.on("error", console.error.bind(console, "MongoDB connection error:"));
// var reviewSchema = new Schema({
//   title: String,
//   movieTitle: String,
//   description: String,
// });

const Review = mongoose.model("Review", {
  title: String,
  movieTitle: String,
  description: String,
});

// ROUTES

app.get("/reviews/new", (req, res) => {
  res.render("reviews-new", {});
});

app.get("/", (req, res) => {
  Review.find()
    .lean()
    .then((reviews) => {
      res.render("reviews-index", { reviews: reviews });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/reviews", (req, res) => {
  Review.create(req.body)
    .then((review) => {
      console.log(review);
      res.redirect(`/reviews/${review._id}`);
    })
    .catch((err) => {
      console.log(err.message);
    });
});

app.get("/reviews/:id", (req, res) => {
  Review.findById(req.params.id)
    .then((review) => {
      res.render("reviews-show", { review: review });
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// PORT
app.listen(3000, () => {
  console.log("Running on 3000");
});
