
const Joi=require("joi");

const ListingSchema=Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),
        image:Joi.string().allow("",null),
    }).required(),
});

 module.exports=ListingSchema;

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),  // Rating must be between 1 and 5
        comment: Joi.string().required(),               // Comment is required
        listing: Joi.string().required()                // Listing is required (it will be an ObjectId)
    }).required()
});
