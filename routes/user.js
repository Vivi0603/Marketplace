const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.user;
const xss = require('xss');

router.get("/updateProfile", async (req, res) => {
  try {
    let id = req.session.user;
    const result = await userData.getUser(id);
    {res.render("posts/updateprofile", {
      user: result.user,
      products: result.products,
    });}
  } catch (e) {
    console.log(e);
    res.json(e);
  }
});

router.post("/updateProfile", async (req, res) => {
  if(req.session.user){
  try {
    let id = req.session.user
    let { name, address, phoneNumber,Email, Password } = req.body;
    if(name &&  name.trim().length == 0) throw [400,'Enter Name']
  if(address && address.trim().length == 0) throw [400,'Enter Address']
  if(Password && Password.trim().length == 0) throw [400,'Enter Password']
  if(Email && Email.trim().length == 0) throw [400,'Enter Email']
  if(name && !(/[a-zA-Z0-9]/.test(name))) throw [400,'Name should only contain numbers and alphabets']
  if(phoneNumber && !/^\d{3}-?\d{3}-?\d{4}$/.test(phoneNumber)) throw [400,'Incorrect Phone Number']
  if(Password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(Password)) throw [400,'Password must have one lower case,one upper case alphabets, one number and one special character']
  if(Email && ! /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(Email.toLowerCase())) throw [400,'Incorrect email format']
    
  let updateUser = await userData.updateProfile(
      name,
      Email,
      Password,
      address,
      phoneNumber,
      id
    );
    if(updateUser) res.redirect("/user/updateProfile");
    else{
      const result = await userData.getUser(id);
      res.render("posts/updateprofile", {
      user: result.user,
      products: result.products,
      error : "email already exists"
    })}
  } catch (e) {
    res.status(e[0]).render('posts/updateProfile',{error : e[1]})
  }
}
else{
  res.redirect('/')
}
});

router.get("/", async (req, res) => {
  try {
    if (req.session.user) {
      res.render("posts/landingpage", { user: req.session.user });
    } else {
      res.render("posts/landingpage");
    }
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.get("/signup", async (req, res) => {
  try {
    if (req.session.user) {
      res.status(200).redirect("/private");
    }
    res.status(200).render("posts/signup", {
      title: "Sign up",
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post("/signup", async (req, res) => {
  const name = xss(req.body.name);
  const address = xss(req.body.address);
  console.log(address);
  const phoneNumber = xss(req.body.phoneNumber);

  const email = req.body.email.toString().toLowerCase().trim();

  const password = req.body.password.toString();
  //.trim().replace(/\s/g, "");
  /*if (!email || !password) {
    res.status(400).render("posts/signup", {
      error: " HTTP 400 Error: Invalid input. All fields must be supplied.",
      partial: "signup",
    });
  }*/
  let check0 = phoneNumber;
  let result = check0.slice(0, 1);
  if (result == 0) {
    res.status(400).render("posts/signup", {
      error: "first digit of phone number should be non zero",
    });
  }

  const phoneNoCheck = /^\(?([0-9]{3})\)?[-]?([0-9]{3})[-]?([0-9]{4})$/;
  const phoneCheck = phoneNoCheck.test(phoneNumber);
  if (phoneCheck == false) {
    res.status(400).render("posts/signup", {
      error: "Phone number should be 10 digits",
    });
  }

  for (let i of email)
    if (i == " ") {
      res.status(401).render("posts/signup", {
        error: "Email has empty sapces.",
      });
    }
  for (let i of password)
    if (i == " ") {
      res.status(401).render("posts/signup", {
        error: "Password has empty sapces",
      });
    }
  if (email && name && password) {
    if (password.length < 6) {
      res.status(401).render("posts/signup", {
        //  title: "Create Account",
        error: "Password must be at least 6 characters.",
      });
    }
    if (name.length < 2) {
      res.status(401).render("posts/signup", {
        error: "Name must be at least 2 characters.",
      });
    }

    let nameCheck = /(?:[\w\s][^!@#$%^&*()?//><,.;:'"\{\}\[\]=+~`\-_|\\0-9]+)/;
    if (!name.match(nameCheck)) {
      res.status(401).render("posts/signup", {
        error: "Name is not valid.",
      });
    }

    let emailCheck = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!email.match(emailCheck)) {
      res.status(401).render("posts/signup", {
        error: "Email address is not valid.",
      });
    }
  } else {
    res.status(401).render("posts/signup", {
      title: "Sign Up",
      error: "You must fill out all fields.",
    });
  }

  try {
    let newUser = await userData.createUser(
      name,
      address,
      phoneNumber,
      email,
      password
    );
    if (newUser.userInserted == true) {
      res.redirect("/");
    } else {
      res.render("posts/signup", { error: "email already exists" });
    }
    return;
  } catch (e) {
    // res.json(error);
    res.status(400).render("posts/signup", {
      title: "Error",
      status: "404",
    });
  }
});

router.get("/private", async (req, res) => {
  const email = xss(req.body.email);
  const name = xss(req.body.name);

  if (!req.session.user) {
    res.redirect("/");
    return;
  }
  res.render("posts/private", {
    email: email,
    name: name,
  });
});

router.post("/login", async (req, res) => {
  const email = req.body.email.toString().toLowerCase().trim();
  const password = req.body.password.toString().trim();

  if (!email || !password) {
    res.status(401).render("posts/landingpage", {
      error: "Missing email or password.",
    });
    return;
  }

  // Retrieve user from file
  try {
    let newUser1 = await userData.checkUser(email, password);
    if (newUser1.authenticated == true) {
      req.session.user = newUser1.userId;
      res.json({login : true});
    } else {
      res.json({login : false});
    }
    // return to main page?
  } catch (e) {
    res.status(401).render("posts/landingpage", {
      hasErrors: true,
      error: "You did not provide a valid email and/or password.",
      title: "Login",
      email: email,

      partial: "signup",
    });
  }
});
router.get("/logout", async (req, res) => {
  res.clearCookie("AuthCookie");
  res.clearCookie("Build Session");
  req.session.destroy();
  res.render("posts/landingpage");
});

module.exports = router;
