var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

// set for .ejs extensions
app.set("view engine", "ejs");

// get request to show you all the data; route path
app.get("/", function(req, res){
    // Testing res.send("this will be the landing page soon");
    res.render("landing");
});

var campgrounds = [
    {name: "Salmon Creek", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiIQ6lk8Q_sKC4ZVSdEgyD5oJ2W-bBSWvP2UQOcG8yxBXOH7lJ"},
    {name: "Granite Hill", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEqE6nJb-R__Yd7nUS1u6tQgeJV4qXbOS2eZO1JLbrGqKhLERgZA"},
    {name: "Mountain Rest", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjMfn2nukABuJd76nQVG-TUlx_5f49lV4HQAikPl3EtmQ37CyYlw"}
];


app.get("/campgrounds", function(req, res){
        res.render("campgrounds",{campgrounds:campgrounds});
});

// post.. create a new campground
app.post("/campgrounds", function(req, res){
    // res.send("You HIT THE POST ROUTE");
    // get data from form and add to campgrounds array
    // redirect back to campgrounds page
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image}
    campgrounds.push(newCampground);
    
     //redirect back to campgrounds page
    res.redirect("/campgrounds");
    
});

// get.. the data to send to the post
app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs");
});


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!"); 
});