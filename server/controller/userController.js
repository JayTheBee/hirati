const { User, userValidate } = require('../models/User')
const bcrypt = require("bcrypt");
const Joi = require("joi");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require ( "crypto");


const createUser = async (req, res) => {
	try {
		const { error } = userValidate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		let user = await User.findOne({ email: req.body.email });
		if (user)
			return res.status(409).send({ message: "User with given email already Exist!" });

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		user = await new User({ ...req.body, password: hashPassword }).save();
		const token = await new Token ({
			userId: user._id, 
			token: crypto.randomBytes(32).toString("hex")
		}).save();
		const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;
		await sendEmail (user.email,"Verify Email", url);
		
		res
			.status(201)
			.send({ message: "Email is sent. Please Verify your account" });

	} catch (error) {
		res
			.status(500)
			.send({ message: "Internal Server Error" });
	}
}

const loginValidate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
}

const loginUser = async (req, res) => {
	try {
		const { error } = loginValidate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (!user)
			return res.status(401).send({ message: "Invalid Email or Password" });

		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!validPassword)
			return res.status(401).send({ message: "Invalid Email or Password" });
		
		if (!user.verified){
			let token = await Token.findOne({userId: user._id})
			if (!token)
				{
					token = await new Token ({
						userId: user._id, 
						token: crypto.randomBytes(32).toString("hex")
					}).save();
					const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;
					await sendEmail (user.email,"Verify Email", url);
				}
			return res.status(400).send({message: "An Email is sent to your Account please Verify"})
		}	
		const token = user.generateAuthToken();
		res.status(200).send({ data: token, message: "logged in successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
}

const verify = async(req, res ) => {
    try {
        const user = await User.findOne({_id: req.params.id});
		if(!user)return res.status(400).send({message: "Invalid Link"});

		const token = await Token.findOne({
			userId: user._id,
			token: req.params.token
		});

		if (!token)return res.status(400).send({message: "Invalid Link"});
		
		await User.findByIdAndUpdate ({_id: req.params.id},{verified: true});

		await token.remove();
		res.status (200).send({message: "Email Verified Successfully"});
		
    } catch (error) {
        res.status (500).send({message: "Internal Server Error"});
		console.log(error);
    }
}


module.exports = { createUser, loginUser, verify }