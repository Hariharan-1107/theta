import express from 'express';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mime from 'mime';
import mongoose from 'mongoose';
import User from './model/account.js';
import { Console, log } from 'console';
//Db section
      mongoose.connect("mongodb+srv://hariharan:hariharan11@cluster0.yctk4yu.mongodb.net/?retryWrites=true&w=majority");


const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');

async function checkCredentials(email, password) {
  const user = await User.findOne({ email, password });
  return !!user; // return true if user is found, false otherwise
}

app.get("/", (req, res) => {
  res.render('main')
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

app.post("/signin", async (req, res) => {
  console.log("hello");  
  const p=req.body.password;
    const cp=req.body.cpassword;
    const u=req.body.email;
    if(p===cp)
    {
      const user = await User.create({
        email:u,
        password:p,
      });
      res.redirect("/")
    }
    console.log("Sign in Successfull");
});
app.post("/login",async (req,res)=>{
  const em=req.body.email;
  const pas=req.body.password;
  if(await checkCredentials(em,pas))
  {
    console.log("Successful");
  } 
})
app.listen(process.env.PORT || 8080, () => { 
    console.log("Server Started");
});
