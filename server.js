const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
var logger = require("morgan");
const app = express();
const nodemailer = require("nodemailer");

app.use(cors());
/* for Angular Client (withCredentials) */
// app.use(
//   cors({
//     credentials: true,
//     origin: ["http://localhost:8081"],
//   })
// );

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(logger("dev"));
app.use(
  cookieSession({
    name: "bezkoder-session",
    keys: ["COOKIE_SECRET"], // should use as secret environment variable
    httpOnly: true,
    sameSite: 'strict'
  })
);

// database
const db = require("./app/models");
const Role = db.role;

db.sequelize.sync();
// force: true will drop the table if it already exists
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial();
// });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});


// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

app.use('/payment',paymentRouter)

var email;

function GenerateOTP()  {
  var otp = Math.random();
  otp = otp * 1000000;
  otp = parseInt(otp);
  console.log(otp);
  
  return otp;
}



const contactEmail = nodemailer.createTransport({
  host: "mail.athulyahomecare.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "noreply@athulyaseniorcare.com", // generated ethereal user
    pass: "Athulya@123", // generated ethereal password
  },
});

contactEmail.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready to Send");
  }
});



app.post("/otpsend", async (req, res) => {
  const email = req.body.email;
  
  otp = GenerateOTP();

  // Set up the mail options
  const mailOptions = {
    to: email,
    subject: "OTP for registration is:",
    html: `<h3>OTP for account verification is:</h3>
           <h1 style="font-weight:bold;">${otp}</h1>` // html body
  };


  
  // Send the mail
  contactEmail.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ status: "ERROR" });
    } else {
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('otp'); // Render the 'otp' view
    }
    
  });

  res.status(200).json({ status: "success" });
});


app.post('/otpsendnn', (req, res) => {
  email=req.body.email;

  // send mail with defined transport object
 var mail={
     to: req.body.email,
    subject: "Otp for registration is: ",
    html: "<h3>OTP for account verification is </h3>"  + "<h1 style='font-weight:bold;'>" + otp +"</h1>" // html body
  };
  
  // Check for error
  if (err) {
    res.status(500).json({ status: "ERROR" });
  } else if (!email) {
    res.status(404).json({ status: "Mail ERROR" });
  } else {
    res.status(200).json({ status: "OK" });
  }
});


app.post('/otpverify',function(req,res){

  if(req.body.otp==otp){
      res.send("You has been successfully registered");
  }
  else{
      res.render('otp',{msg : 'otp is incorrect'});
      res.send("Incorrect");
  }
});


// set port, listen for requests
const PORT = process.env.PORT || 8088;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.create({
    id: 1,
    name: "user",
  });

  Role.create({
    id: 2,
    name: "moderator",
  });

  Role.create({
    id: 3,
    name: "admin",
  });
}
