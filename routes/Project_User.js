
const express = require("express");
const router = express.Router();
const User = require("../models/Project_User.js");
const wrapAsync = require("../utils/wrapAsyc.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../Project_Middleware.js");

router.get("/signup", (req, res) => {
    res.render("users/Project_Signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerdUser = await User.register(newUser, password);
        console.log(registerdUser);
        req.login(registerdUser,(err)=>{
            if(err){
                next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings");
        })
        // req.flash("success", "Welcome to Wanderlust");
        // res.redirect("/listings");
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/singup");
    }
}))

router.get("/login", (req, res) => {
    res.render("users/Project_Login.ejs");
});

router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local",{
    failureRedirect:"/login",
    failurFalsh:true
}),
async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust");
    let redirectUrl= res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
    //res.redirect("/listings");
}
);

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","you are Logout!");
        res.redirect("/listings")
    })
})

module.exports = router;
