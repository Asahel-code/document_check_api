require('dotenv').config();
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});
    }
    catch (err) {
        console.log(err);
    }
}

module.exports = connectDB