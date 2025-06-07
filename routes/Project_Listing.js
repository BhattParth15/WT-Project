
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsyc.js");
const ExpressError = require("../utils/ExpressError.js");
const listingSchema = require("../Project_Schema.js");
const { reviewSchema } = require("../Project_Schema.js");
const Listing = require("../models/Project_Listdata.js");
const {isLogging,isOwner} =require("../Project_Middleware.js")

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        const expressError = new ExpressError(400, errMsg);
        return next(expressError);
    } else {
        next();
    }
};

//Index Route      /listings
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("Project_Index.ejs", { allListings });
}));

//New Route       /listings/new
router.get("/new", isLogging,(req, res) => {
    // if(!req.isAuthenticated()){
    //     req.flash("error","You are not loging acount");
    //     res.redirect("/loging")
    // }
    res.render("Project_New.ejs");
});

//Show Route         /listings/:id
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate(
        {path:"reviews",
            populate:{path:"author"},
        }).populate("owner");

    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("Project_Show.ejs", { listing });
}));

//Create Route        /listings
router.post("/",isLogging, validateListing, wrapAsync(async (req, res, next) => {
    // if(!req.body.listing){
    //   throw new ExpressError(400,"Send valid data for listing");
    // }

    const newListing = new Listing(req.body.listing);
    // if(!newListing.title){
    //   throw new ExpressError(400,"Title is missing");
    // }
    // if(!newListing.description){
    //   throw new ExpressError(400,"Description is missing");
    // }
    // if(!newListing.location){
    //   throw new ExpressError(400,"Location is missing");
    // }

    newListing.owner=req.user._id;

    await newListing.save();
    req.flash("success", "New Listing Created!")
    res.redirect("/listings");
}
));

//Edit Route         /listings/:id/edit
router.get("/:id/edit", isOwner,isLogging,wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }

    res.render("Project_Edit.ejs", { listing });
}));

//Update Route         /listings/:id
router.put("/:id",isOwner, isLogging,validateListing, wrapAsync(async (req, res) => {
    // if(!req.body.listing){
    //   throw new ExpressError(400,"Send valid data for listing");
    // }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    req.flash("success"," Listing Updated!");

    res.redirect(`/listings/${id}`);
}));
  
//Delete Route          /listings/:id
router.delete("/:id",isOwner, isLogging,wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);

    req.flash("success","Listing Deleted!");

    res.redirect("/listings");
}));

module.exports=router;
