const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/Project_Listdata.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsyc.js")
const ExpressError=require("./utils/ExpressError.js")
const listingSchema =require("./Project_Schema.js")
const {reviewSchema}=require("./Project_Schema.js")
const Review=require("./models/Project_Review.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/Project_User.js");

const listings=require("./routes/Project_Listing.js");  //Router
const reviews=require("./routes/Project_Reviews.js");   //Router
const user=require("./routes/Project_User.js");         //Router


main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/project");
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const sessionOptions={
  secret:"mysupersecretcode",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge:7 * 24 * 60 * 60 * 1000,
    httpOnly:true,
  }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
})

app.get("/demouser",async(req,res)=>{
  let fakeUser=new User({
    email:"student@gmail.com",
    username:"Parth Bhatt",
  });
  let registerdUser=await User.register(fakeUser,"helloworld");
  res.send(registerdUser);
})



app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

// const validateListing=(req,res,next)=>{
//   let{error}=listingSchema.validate(req.body);
//   if(error){
//     let errMsg=error.details.map((el)=>el.message).join(",");
//     throw new ExpressError(400,error);
//   }else{
//     next()
//   }
// }

app.use("/listings", listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",user);


app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page Not Found"));  
})

app.use((err,req,res,next)=>{
  let{statusCode=550,message="Somthing Went Wrong"}=err;
  res.status(statusCode).render("Project_Error.ejs",{err,message});
  // res.status(statusCode).send(message)
})

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});



