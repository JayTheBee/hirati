const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	role: { type: String, required: true },
	classes: { type: String },
	verified: {type: Boolean, default: false},
});

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id, email: this.email, role: this.role }, process.env.JWTPRIVATEKEY, {
		expiresIn: "7d",
	});
	// return res.status(200).send({token:token});
	return token;
};

const User = mongoose.model("user", userSchema);

const userValidate = (data) => {
	const schema = Joi.object({
		firstName: Joi.string().required().label("First Name"),
		lastName: Joi.string().required().label("Last Name"),
		email: Joi.string().email().required().label("Email"),
		role: Joi.string().required().label("Role"),
		password: passwordComplexity().required().label("Password"),
		
	});
	return schema.validate(data);
};

module.exports = { User, userValidate };
