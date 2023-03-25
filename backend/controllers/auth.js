import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import createError from '../utils/createError.js';

import sendEmail from '../utils/sendEmail.js';

import Token from '../models/Token.js';

export const login = async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return next(
      createError({
        message: 'Email and password are required',
        statusCode: 400,
      }),
    );
  }

  try {
    const user = await User.findOne({ email: req.body.email }).select(
      'name email password role',
    );
    if (!user) {
      return next(
        createError({ status: 404, message: 'User not found with the email' }),
      );
    }
    const isPasswordCorrect = await bcryptjs.compare(
      req.body.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      return next(
        createError({ status: 400, message: 'Password is incorrect' }),
      );
    }
    const payload = {
      id: user._id,
      name: user.name,
      role: user.role,
      email: user.email,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    return res
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .status(200)
      .json({
        name: user.name, email: user.email, role: user.role, message: 'login success',
      });
  } catch (err) {
    return next(err);
  }
};

export const register = async (req, res, next) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return next(
      createError({
        message: 'Name, Email & password are required',
        statusCode: 400,
      }),
    );
  }
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return next(
      createError({
        message: 'User with given email already Exist!',
        status: 409,
      }),
    );
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(req.body.password, salt);

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role,
      verified: false,
    });

    const userSaved = await newUser.save();
    const token = await new Token({
      userId: userSaved._id,
      token: crypto.randomBytes(32).toString('hex'),
    }).save();

    const url = `${process.env.CLIENT_URL}/auth/${userSaved._id}/verify/${token.token}`;
    await sendEmail(userSaved.email, 'Verify Email', url);

    // return res.status(201).json('New User Created');
    return res.status(201).send({ message: 'Email is sent. Please Verify your account' });
  } catch (err) {
    return next(err);
  }
};

export const logout = async (req, res) => {
  res.clearCookie('access_token');
  return res.status(200).json({ message: 'logout success' });
};

export const isLoggedIn = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.json(false);
  }
  return jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) {
      return res.json(false);
    }
    return res.json(true);
  });
};

export const verify = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return next(createError({ status: 400, message: 'Invalid Link' }));

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });

    if (!token) return next(createError({ status: 400, message: 'Invalid Link' }));

    await User.findByIdAndUpdate({ _id: req.params.id }, { verified: true });

    await token.remove();
    return res.status(200).json({ message: 'email verified success' });
  } catch (error) {
    return next(error);
  }
};
