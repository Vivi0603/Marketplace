const mongoCollections = require("../config/mongoCollections");
const product = mongoCollections.product;
const user = mongoCollections.user;
const cart = mongoCollections.cart;
const { ObjectId } = require('bson');

async function create(productName, description,price,category,img,sellerID) {

  if (!price) throw[400,"You must provide with all the details"];
  if (!productName) throw [400,"You must provide with all the details"];
  if (!description) throw [400,"You must provide with all the details"];
  if (!price) throw [400,"You must provide with all the details"];
  if(!category) throw [400,"You must provide with all the details"]
  if (typeof productName!='string') throw[400,"You must provide string for product Name"];
  if(typeof productName!=='string' || typeof description!=='string') throw [400,'Input must be a string'];
  if(typeof price!=='number')
  if(!/[a-zA-Z0-9]/.test(productName)) throw [400,'Product Name should only contain numbers and alphabets']
  var res = productName.replace(/ /g, "");
  if(res==0) throw[400,"Invalid Product Name"];
  if (typeof description!='string') throw[400,"You must provide string for description"];
  res = description.replace(/ /g, "");
  if(res==0) throw[400,"Invalid Description"];
  if (price < 1) throw[400,"You must provide valid price"];
    
    const usersCollection=await user()
    const productCollection = await product();

    let newProduct = {
        productName: productName,
        description: description,
        image: img,
        sellerId: sellerID,
        category: category,
        purchased: false,
        price: price,
        comments: [],
        activeCarts: []
    };
      
    const insertInfo = await productCollection.insertOne(newProduct);
    const newId = insertInfo.insertedId;
    const productList = await this.getProduct(newId);
    productList["_id"] = productList["_id"].toString();
    return productList;

}

async function getProduct(id) {
  if (!id) throw [400, "You must provide an id to search for"];

  if (typeof id != "object" && typeof id != "string")
    throw [400, "Error: You must provide an id in string"];

  //if(ObjectId.isValid(id)==false)  throw[400,"Invalid ObjectId"];

  let parsedId = ObjectId(id);

  const productCollection = await product();
  const products = await productCollection.findOne({ _id: parsedId });

  if (products === null) throw [404, "Product Not found"];
  products["_id"] = products["_id"].toString();

  return products;
}
async function getAll(){
    const productCollection = await product();
    const productList = await productCollection.find({purchased:false}).toArray();
    return productList;
}

async function createcomment(productId, comment, userid) {
  if(typeof comment!=="string") throw [400,'Input must be a string']

  let result = true;
  const productsCollection = await product();
  const userCol = await user();
  let userModel = await userCol.findOne({ _id: ObjectId(userid) });
  let objid = ObjectId(productId);
  comment = comment.toString();
  comment = userModel.name + "  :  " + comment;
  let newcomment = []
  newcomment.push(comment)
  const z = await productsCollection.updateOne(
    { _id: objid },
    { $addToSet: { comments: newcomment } }
  );
  let userInserted = true;
  return result;
}

async function deleteProduct(prodId){

  const prodCol = await product()
  let productModel = await prodCol.findOne({_id : ObjectId(prodId)})
  let carts = productModel.activeCarts
  if(carts != null){ 
    const cartCol = await cart()
    for(let cartId of carts){
      let cartModel = await cartCol.findOne({_id: ObjectId(cartId)})
      let products = cartModel.products
      let newList = []
      for(let prod of products){
          if(prod != prodId) newList.push(prod)
      }
      let updatedInfo = await cartCol.updateOne({_id : ObjectId(cartId)},
      {
          $set : {
              products : newList
          }
      })
  }
}
let deletedInfo = await prodCol.deleteOne({_id: ObjectId(prodId)})
if(deletedInfo.deletedCount == 0) return false
return true
}

async function updateProduct(productName, description,price,category,id) {

  if(productName && productName.trim().length == 0) throw [400,'Enter Product Name']
  else if(productName && !/[a-zA-Z0-9]/.test(productName)) throw [400,'Product Name should only contain numbers and alphabets']
  if(description && description.trim().length == 0) throw [400,'Enter description Name']
  if(price && price<1) throw [400,'Price should be more than equal to 1']
  let objectID = ObjectId(id);
  const productsCollection = await product();


  let updateObj = {}
  if(productName) updateObj.productName = productName
  if(description) updateObj.description = description
  if(price) updateObj.price = price
  if(category) updateObj.category = category
  const updatedInfo = await productsCollection.updateOne(
    { _id: objectID },
    {
      $set: updateObj
    }
  );
  if (updatedInfo.modifiedCount === 0) return false;
  return true;
}

async function filterWithCost(maxCost){
  let products = await getAll();
  let finalList = []
  for(let prod of products){
    if(prod.price <= maxCost) finalList.push(prod)
  }
  return finalList
}



module.exports = {
  create,
  getProduct,
  getAll,
  createcomment,
  deleteProduct,
  updateProduct,
  filterWithCost
};