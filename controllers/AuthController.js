const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const {signupValidation, signinValidation} = require('../routes/validation');

module.exports = {

    signup : async (req,res) => {

      // VALIDATING THE USER
      const {error} = signupValidation(req.body);
      // if(error) return res.render('auth/signup', { page: 'Sign Up', menuId: 'signup', req: req.body, validationError: error.details[0]});
      if(error) return res.status(400).send(error.details[0].message);

      //Checking passwords
      if(req.body.password != req.body.confirm_password) return res.status(400).send('Passwords do not match.');

      // Checking if user is already registered in the system
      const emailExists = await User.findOne({email: req.body.email});
      // if(emailExists) return res.render('auth/signup', { page: 'Sign Up', menuId: 'signup', req: req.body, signupError: 'Email already exists.'});
      if(emailExists) return res.status(400).send('Email already exists.');

      // Hashing the password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(req.body.password, salt);

      // Creating a new user
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: passwordHash
      });
      try{
        // Saving the user
        const savedUser = await user.save();
        return res.status(200).send('Account Successfully Created.');
        // return res.render('auth/signup', { page: 'Sign Up', menuId: 'signup', req: req.body, signupMessage: 'Account Successfully Created.'});    
      }catch(err){
        return res.status(400).send('Something went wrong. Account could not be created.');
        // return res.render('auth/signup', { page: 'Sign Up', menuId: 'signup', req: req.body, signupError: 'Something went wrong. Account could not be created.'});
      }
    },


    signin : async (req,res) => {

      // VALIDATING THE USER
      const {error} = signinValidation(req.body);
      // if(error) return res.render('auth/signin', { page: 'Sign In', menuId: 'signin', req: req.body, validationError: error.details[0]});
      if(error) return res.status(400).send(error.details[0].message);

      // Checking if the email exists
      const user = await User.findOne({email: req.body.email});
      // if(!user) return res.render('auth/signin', { page: 'Sign In', menuId: 'signin', req: req.body, signinError: 'Invalid email or password. Try again.'});
      if(!user) return res.status(400).send('Invalid email or password. Try again.');

      // Checking Password is correct or not
      const validPassword = await bcrypt.compare(req.body.password, user.password);
      // if(!validPassword) return res.render('auth/signin', { page: 'Sign In', menuId: 'signin', req: req.body, signinError: 'Invalid email or password. Try again.'});
      if(!validPassword) return res.status(400).send('Invalid email or password. Try again.');

      // Create and assign a token
      const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
      res.header('key_token', token);
      // res.clearCookie('key_token');
      res.cookie('key_token', token);
      User.updateOne({_id: user._id},{'signin_flag': 1}).then(function(response){
        if(response) 
          return res.status(200).send('User Logged in');
        else
          return res.status(400).send('User Cannot Log in');
      });
      // return res.redirect('/users/home');
    }

};