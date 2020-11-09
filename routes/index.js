const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const TodoController = require('../controllers/TodoController');

/* GET pages. */
// router.get('/', function(req, res, next) {
//   res.render('index', { page: 'Home', menuId: 'home'});
// });

// router.get('/about', function(req, res, next) {
//   res.render('about', { page: 'About', menuId: 'about'});
// });

// router.get('/signup', function(req, res, next) {
//   res.render('auth/signup', { page: 'Sign Up', menuId: 'signup'});
// });

// router.get('/signin', function(req, res, next) {
//   res.render('auth/signin', { page: 'Sign In', menuId: 'signin'});
// });

router.get('/getAllTodo', TodoController.getAllTodoList);


/* POST pages. */

router.post('/signup', AuthController.signup);

router.post('/signin', AuthController.signin);

router.post('/signout', AuthController.singout);

module.exports = router;
