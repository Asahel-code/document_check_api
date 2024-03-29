const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validateUser } = require('../utils/validation');

const handleLogin = async (req, res) => {
    const { body } = req;
    const { error } = validateUser(body);
    //if valid, return 400 - Bad request
    if (error) return res.status(400).json({ message: error.details[0].message});

    const foundUser = await User.findOne({ email: body.email }).exec();
    if (!foundUser) return res.sendStatus(401); //Unauthorized 

    // evaluate password 
    const match = await bcrypt.compare(body.password, foundUser.password);
    if (match) {

        const roles = await Role.findOne({_id: match.role}).exec()
        // create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        // Saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);
        console.log(roles);

        // Creates Secure Cookie with refresh token
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

        // Send authorization roles and access token to user
        return res.status(200).json({ foundUser, accessToken });

    } else {
        res.sendStatus(401);
    }
}


module.exports = { handleLogin };