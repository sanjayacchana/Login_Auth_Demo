var express               = require('express'),
	mongoose              = require('mongoose'),
	bodyParser            = require('body-parser'),
	passport              = require('passport'),
	passportLocal         = require('passport-local'),
	passportLocalMongoose = require('passport-local-mongoose'),
	User  				  = require('./models/user');

//Outh config of MongoDB
mongoose.connect("mongodb://localhost:27017/Auth_demo",{useUnifiedTopology: true, useNewUrlParser: true});

var app = express();

app.use(require('express-session')({
	secret: 'sanjay the untold story:-)', 
	resave: false, 
	saveUninitialized: false
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("view engine","ejs");


app.get("/",function(req,res){
	res.render("home");
});

app.get("/secret",isLoggedIn,function(req,res){
	res.render("secret");
});

app.get("/register",function(req,res){
	res.render("register");
});

app.post("/register",function(req,res){
	User.register(new User({username:req.body.username}),req.body.password,function(err,user){
		if(err){
			console.log(err);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req,res,function(){
			res.render("secret");
		});
	});
});


app.get("/login",function(req,res){
	res.render("login");
});

app.post("/login",passport.authenticate("local",{
	successRedirect: "/secret",
	failureRedirect: "/login"
}),function(req,res){
	
});

app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/");
});

//middleware 
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}
app.listen(3000,function(){
	console.log("Server Started ......");
})


