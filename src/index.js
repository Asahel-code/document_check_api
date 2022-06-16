require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const mongoose = require("mongoose");
const connectDB = require('../src/config/dbConn');
const v1AuthRoute = require("./v1/routes/authRoute");
const v1RegisterRoute = require("./v1/routes/registerRoute");
const v1TokenRefreshRoute = require("./v1/routes/refreshRoute");
const v1LogoutRoute = require("./v1/routes/logoutRoute");
const v1EmailRoute = require("./v1/routes/emailRoute");

// Connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//Routes
app.use('/api/v1/register', v1RegisterRoute);
app.use('/api/v1/auth', v1AuthRoute);
app.use('/api/v1/refresh', v1TokenRefreshRoute);
app.use('/api/v1/logout', v1LogoutRoute);
app.use('/api/v1/email', v1EmailRoute);

const PORT = process.env.PORT || 5000;

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on ${PORT} ...`));
});