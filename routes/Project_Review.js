
const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsyc.js");
const ExpressError = require("../utils/ExpressError.js");
const listingSchema = require("../Project_Schema.js");
const { reviewSchema } = require("../Project_Schema.js");
const Listing = require("../models/Project_Listdata.js");
const Review=require("../models/Project_Review.js");
const {isLogging,isOwner} =require("../Project_Middleware.js")
const {isReviewAuthor} =require("../Project_Middleware.js")


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      const errMsg = error.details.map((el) => el.message).join(",");
      const expressError = new ExpressError(400, errMsg);
      return next(expressError);
    } else {
      next();
    }
  };
  //Reviews
  //Post Route       /listings/:id/reviews
  router.post("/",isLogging,validateReview, wrapAsync(async (req, res) => {
    console.log(req.params.id);
    const listing = await Listing.findById(req.params.id);  // Find the listing by ID
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    const newReview = new Review({
        comment: req.body.review.comment,
        rating: req.body.review.rating,
        listing: listing._id  
    });

    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    req.flash("success","New Review Created!");

    res.redirect(`/listings/${listing._id}`);
  }));
  
  //DELETE Route        /listings/:id/reviews/:reviewId
  router.delete("/:reviewId",isLogging,isReviewAuthor,wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success"," Review Deleted!");

    res.redirect(`/listings/${id}`)
  }))
  
  
  // app.get("/testListing", async (req, res) => {
  //   let sampleListing = new Listing({
  //     title: "My New Villa",
  //     description: "By the beach",
  //     price: 1200,
  //     location: "Calangute, Goa",
  //     country: "India",
  //   });
  
  //   await sampleListing.save();
  //   console.log("sample was saved");
  //   res.send("successful testing");
  // });
  

  module.exports=router;
