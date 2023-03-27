import express from "express";
import bodyParser from "body-parser";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";


mongoose
  .connect("mongodb://127.0.0.1:27017", {
    dbName: "backend",
  })
  .then(() => console.log("MonogoDB is Connected"))
  .catch((e) => console.log("Some Error occurred"));

const messageSchema =  new mongoose.Schema({
    name: String,
    email: String,
    message: String,
})
const Message = mongoose.model("Message",messageSchema)


const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(path.resolve(), "public")));
app.set("view engine", "ejs");
app.use(cookieParser());

const isAuthenticated = (req, res, next) =>{
  const { token } = req.cookies;
  if(token){
    res.render("index");
    next();
    
  }else{
    res.render("login")
  }
  
}

app.get("/", isAuthenticated, (req, res) => {
  res.render("logout")
});


app.post("/login", (req, res)=>{
  console.log(req.body)
  


  res.cookie("token", "iamin",  {
      httpOnly: true,
      expires: new Date(Date.now() + 60 *1000)
  });
  res.redirect("/")
})

app.get("/logout", (req, res)=>{
  res.cookie("token", "null",{
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.redirect("/")
})




app.get("/success", (req, res) => {
    res.render("success");
  });

app.post("/contact", (req, res) => {
     Message.create({name: req.body.name, email: req.body.email, Message: req.body.message})
    res.redirect("success");
});




app.get("/users", (req, res) => {
  res.json({
  users,
  });
});





app.listen(3000, () => {
  console.log("Server is Listening on port 3000");
});
