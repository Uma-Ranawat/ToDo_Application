const express = require('express');
const router = express.Router();
const TodoController = require('../controllers/TodoController');
const verify = require('./verifyToken');

/* GET users pages. */
// router.get('/', function(req, res, next) {
//   
// });

router.get('/myTodoList',  verify,TodoController.getTodoList);

router.get('/myFilteredTodoList',  verify,TodoController.filterTodoList);

// POST user pages
router.post('/createTodo', verify, TodoController.createTodo);

router.post('/markTodo', verify, TodoController.markAsComplete);

router.post('/updateTodo', verify, TodoController.updateTodo);

router.post('/deleteTodo', verify, TodoController.deleteTodo);


module.exports = router;
