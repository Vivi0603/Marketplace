const mongoCollections = require("../config/mongoCollections.js");
const user = mongoCollections.user;
const product = mongoCollections.product;
let { ObjectId } = require("mongodb");

const bcrypt = require("bcryptjs");

const saltRounds = 1;

async function getUser(id) {
  const userCollection = await user();
  const prodCollection = await product();

  let objectID = ObjectId(id);
  const userModel = await userCollection.findOne({ _id: objectID });
  const productRes = await prodCollection.find({sellerId: id }).toArray();
  let result = {
    user: userModel,
    products: productRes,
  };
  return result;
}

function removeObjectFromId(obj) {
  obj["_id"] = obj["_id"].toString();
  return obj;
}

async function updateProfile(name, Email, Password, address, phoneNumber, id) {
  // Email = Email.toString().toLowerCase();
  // Password = Password.toString();
  if(name &&  name.trim().length == 0) throw [400,'Enter Name']
  if(address && address.trim().length == 0) throw [400,'Enter Address']
  if(Password && Password.trim().length == 0) throw [400,'Enter Password']
  if(Email && Email.trim().length == 0) throw [400,'Enter Email']
  if(name && !(/[a-zA-Z0-9]/.test(name))) throw [400,'Name should only contain numbers and alphabets']
  if(phoneNumber && !/^\d{3}-?\d{3}-?\d{4}$/.test(phoneNumber)) throw [400,'Incorrect Phone Number']
  if(Password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(Password)) throw [400,'Password must have one lower case,one upper case alphabets, one number and one special character']
  
  let objectID = ObjectId(id);
  const userCollection = await user();
  
  const userFound = await userCollection.find({email: Email}).toArray()
  if(userFound.length > 0) return false
  let updateObj = {}
  if(name) updateObj.name = name
  if(address) updateObj.address = address
  if(phoneNumber) updateObj.phoneNumber = phone
  if(Email) updateObj.email = Email
  if(Password) updateObj.password = await bcrypt.hash(Password, saltRounds);
  const updatedInfo = await userCollection.updateOne(
    { _id: objectID },
    {
      $set: updateObj
    }
  );
  return true;
}

async function createUser(name, address, phoneNumber, email, password) {
  console.log("inside CreateUSer");
  email = email.toString().toLowerCase();
  password = password.toString();
  console.log("inside CreateUSer");
  for (let i of email) {
    if (i == " ") throw `email has empty spaces`;
  }
  let check0 = phoneNumber;
  let result = check0.slice(0, 1);
  if (result == 0) {
    throw `first digit is 0`;
  }

  for (let i of password) if (i == " ") throw `password has empty spaces`;
  const phoneNoCheck = /^\(?([0-9]{3})\)?[-]?([0-9]{3})[-]?([0-9]{4})$/;
  const phoneCheck = phoneNoCheck.test(phoneNumber);
  if (phoneCheck == false) throw "Wrong Phone no. format";

  if (email && name && password) {
    if (password.length < 6) throw `Password has less than 6 characters `;
  }
  if (name.length < 2) {
    throw `Name has less than 2 characters`;
  }

  let nameCheck = /(?:[\w\s][^!@#$%^&*()?//><,.;:'"\{\}\[\]=+~`\-_|\\0-9]+)/;
  if (!name.match(nameCheck)) {
    throw `Name is not a valid input`;
  }

  let emailCheck = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  ///(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  if (!email.match(emailCheck)) {
    throw `Email is not valid `;
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log("inside create user");
  if (await emailExists(email)) {
    return "email already taken";
  }

  const userCollection = await user();
  let newUser = {
    name: name,
    address: address,
    phoneNumber: phoneNumber,
    email: email,
    password: hashedPassword,
    activeCart: "",
  };

  const insertInfo = await userCollection.insertOne(newUser);
  if (insertInfo.insertedCount === 0) throw "Failed to create a new user.";

  return { userInserted: true };
}

async function emailExists(email) {
  email = email.toLowerCase();

  const loginCollection = await user();

  return (await loginCollection.findOne({ email: email })) !== null;
}

async function nameExists(name) {
  name = name.toLowerCase();

  const loginCollection = await user();

  return (await loginCollection.findOne({ name: name })) !== null;
}

async function checkUser(email, password) {
  const userCollection = await user();

  const res = await userCollection.findOne({
    email: email,
  });
  if (res == null) {
    throw `error`;
  }
  if (await bcrypt.compare(password, res.password)) {
    return { userId: removeObjectFromId(res)._id, authenticated: true };
  } else {
    return { userId: removeObjectFromId(res)._id, authenticated: false };
  }
}
module.exports = {
  updateProfile,
  getUser,  
  createUser,
  checkUser,
};
