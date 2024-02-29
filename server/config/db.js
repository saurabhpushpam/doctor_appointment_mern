const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connection successful at ", mongoose.connection.host);
  }
  catch (error) {
    console.log("Mongodb server issue : ", error);
  }
}

module.exports = connectDB