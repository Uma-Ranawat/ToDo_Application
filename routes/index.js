const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const TodoController = require('../controllers/TodoController');
const User = require('../models/User');

/* GET pages. */
router.get('/', function(req, res, next) {
  res.render('index', { page: 'Home', menuId: 'home'});
});

router.get('/about', function(req, res, next) {
  const token = req.cookies['key_token'];
  if(!token)
    res.render('about', { page: 'About', menuId: 'about'});
  else
    res.render('about', { page: 'About', menuId: 'about', isLoggedIn: true});
});

router.get('/signup', function(req, res, next) {
  res.render('auth/signup', { page: 'Sign Up', menuId: 'signup'});
});

router.get('/signin', function(req, res, next) {
  res.render('auth/signin', { page: 'Sign In', menuId: 'signin'});
});

router.get('/signout', AuthController.signout);

router.get('/getAllTodo/:type', TodoController.getAllTodoList);


/* POST pages. */

router.post('/signup', AuthController.signup);

router.post('/signin', AuthController.signin);



module.exports = router;
