const express = require('express');
const router = express.Router();
const TodoController = require('../controllers/TodoController');
const verify = require('./verifyToken');

/* GET users pages. */
router.get('/home', verify, function(req, res, next) {  
    res.render('users/home', { page: 'Home', menuId: 'home', isLoggedIn: true});
  });

  
  router.get('/createTodo', verify, function(req, res, next) {  
    res.render('users/todoForm', { page: 'Todo List', menuId: '', isLoggedIn: true});
  });
  
  router.get('/updateTodo/:id', verify, TodoController.getUpdateTodo);

router.get('/myTodoList/:type',  verify,TodoController.getTodoList);

router.get('/markTodo/:id', verify, TodoController.markAsComplete, TodoController.getTodoList);

router.get('/deleteTodo/:id', verify, TodoController.deleteTodo, TodoController.getTodoList);

// router.get('/myFilteredTodoList',  verify,TodoController.filterTodoList);

// POST user pages
router.post('/createTodo', verify, TodoController.createTodo);

router.post('/updateTodo', verify, TodoController.updateTodo);


module.exports = router;
