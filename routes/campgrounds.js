var express = require("express"),
  router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// INDEX - Show all campgrounds
router.get("/", (req, res) => {
  // get all campground
  Campground.find({}, (err, allCampground) => {
    if (err) {
      console.log("====================================");
      console.log(err);
      console.log("====================================");
    } else {
      res.render("campgrounds/index", {
        campgrounds: allCampground
      });
    }
  });
});

router.post("/", middleware.isLoggedIn, (req, res) => {
  //get data from form and add to campgrounds array
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newCampground = {
    name: name,
    price: price,
    image: image,
    description: description,
    author: author
  };
  // Create a new campground and save to DB
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log("====================================");
      console.log(err);
      console.log("====================================");
    } else {
      // redirect to campgrounds
      res.redirect("/campgrounds");
    }
  });
  // campgrounds.push(newCampground)
});

router.get("/new", middleware.isLoggedIn, (req, res) =>
  res.render("campgrounds/new")
);

router.get("/:id", (req, res) => {
  // find the campgrouds with provided ID
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function (err, foundCampground) {
      if (err) {
        console.log("====================================");
        console.log(err);
        console.log("====================================");
      } else {
        res.render("campgrounds/show", {
          campground: foundCampground
        });
      }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwner, function (req, res) {
  Campground.findById(req.params.id, function (err, foundCampground) {
    res.render("campgrounds/edit", { campground: foundCampground });
  });
});
// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwner, function (req, res) {
  // find and update the correct campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (
    err,
    updatedCampground
  ) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwner, function (req, res) {
  Campground.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;
