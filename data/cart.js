const { ObjectID } = require("bson");
const { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections.js");
const user = mongoCollections.user;
const product = mongoCollections.product;
const cart = mongoCollections.cart;


async function getUserCart(id) {

    //find cart with user id and purchased false
    const cartCol = await cart()
    const prodCol = await product()
    let userCart = await cartCol.findOne({ userId: id, purchased: false })
    if (userCart == null) return null
    let prodList = userCart.products
    let productModelList = []
    for (let prod of prodList) {
        const productModel = removeObjectFromId(await prodCol.findOne({ _id: ObjectId(prod)}))
        productModelList.push(productModel)
    };
    let cartData = {
        products: productModelList,
        totalPrice: userCart.totalPrice
    }
    return cartData
}

async function addToCart(userId, prodId) {

    //find cart with user id and purchased false
    const cartCol = await cart()
    const userCOl = await user()
    const prodCol = await product()
    let prodAvailable = await prodCol.findOne({_id : ObjectId(prodId)})
    if(prodAvailable == null) throw [405,"invalid URL"]
    let sellerProducts = await prodCol.find({sellerId: userId}).toArray()
    for(let selprod of sellerProducts){
        if(selprod._id.toString() == prodId) throw [400,"Cannot add own product to cart"];
    }
    let userCart = await cartCol.findOne({ userId: userId, purchased: false })
    if(userCart == null){
        let products = []
        products.push(prodId)
        let totalPrice = await calculateToTalPrice(products)
        let newCart = {
            products: products,
            purchased: false,
            datePurchased: null,
            userId: userId,
            totalPrice: totalPrice
        }
        let insertedInfo = await cartCol.insertOne(newCart)
        let cartid = insertedInfo.insertedId
        let updatedInfo = await userCOl.updateOne({ _id: ObjectId(userId) },
            {
                $set: {
                    activeCart: cartid.toString()
                }
            })
        
        let productModel = await prodCol.findOne({ _id: ObjectId(prodId) })
        let cart_ = productModel.activeCarts
        cart_.push(cartid.toString())
        let prodUpdatedInfo = await prodCol.updateOne({ _id: ObjectId(prodId) },
            {
                $set: {
                    activeCarts: cart_
                }
            })
        return true
    }
    else {
        let products = userCart.products
        for(let i in products){
            if(prodId == products[i]) throw [400,"Error : Product already in cart"]
        }
        products.push(prodId)
        let totalPrice = await calculateToTalPrice(products)
        const updatedInfo = cartCol.updateOne({ _id: userCart._id },
            {
                $set: {
                    products: products,
                    totalPrice: totalPrice
                }
            })
        if (updatedInfo.modifiedCount === 0) return false;
        let productModel = await prodCol.findOne({ _id: ObjectId(prodId) })
        let cart_ = productModel.activeCarts
        cart_.push(userCart._id.toString())
        let prodUpdatedInfo = await prodCol.updateOne({ _id: ObjectId(prodId) },
        {
            $set: {
                activeCarts: cart_
            }
        })
        return true;
    }
}

async function removeFromCart(userId, prodId) {
    const cartCol = await cart()
    const prodCol = await product()
    let prodAvailable = await prodCol.findOne({_id : ObjectId(prodId)})
    if(prodAvailable == null) throw [405,"invalid URL"]
    let userCart = await cartCol.findOne({ userId: userId, purchased: false })
    let prodList = userCart.products
    let newList = []
    for (let id of prodList) {
        if (id != prodId) newList.push(id)
    };
    let totalPrice = await calculateToTalPrice(newList)
    const updatedInfo = cartCol.updateOne({ _id: userCart._id },
        {
            $set: {
                products: newList,
                totalPrice: totalPrice
            }
        })
    if (updatedInfo.modifiedCount === 0) return false;
    return true;
}

async function placeOrder(userId) {
    const cartCol = await cart()
    const userCol = await user()
    const prodCol = await product()
    let userModel = await userCol.findOne({ _id: ObjectId(userId)})
    let cartid = userModel.activeCart
    let date = new Date()
    console.log(date.toUTCString())
    let cartUpdate = await cartCol.updateOne({ _id: ObjectId(cartid) }, { $set: { purchased: true, datePurchased: date.toUTCString() } })
    let userUpdate = await userCol.updateOne({ _id: ObjectId(userId) }, { $set: { activeCart: "" } })
    let cartModel = await cartCol.findOne({ _id: ObjectId(cartid) })
    let products = cartModel.products
    for (let prod1 of products) {
        let ProductModel = await prodCol.findOne({ _id: ObjectId(prod1) })
        let carts = ProductModel.activeCarts
        for (let cart_ of carts) {
            if(cart_ != cartid)
{            let cartModel = await cartCol.findOne({ _id: ObjectID(cart_) })
            let products = cartModel.products
            let newList = []
            for (let prod2 of products) {
                if (prod1 != prod2) newList.push(prod2)
            }
            let totalPrice = await calculateToTalPrice(newList)
            let updatedInfo = await cartCol.updateOne({ _id: ObjectId(cart_) },
                {
                    $set: {
                        products: newList,
                        totalPrice: totalPrice
                    }
                }
            )}
        }
        let updateActiveCarts = await prodCol.updateOne({ _id: ObjectId(prod1) },
        {
            $set: {
                activeCarts: [],
                purchased: true
            }
        }
    )}
    }

async function fetchOrders(userId){
    const cartCol = await cart()
    let orders = await cartCol.find({userId: userId,purchased:true}).toArray()
    return orders
}

async function getOrder(orderId){
    const cartCol = await cart()
    const prodCol = await product()
    let prodAvailable = await cartCol.findOne({_id : ObjectId(orderId)})
    if(prodAvailable == null) throw [405,"invalid URL"]
    let order = await cartCol.findOne({_id : ObjectId(orderId)})
    let prodList = order.products
    let productModelList = []
    for (let prod of prodList) {
        const productModel = removeObjectFromId(await prodCol.findOne({ _id: ObjectId(prod) }))
        productModelList.push(productModel)
    };
    let orderData = {
        products: productModelList,
        totalPrice: order.totalPrice
    }
    return orderData
}

async function calculateToTalPrice(products) {
    const prodCol = await product()
    let totalPrice = 0
    for (let prodid of products) {
        let productModel = await prodCol.findOne({ _id: ObjectId(prodid)})
        totalPrice += parseInt(productModel.price)
    }
    return totalPrice
}



function removeObjectFromId(obj) {
    obj["_id"] = obj["_id"].toString();
    return obj;
}

module.exports = {
    getUserCart, addToCart, removeFromCart, placeOrder,fetchOrders,getOrder
}