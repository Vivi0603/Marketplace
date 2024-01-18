const mongoCollections = require("../config/mongoCollections");
const express = require("express");
const router = express.Router();
const data = require("../data");
const productData = data.product;
const multer = require("multer");
const product = mongoCollections.product;
const { ObjectId } = require("bson");
const xss = require('xss');

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});
const upload = multer({ storage: fileStorageEngine });

router.get("/productdetails/:id", async (req, res) => {
  if(req.session.user){
    validateId(xss(req.params.id))
  try {

    const prod = await productData.getProduct(xss(req.params.id));
    let comments = prod.comments;

    res.status(200).render("post/product", {
      title: "Product Details",
      prod: prod,
      comments: comments,
    });
  } catch (e) {
    res.status(e[0]).render('posts/error',{ error: e[1] });
  }
}
});

router.post("/:id", async (req, res) => {
  if(req.session.user){
validateId(xss(req.params.id))
  try {
    //const { username, password } = usersData;
    const newcomment = await productData.createcomment(
      req.params.id,
      req.body.phrase,
      req.session.user
    );
    res.redirect(`/product/productdetails/${req.params.id}`);
  } catch (e) {
    res.status(e[0]).render('posts/error',{error: e[1]});
  }
}
else{
  res.redirect('/')
}
});

router.get("/delete/:id", async (req, res) => {
  if(req.session.user){

  try{
  let id = xss(req.params.id);
  const removeProduct = await productData.deleteProduct(id);
  if (removeProduct) {
    res.redirect("/user/updateProfile");
  }
}
catch(e){
  res.status(e[0]).render('post/error',{error: e[1]})
}
}
else{
  res.redirect('/')
}
});

router.get("/advertisement", async (req, res) => {
  if(req.session.user){
  try{
      res.render("posts/advertisement", { title: "Post" });
  }
    catch (e) {
    res.status(e[0]).render("posts/error",{error: e[1]});
  }
}
else{
  res.render("posts/landingpage", { error1: "You need to login first" });
}
});

router.post(
  "/advertisement/upload",
  upload.single("productImg"),
  async (req, res) => {
    if(req.session.user){

    
    try {
      const params = req.body;
      const { productName, description,category, price} = params;
      let imagex = "../../" + req.file.path;
      if (!price) throw[400,"You must provide with all the details"];
      if (!productName) throw [400,"You must provide with all the details"];
      if (!description) throw [400,"You must provide with all the details"];
      if (!price) throw [400,"You must provide with all the details"];
      if(!category) throw [400,"You must provide with all the details"]
      if (typeof productName!='string') throw[400,"You must provide string for product Name"];
      if(typeof productName!=='string' || typeof description!=='string') throw [400,'Input must be a string'];
      if(!/[a-zA-Z0-9]/.test(productName)) throw [400,'Product Name should only contain numbers and alphabets']
      var resi = productName.replace(/ /g, "");
      if(resi==0) throw[400,"Invalid Product Name"];
      if (typeof description!='string') throw[400,"You must provide string for description"];
      resi = description.replace(/ /g, "");
      if(resi==0) throw[400,"Invalid Description"];
      if (parseInt(price) < 1) throw[400,"You must provide valid price"];
    
      
        let userID = req.session.user;
        let newProduct = await productData.create(
          productName,
          description,
          price,
          category,
          imagex,
          userID
        );
        res.render("posts/landingpage", { title: "Product Posted" ,user:req.session.user});
      }
    catch (e) {
      res.render("posts/landingpage", {title: 'Post an Advertisement',user:req.session.user});  
    }
  }
  else{
    res.render("posts/landingpage", { error1: "You need to login first" });
  }
}
);



router.get("/exploreproduct", async (req, res) => {
  if(req.session.user){
  try {
  
      let productList = await productData.getAll();
      res.render("posts/explore", {
        title: "Explore",
        partial: "products-list-script",
        productList: productList
      });
    }
    
   catch (e) {
    res.status(e[0]).json({ error: e[1] });
  }
}
else{
  res.render("posts/landingpage", { error2: "You need to login first" });
}
});


router.get("/updateProduct/:id", async (req, res) => {
  if(req.session.user){
  try {
    let id = req.params.id;
    const result = await productData.getProduct(id);
    res.render("posts/updateProduct", {product: result});
  } catch (e) {
    console.log(e);
    res.json(e);
  }
}
else{
  res.redirect('/')
}
});
router.post("/updateproducts/:id", async (req, res) => {
  if(req.session.user){
   
  try {
    const rest = req.body;
    const { productName, description, price,category} = rest;
 
 if(productName && productName.trim().length == 0) throw [400,"Enter Product Name"]
 else if(productName && !/[a-zA-Z0-9]/.test(productName)) throw [400,"Product Name should only contain numbers and alphabets"]
 if(description && description .trim().length == 0) throw [400,"Enter description"]
    let updatedProduct = await productData.updateProduct(
      
      productName,
      description,
      price,
      category,
      req.params.id
    );
      res.redirect("/");
  } catch (e) {
    res.status(e[0]).render("posts/updateProduct",{ error: e[1]});
  }
}
else{
  res.redirect('/')
}
});



function validateId(id){
  if(typeof id !== "string") throw [405,"invalid URL"]
  if (!id || id.trim().length ==0) throw [405,"invalid URL"]
  if(!/^[0-9A-Fa-f]{24}$/.test(id)) throw [405,"invalid URL"]
}

module.exports = router;
