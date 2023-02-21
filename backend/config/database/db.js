const mongoose = require("mongoose");
const dotenv = require('dotenv')
dotenv.config();
// connect to database asynchronosly and link mongoDB to the backend 
const connectDB = async ()=>{
    try {
        const connectMongo = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            
            
        });
       console.log(`connected to mongoDB: ${connectMongo.connection.host}`);
    } catch (error) {
        console.log(error);
    }
}
module.exports = connectDB;