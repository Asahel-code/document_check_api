const User = require('../models/User');
const VerificationToken = require('../models/VerificationToken');
const mailService = require("../utils/mail");
const Joi = require('joi');

const verifyEmail = async (req, res) => {
    const { body } = req;
    const { error } = validateUser(body);
    //if invalid, return 400 - Bad request
    if (error) return res.status(400).send(error.details[0].message);

    //Getting the user id 
    const foundUser = await User.findOne({ _id: body.userId }).exec();
    if (!foundUser) return res.sendStatus(404);

    //Check email verification status
    if (foundUser.verified) res.status(409).send("This account is already verified");

    //Getting the token delivery from the input if it is matches with the user
    const token = await VerificationToken.findOne({ owner: foundUser._id }).exec();
    if (!token) return res.sendStatus(404);

    //Comparing the token delivered with one in the database
    const isMatched = await token.compareToken(body.otp)
    if (!isMatched) res.status(400).send("Please provide a valid token");

    /*
        if all goes well we update the email verication status
        Delete the token
        Send email to the user
    */

    try {
        foundUser.verified = true;
        await VerificationToken.findByIdAndDelete(token._id);
        await foundUser.save;

        mailService.mailTransport().sendMail({
            from: 'emailverification@email.com',
            to: foundUser.email,
            subject: "Welcome email",
            html: "Email verified successful"
        });

        res.status(200).json({ 'success': `${foundUser.username}, your email has been verified` });
    }
    catch(error){
        res.status(500).json({ 'message': error.message });
    }
    
}

const validateUser = (user) => {
    const schema = Joi.object({
        userId: Joi.string().required(),
        otp: Joi.string().required(),
    });

    return schema.validate(user);
}

module.exports = {
    verifyEmail
}