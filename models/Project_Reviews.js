
const mongoose = require("mongoose");
const { type } = require("../Project_Schema");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    listing: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Listing', // References the Listing collection
        required: true    // listing is required
    },
    comment: {
        type: String,
        required: true    // comment is required
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true    // rating is required and must be between 1 and 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});
module.exports = mongoose.model("Review", reviewSchema);
