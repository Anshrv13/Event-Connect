import mongoose from 'mongoose';

async function connectToMongo (url){
  try{
      const conn = await mongoose.connect(url)
      console.log(`DB connection successful: ${conn.connection.host}`)
  }
  catch(error){
      console.log("DB connection unsuccessful: " , error)
  }
}

export default connectToMongo;