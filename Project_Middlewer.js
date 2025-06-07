const Listing = require("./models/Project_Listdata.js");
const Review=require("./models/Project_Review.js");

module.exports.isLogging=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You  have not loging acount");
        return res.redirect("/login")
    }
    next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl;
    }
    next();
}
//currUser._id.equals(listing.owner._id)

module.exports.isOwner= async(req,res,next)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!res.locals.currUser || !listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error" , "You are not Owner Of this Listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isReviewAuthor= async(req,res,next)=>{
    let { id ,reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!res.locals.currUser || !review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error" , "You are not Owner Of this Review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
