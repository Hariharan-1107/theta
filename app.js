import express from 'express';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mime from 'mime';
import mongoose, { Schema } from 'mongoose';
import session from 'express-session';
import { v4 as uuidv4 } from 'uuid';
import passport  from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';
import { Console, log } from 'console';
import { check } from 'express-validator';
import crypto from 'crypto';

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
  id: {
    type: String,
    unique: true,
    required: true,
  },
  email:String,
  fname:String,
  lname:String,
  ph:String,
  Sastraite:Boolean,
  collegeName:String,
  events:{
    name:[String],
    eventArray:[Array],
  },
  Access: {
    type: [String],
    unique: true,
  },
  Biogenesis: {
    type: [String],
    unique: true,
  },
  Electronica: {
    type: [String],
    unique: true,
  },
  Equilibria: {
    type: [String],
    unique: true,
  },
  Informatica: {
    type: [String],
    unique: true,
  },
  Mathematica: {
    type: [String],
    unique: true,
  },
  Optica: {
    type: [String],
    unique: true,
  },
  Pabbaja: {
    type: [String],
    unique: true,
  },
  Robotics: {
    type: [String],
    unique: true,
  },
  Sportiva: {
    type: [String],
    unique: true,
  },
  Emulsion: {
    type: [String],
    unique: true,
  },
  password:String
})

userSchema.plugin(passportLocalMongoose);



function generateRandomId(length = 4) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

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
app.get("/Optica", (req, res) => {
  res.sendFile(__dirname + "/Optica.html");
});
app.get("/Pabbaja", (req, res) => {
  res.sendFile(__dirname + "/Pabbaja.html");
});
app.get("/Sportiva", (req, res) => {
  res.sendFile(__dirname + "/Sportiva.html");
});
app.get("/login",(req,res)=>{
  res.render('main',{check:1,error:""})
})

app.get("/events",(req,res)=>{
  if(req.isAuthenticated()){
    res.render('events');
  }else{
    res.redirect("/");
  }
})
async function addValues(userId, clusterArray, newValues) {
  try {
    const result = await User.updateOne({ _id: userId }, { $push: { [clusterArray]: newValues  } });
    console.log(`${clusterArray} array updated for user ${userId}`);
    console.log(result);
  } catch (err) {
    console.error(err);
  }
}
app.post("/register",async (req,res)=>{
  if(req.isAuthenticated()){
    const cluster=req.body.cluster;
    const event=req.body.event;
    addValues(req.user._id,cluster,event);
    const events=req.user.events.name;
    if(events.includes(cluster))
    {
      try {
        const index = events.indexOf(cluster);
        const reqArray=req.user.events.eventArray[index];
        reqArray.push(event);
        User.updateOne(
            {_id:req.user._id},
          { $set: { ['eventArray.' + index]: reqArray } },
        );
      } catch (err) {
        console.error(err);
      }
    }else{
      try {
        const result = await User.updateOne(
          { _id: req.user._id },
          { $push: { "events.name": cluster, "events.eventArray":  event } } ,
        );      
      } catch(err) {
        console.error(err);
      }
    }
    res.send("Registration Successfull")
  }
  else{
    res.redirect("/");
  }
})

app.post("/signin", async (req, res) => {
  User.register({username:req.body.username,id:generateRandomId(),fname:req.body.fname,lname:req.body.lname,ph:req.body.number,Sastraite:req.body.sastraite,collegeName:req.body.cname},req.body.password,function(err,user)
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

app.get("/dashboard",(req,res)=>{
  if(req.isAuthenticated())
  {
    console.log(req.user.events);
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






































