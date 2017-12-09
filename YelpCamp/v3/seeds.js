var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");


var data = [
    {
        name: "XMEN 1",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-0PZJumRwmdGgwMFPKwundimkz8SD6spakg_LnPcIu0JfL3U_",
        description: "Group 1"
    },
        {
        name: "XMEN 2",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-0PZJumRwmdGgwMFPKwundimkz8SD6spakg_LnPcIu0JfL3U_",
        description: "Group 2"
    },
    {
        name: "XMEN 3",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-0PZJumRwmdGgwMFPKwundimkz8SD6spakg_LnPcIu0JfL3U_",
        description: "Group 3"
    }
]


function seedDB(){
    // REMOVAL ALL CAMPGROUNDS
    Campground.remove({}, function(err){
       if(err){
           console.log(err);
       } 
       console.log("removed campgrounds!");
           //ADD A FEW CAMPGROUNDS
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err);
                } else {
                    console.log("added a campground");
                    //create a comment
                    Comment.create(
                        {
                            text: "This place is great, but I wish there was internet",
                            author: "Homer"
                        }, function(err, comment){
                               if(err){
                                   console.log(err);
                               } else {
                                   campground.comments.push(comment);
                                   campground.save();
                                   console.log("Created new comment");
                               }
                        });
                }
            });
        });
    });
}

module.exports = seedDB;