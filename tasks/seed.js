const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const cart = data.cart;
const user = data.user;
const product = data.product;

const main = async () => { 
    const db = await dbConnection();
    await db.dropDatabase();
  try{
    await user.createUser('Darshan', 'Journal Square','1234567890','darshan@marketplace.com','Pass@12345');
  }
  catch(e)
  {
    console.log(e);
  }
  try{
    await user.createUser('Meet', 'Jersey Heights','2345678901','meet@marketplace.com','Meet@23451');
  }
  catch(e)
  {
    console.log(e);
  }
  try 
  {
    await user.createUser('Prasanth', 'Times Square','3456789012','prasanth@marketplace.com','Prasanth@34512');
  }
  catch(e)
  {
      console.log(e);
  }
  try{
      await user.createUser('Sarthak', 'Hoboken','4567890123','sarthak@marketplace.com','Sarthak@45123');
  }
  catch(e)
  {
      console.log(e);
  }
  try{
      await user.createUser('Rehan', 'Secaucus','5678901234','ray@marketplace.com','Ray@51234');
  }
  catch(e)
  {
    console.log(e);
  }
  try{
      await user.createUser('Jaqueline', 'Little Ferry','6789012345','jaqueline@marketplace.com','Jaqueline@12345');
    }
   catch(e)
   {
       console.log(e);
   }
   try{
    await user.createUser('Ronny', 'Edison','7890123456','ron@marketplace.com','Ron@23451');
   }
   catch(e)
   {
       console.log(e);
   }
   try{
        await user.createUser('Silvia', 'Township','8901234567','silvia@marketplace.com','Silvia@34512');
   }
   catch(e){
       console.log(e);
   }
   console.log('Done seeding database');

  process.exit();
}

main();