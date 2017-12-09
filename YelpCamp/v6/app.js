var express     = require("express");
var app         = express();
var bodyParser  = require("body-parser");
var mongoose    = require("mongoose");
var passport    = require("passport");
var LocalStrategy   = require("passport-local");
var Campground  = require("./models/campground");
var Comment     = require("./models/comment");
var User        = require("./models/user");
var seedDB      = require("./seeds");

// create the mongo db called yelp_camp
mongoose.connect("mongodb://localhost/yelp_camp_v5");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");  // set for .ejs extensions
app.use(express.static(__dirname + "/public"));
seedDB();

// PASSPORT CONFIGURATION AND METHODS
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});


// get request to show you all the data; route path
app.get("/", function(req, res){
    // Testing res.send("this will be the landing page soon");
    res.render("landing");
});


// ===================
//    RESTFUL ROUTES
// ===================


// INDEX - Show all campgrounds
app.get("/campgrounds", function(req, res){
        // Get all campgrounds from DB
        Campground.find({}, function(err, allCampgrounds){
            if(err) {
                console.log(err);
            } else {
                res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser: req.user});
            }
        });
});

// CREATE - add and create new campground to DB
app.post("/campgrounds", function(req, res){
    // res.send("You HIT THE POST ROUTE");
    // get data from form and add to campgrounds array
    // redirect back to campgrounds page
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    
    var newCampground = {name: name, image: image, description:desc}
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

// NEW - show form to create new campground (get the data to send to the post)
app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
    //find the campground with prodvided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
             //render show templage with that campground
             //res.send("This will be the show page one day!");
            res.render("campgrounds/show", {campground: foundCampground});     
        }
    });
});


// ===========================
// COMMENTS ROUTES
// ===========================

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});


// Post New Comment to Campground
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
           Comment.create(req.body.comment, function(err, comment){
               if(err){
                   console.log(err);
               } else {
                   campground.comments.push(comment);
                   campground.save();
                   res.redirect('/campgrounds/' + campground._id);
               }
           });
       }
    });
});

// ==========
// AUTH ROUTES
// =============

// show register form
app.get("/register", function(req, res){
   res.render("register"); 
});

// handle sign up logic
app.post("/register", function(req, res){
    //res.send("Signing you up...");
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
       if(err){
           console.log(err);
           return res.render("register");
       }
       passport.authenticate("local")(req, res, function(){
           res.redirect("/campgrounds");
       });
    });
    
});

// show login form
app.get("/login", function(req, res){
   res.render("login"); 
});

// handling login logic
// app.post ("/login", middleware, callback);
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
    //res.send("LOGIN LOGIC HAPPENS HERE");
});

//logic route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!"); 
});