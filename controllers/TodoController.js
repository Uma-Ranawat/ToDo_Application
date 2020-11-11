const ToDo = require('../models/ToDo');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const {todoValidation} = require('../routes/validation');
const e = require('express');

module.exports = {

    createTodo : async (req,res) => {

        // VALIDATING THE Todo Task
        const {error} = todoValidation(req.body);
        if(error) return res.status(400).render('users/todoForm', { page: 'Create Task', menuId: '', req: req.body, validationError: error.details[0], isLoggedIn: true});
        // if(error) return res.status(400).send(error.details[0].message);

        //  validation of the dates like both dates should be greater than today's date and reminder date should be less than due date has been done through javascript main.js. Same is the case in update todo. 
        
        // Creating a new todo task  
        const todo = new ToDo({
            user_id: req.user._id,
            description: req.body.description,
            due_date: req.body.due_date,
            reminder_date: req.body.reminder_date
        });

        try{
            // Saving the todo task
            const savedTask = await todo.save();
            return res.status(200).render('users/todoForm', { page: 'Create Task', menuId: '', todoMessage: 'Task Successfully Saved.' , isLoggedIn: true}); 
            // return res.status(200).send('Task Successfully Saved.' + savedTask);

        }catch(err){
            return res.status(400).render('users/todoForm', { page: 'Create Task', menuId: '', todoError: 'Something went wrong while saving the task. Please try again later.', isLoggedIn: true}); 
            // return res.status(400).send('Something went wrong while saving the task. Please try again later.');
        }
        
    },

    getTodoList : async (req,res,next) => {

        if(req.params['type'] == 'unidentified' || req.params['type'] == null || req.params['type'] == 'all'){
            ToDo.find({user_id: req.user._id}).populate('user_id').sort({due_date : 'ASC'}).exec((err,data) => {
                if(err || data.length == 0)
                    return res.render('users/todoList', { page: 'Todo List', menuId: 'todo_list', error: 'No list', isLoggedIn: true});
                    // return res.status(400).send('Could not get the list.');
                else
                {
                    if(req.messageType == 'undefined')
                        return res.status(200).render('users/todoList', { page: 'Todo List', menuId: 'todo_list', data: data, moment: moment, isLoggedIn: true});
                    else if(req.messageType == 'success')
                        return res.status(200).render('users/todoList', { page: 'Todo List', menuId: 'todo_list', data: data, moment: moment, success: req.message, isLoggedIn: true});
                    else 
                        return res.status(200).render('users/todoList', { page: 'Todo List', menuId: 'todo_list', data: data, moment: moment, failure: req.message, isLoggedIn: true});
                        
                }                
                    // return res.status(200).send(data[0].description);
            });
        }
        else{
            ToDo.find({user_id: req.user._id, status: req.params['type']}).populate('user_id').sort({due_date : 'ASC'}).exec((err,data) => {
                if(err || data.length == 0)
                    return res.render('users/todoList', { page: 'Todo List', menuId: 'todo_list', error: 'No list', isLoggedIn: true});
                    // return res.status(400).send('Could not get the list.');
                else
                {
                    if(req.messageType == 'undefined')
                        return res.status(200).render('users/todoList', { page: 'Todo List', menuId: 'todo_list', data: data, moment: moment, isLoggedIn: true});
                    else if(req.messageType == 'success')
                        return res.status(200).render('users/todoList', { page: 'Todo List', menuId: 'todo_list', data: data, moment: moment, success: req.message, isLoggedIn: true});
                    else 
                        return res.status(200).render('users/todoList', { page: 'Todo List', menuId: 'todo_list', data: data, moment: moment, failure: req.message, isLoggedIn: true});
                        
                }                
                    // return res.status(200).send(data[0].description);
            });
        }        

    },


    // filterTodoList : async (req,res) => {

    //     ToDo.find({user_id: req.user._id, status: req.body.filter}).sort({due_date : 'ASC'}).exec((err,data) => {
    //         if(err)
    //             return res.status(400).send('Could not get the list.');
    //         else
    //             return res.status(200).send(data);
    //     });

    // },

    getAllTodoList : async (req,res) => {

        if(req.params['type'] == 'unidentified' || req.params['type'] == null || req.params['type'] == 'all'){
            ToDo.find().populate('user_id').sort({due_date : 'ASC'}).exec((err,todo_list) => {

                if(err || todo_list.length == 0)
                    return res.status(400).render('users/todoList', { page: 'Todo List', menuId: 'todo_list', error: 'No currently logged in user.'});
                    // console.log('Could not get the list of one user.');
                else
                {
                    // return res.status(200).send(todo_list);
                    const token = req.cookies['key_token'];
                    if(!token)
                        return res.status(200).render('users/todoList', { page: 'Todo List', menuId: 'whole_todo_list', pagetype: 'allTodo', data: todo_list, moment: moment});
                    else
                        return res.status(200).render('users/todoList', { page: 'Todo List', menuId: 'whole_todo_list', pagetype: 'allTodo', data: todo_list, moment: moment, isLoggedIn: true});
                }            
            });
        }
        else{
            ToDo.find({status: req.params['type']}).populate('user_id').sort({due_date : 'ASC'}).exec((err,todo_list) => {

                if(err || todo_list.length == 0)
                    return res.status(400).render('users/todoList', { page: 'Todo List', menuId: 'todo_list', error: 'No currently logged in user.'});
                    // console.log('Could not get the list of one user.');
                else
                {
                    // return res.status(200).send(todo_list);
                    const token = req.cookies['key_token'];
                    if(!token)
                        return res.status(200).render('users/todoList', { page: 'Todo List', menuId: 'whole_todo_list', pagetype: 'allTodo', data: todo_list, moment: moment});
                    else
                        return res.status(200).render('users/todoList', { page: 'Todo List', menuId: 'whole_todo_list', pagetype: 'allTodo', data: todo_list, moment: moment, isLoggedIn: true});
                }            
            });
        }
        
    },

    markAsComplete : async (req,res, next) => {

        try {
            var todo_id = req.params['id'];
            ToDo.updateOne({user_id: req.user._id, _id: todo_id}, {status: 'complete'}).then((data) => {
                // console.log(data);
                if(data.n <= 0)
                {
                    req.messageType = 'failure';
                    req.message = 'Could not mark the task as complete.';
                    // return res.status(400).send('Could not mark the task as complete.');    
                }
                else{
                    req.messageType = 'success';
                    req.message = 'Task marked as complete.';
                    // return res.status(200).send('Task marked as complete.');
                }          
                next();                          
            }).catch(function (err) {
                
                req.messageType = 'failure';
                req.message = 'Could not mark the task as complete. Some error occurred.';
                next();
                // return res.status(400).send('Could not mark the task as complete. Some error occurred.');
            });
            
        } catch (error) {
            req.messageType = 'failure';
            req.message = 'Could not mark the task as complete. Some error occurred.';
            next();
            // return res.status(400).send('Could not mark the task as complete. Some error occurred.');
        }        

    },

    getUpdateTodo : async (req,res) => {
        var todo_id = req.params['id'];
        ToDo.findOne({_id: todo_id}).then((data) => {
            res.render('users/todoFormUpdate', { page: 'Todo List', menuId: '', todo_id: todo_id, req: data, isLoggedIn: true});
        });
    },

    updateTodo : async (req,res) => {
        
        // VALIDATING THE Todo Task
        const todo = {
            description: req.body.description,
            due_date: req.body.due_date,
            reminder_date: req.body.reminder_date
        };
        const {error} = todoValidation(todo);
        if(error) return res.status(400).render('users/todoFormUpdate', { page: 'Update Task', menuId: '', todo_id: req.todo_id, req: req.body, validationError: error.details[0], isLoggedIn: true});
        // if(error) return res.status(400).send(error.details[0].message);

        try {
            ToDo.updateOne({user_id: req.user._id, _id: req.body.todo_id}, {description: req.body.description,
                due_date: req.body.due_date, reminder_date: req.body.reminder_date}).then((data) => {
                // console.log(data);
                if(data.n <= 0)
                    return res.status(400).render('users/todoFormUpdate', { page: 'Update Task', menuId: '', todo_id: req.todo_id, req: req.body, todoError: 'Could not update the task.', isLoggedIn: true});
                    // return res.status(400).send('Could not update the task.');
                else
                    return res.redirect('/users/myTodoList/all');
                    // return res.status(200).send('Task successfully updated.');
            }).catch(function (err) {
                // console.log(err);
                return res.status(400).render('users/todoFormUpdate', { page: 'Update Task', menuId: '', todo_id: req.todo_id, req: req.body, todoError: 'Could not update the task. Some error occurred.', isLoggedIn: true});
                // return res.status(400).send('Could not update the task. Some error occurred.');
            });
            
        } catch (error) {
            return res.status(400).render('users/todoFormUpdate', { page: 'Update Task', menuId: '', todo_id: req.todo_id, req: req.body, todoError: 'Could not update the task. Some error occurred.', isLoggedIn: true});
            // return res.status(400).send('Could not update the task. Some error occurred.');
        }
        

    },

    deleteTodo : async (req,res,next) => {

        // HERE INSTEAD OF ACTUALLY DELETING THE RECORD, WE COULD HAVE SET A FLAG FOR EACH RECORD TO BE ENABLED OR DISABLED.
        try {
            var todo_id = req.params['id'];
            ToDo.deleteOne({user_id: req.user._id, _id: todo_id}).then((data) => {
                // console.log(data);
                if(data.deletedCount <= 0)
                {
                    req.messageType = 'failure';
                    req.message = 'Could not delete the task.';
                    // return res.status(400).send('Could not delete the task.');
                }                    
                else{
                    req.messageType = 'success';
                    req.message = 'Task successfully deleted.';
                    // return res.status(200).send('Task successfully deleted.');
                }                  
            }).catch(function (err) {
                // console.log(err);
                req.messageType = 'failure';
                req.message = 'Could not delete the task. Some error occurred.';
                // return res.status(400).send('Could not delete the task. Some error occurred.');
            }).finally(() => next());
            
        } catch (error) {
            req.messageType = 'failure';
            req.message = 'Could not delete the task. Some error occurred.';
            next();
            // return res.status(400).send('Could not delete the task. Some error occurred.');
        }      

    }

};