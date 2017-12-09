var express     = require("express");
var app         = express();
var bodyParser  = require("body-parser");
var mongoose    = require("mongoose");
var Campground  = require("./models/campground");
var seedDB      = require("./seeds");

seedDB();
// create the mongo db called yelp_camp
mongoose.connect("mongodb://localhost/yelp_camp_v4");

app.use(bodyParser.urlencoded({extended: true}));

// set for .ejs extensions
app.set("view engine", "ejs");


// get request to show you all the data; route path
app.get("/", function(req, res){
    // Testing res.send("this will be the landing page soon");
    res.render("landing");
});





// INDEX - Show all campgrounds
app.get("/campgrounds", function(req, res){
        // Get all campgrounds from DB
        Campground.find({}, function(err, allCampgrounds){
            if(err) {
                console.log(err);
            } else {
                res.render("campgrounds/index",{campgrounds:allCampgrounds});
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
    res.render("/campgrounds/new");
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



// ======================
// COMMENTS ROUTES
// ======================

app.get("/campgrounds/:id/comments/new", function(req, res){
    res.send("comments/new");
});





app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!"); 
});