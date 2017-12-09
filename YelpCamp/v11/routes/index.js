var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var User        = require("../models/user");


// Root Route - get request to show you all the data; route path
router.get("/", function(req, res){
    // Testing res.send("this will be the landing page soon");
    res.render("landing");
});


// =============
// AUTH ROUTES
// =============

// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

// handle sign up logic
router.post("/register", function(req, res){
    //res.send("Signing you up...");
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
       if(err){
           //console.log(err);
           req.flash("error", err.message);
           return res.render("register");
       }
       passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to YelpCamp "+ user.username);
           res.redirect("/campgrounds");
       });
    });
    
});

// show login form
router.get("/login", function(req, res){
   res.render("login"); 
});

// handling login logic
// app.post ("/login", middleware, callback);
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
    //res.send("LOGIN LOGIC HAPPENS HERE");
});

//logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});


module.exports = router;