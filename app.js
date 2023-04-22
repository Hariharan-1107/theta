import express from 'express';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mime from 'mime';
import mongoose from 'mongoose';
import session from 'express-session';
import passport  from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';
import { Console, log } from 'console';
import { check } from 'express-validator';


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');

app.use(session({
    secret:" Our Little Secret",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

//Db section
mongoose.connect("mongodb+srv://hariharan:hariharan11@cluster0.yctk4yu.mongodb.net/myapp?retryWrites=true&w=majority", {
  useNewUrlParser: true,});

const userSchema=new mongoose.Schema({
  email:String,
  fname:String,
  lname:String,
  password:String
})

userSchema.plugin(passportLocalMongoose);

const User =new mongoose.model('User',userSchema)

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

async function checkCredentials(email, password) {
  const user = await User.findOne({ email, password });
  return !!user; // return true if user is found, false otherwise
}

app.get("/", (req, res) => {
  if(req.isAuthenticated())
  {
    res.render('main',{check:1,error:""})
  }
  else
  {
    res.render('main',{check:0,error:""})
  }
 
});

app.get("/about", (req, res) => {
  res.render('about');
});

app.get("/clusters", (req, res) => {
  res.render('clusters');
});

app.get("/contact", (req, res) => {
  res.render('contact');
});

app.get("/Robotics", (req, res) => {
  res.sendFile(__dirname + "/Robotics/Robotics.html");
});
app.get("/login",(req,res)=>{
  res.render('main',{check:1,error:""})
})

app.post("/signin", async (req, res) => {
  User.register({username:req.body.username,fname:req.body.fname,lname:req.body.lname},req.body.password,function(err,user)
  {
    if(err){
        console.log(err);
        res.redirect("/");
    }else {
      passport.authenticate("local")(req,res,function(){
        res.redirect("/");
      })
    }
  })
});

app.post("/login",async(req,res)=>{
  const user = new User({
    username:req.body.username,
    password:req.body.password
  });

  req.login(user,function(err){
    if(err){
      console.log(err);
    }else{
      passport.authenticate("local")(req,res,function(){
        res.redirect("/");
      })
    }
  })
})


// app.post("/login",async (req,res)=>{
//   const em=req.body.email;
//   const pas=req.body.password;
//   if(await checkCredentials(em,pas))
//   { 
//       usercheck=1;
//       res.render('main',{check:usercheck,error:" "});
//   }
//   else
//   {
//     res.render('main',{check:0,error:"Invalid email or password"});
//   } 
// })
app.get("/dashboard",(req,res)=>{
  if(req.isAuthenticated())
  {
    res.render('dashboard',{user:req.user})
  }
  else
  {
    res.redirect('/login')
  }
})
app.get("/home",(req,res)=>{
  res.render('afterloginpage');
})

app.listen(process.env.PORT || 8080, () => { 
    console.log("Server Started");
});
