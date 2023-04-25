import express from 'express';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mime from 'mime';
import mongoose, { Schema } from 'mongoose';
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
const eventSchema = new Schema({name:String});
const userSchema=new mongoose.Schema({
  email:String,
  fname:String,
  lname:String,
  ph:String,
  eventcount:Number,
  events:{
    name:[String],
    eventArray:[Array],
  },
  Access:[String],
  Biogenesis:[String],
  Electronica:[String],
  Equilibria:[String],
  Informatica:[String],
  Mathematica:[String],
  Optica:[String],
  Pabbaja:[String],
  Robotics:[String],
  Sportiva:[String],
  Emulsion:[String],
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
    res.sendFile(__dirname+"/index.html")
  }
  else
  {
    res.render('main',{error:""});
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
  res.sendFile(__dirname + "/Robotics.html");
});
app.get("/Access", (req, res) => {
  res.sendFile(__dirname + "/Access.html");
});
app.get("/Biogenesis", (req, res) => {
  res.sendFile(__dirname + "/Biogenesis.html");
});
app.get("/Electronica", (req, res) => {
  res.sendFile(__dirname + "/Electronica.html");
});
app.get("/Emulsion", (req, res) => {
  res.sendFile(__dirname + "/Emulsion.html");
});
app.get("/Equilibria", (req, res) => {
  res.sendFile(__dirname + "/Equilibria.html");
});
app.get("/Informatica", (req, res) => {
  res.sendFile(__dirname + "/Informatica.html");
});
app.get("/Mathematica", (req, res) => {
  res.sendFile(__dirname + "/Mathematica.html");
});
app.get("/Optics", (req, res) => {
  res.sendFile(__dirname + "/Optics.html");
});
app.get("/Robotics", (req, res) => {
  res.sendFile(__dirname + "/Pabbaja.html");
});
app.get("/Sportiva", (req, res) => {
  res.sendFile(__dirname + "/Sportiva.html");
});
app.get("/login",(req,res)=>{
  res.render('main',{check:1,error:""})
})

app.get("/events",(req,res)=>{
  res.render('events',{count:req.user.eventcount});
})


app.post("/signin", async (req, res) => {
  User.register({username:req.body.username,fname:req.body.fname,lname:req.body.lname,ph:req.body.number,eventcount:0 },req.body.password,function(err,user)
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

async function addAccessValues(userId, accessArray, newValues) {
  try {
    const result = await User.updateOne({ _id: userId }, { $push: { [accessArray]: { $each: newValues } } });
    console.log(`${accessArray} array updated for user ${userId}`);
    console.log(result);
  } catch (err) {
    console.error(err);
  }
}

app.post('/reg-event', async(req, res) => {
  let count=0;
  for(const key in req.body) {
    for(const i in req.body[key]){
      count++;
    }
    const accessArray = key;
    const values=req.body[key];
    addAccessValues(req.user._id, accessArray, values);
    try {
      const result = await User.updateOne(
        { _id: req.user._id },
        { $push: { "events.name": accessArray, "events.eventArray":  values } } ,
      );      
    } catch(err) {
      console.error(err);
    }
  }
  try {
    const result = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { eventcount: count } },
      { new: true } // Return the updated document
    );
  } catch (err) {
    console.error(err);
  }
});


app.get("/dashboard",(req,res)=>{
  if(req.isAuthenticated())
  {
    console.log(req.user);
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


app.get("/logout",function(req,res){
  req.logOut(function(err)
  {
    if(err){
      console.log(err);
    }
    res.redirect("/")
  });
})
app.listen(process.env.PORT || 8080, () => { 
    console.log("Server Started");
});






































