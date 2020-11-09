const ToDo = require('../models/ToDo');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const {todoValidation} = require('../routes/validation');

module.exports = {

    createTodo : async (req,res) => {

        // VALIDATING THE Todo Task
        const {error} = todoValidation(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        //  here need to validate the dates too like both dates should be greater than today's date and reminder date should be less than due date. We can do this using momentjs. Same is the case in update todo. Sorry i could not do it on time.

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
            return res.status(200).send('Task Successfully Saved.' + savedTask);

        }catch(err){

            return res.status(400).send('Something went wrong while saving the task. Please try again later.');
        }
        
    },

    getTodoList : async (req,res) => {

        // let todo = [];
        // ToDo.find({user_id: req.user._id}).sort({due_date : 'ASC'}).then(function(todo_list){            
        //     todo_list.forEach( data => {
        //         todo.push(data);
        //     });
        //     console.log("jnkjnkm"+todo);
        // });
        // console.log(todo);
        // if(!todo)
        //     return res.status(400).send('Could not get the list.');
        // else
        //     return res.status(200).send('todpo');

        ToDo.find({user_id: req.user._id}).sort({due_date : 'ASC'}).exec((err,data) => {
            if(err)
                return res.status(400).send('Could not get the list.');
            else
                return res.status(200).send(data);
        });

    },

    filterTodoList : async (req,res) => {

        ToDo.find({user_id: req.user._id, status: req.body.filter}).sort({due_date : 'ASC'}).exec((err,data) => {
            if(err)
                return res.status(400).send('Could not get the list.');
            else
                return res.status(200).send(data);
        });

    },

    getAllTodoList : async (req,res) => {

        let todo = [];
        await User.find({signin_flag: 1}).then( async data => {
            if(data.length !=0){
                
                await data.forEach( record => {
                    console.log(record._id);
                    ToDo.find({user_id: record._id}).sort({due_date : 'ASC'}).exec((err,todo_list) => {
                        // console.log(todo_list);
                        if(err)
                            console.log('Could not get the list of one user.');
                        else
                        {
                            todo_list.forEach( todo_data => {
                                // console.log(todo_data);
                                todo.push(todo_data);
                                // PROBLEM!!!! Here the todo_data is getting pushed into the todo array but outside of the main loops, it is showing empty array
                            });
                        }
                            // todo.push(todo_data);                        
                    });
                    
                }); 
                return res.status(200).send(todo);
            }
            else
                return res.status(400).send('No user logged in.');
        });     
        

    },

    markAsComplete : async (req,res) => {

        try {
            ToDo.updateOne({user_id: req.user._id, _id: req.body.todo_id}, {status: 'complete'}).then((data) => {
                // console.log(data);
                if(data.n <= 0)
                    return res.status(400).send('Could not mark the task as complete.');
                else
                    return res.status(200).send('Task marked as complete.');
            }).catch(function (err) {
                // console.log(err);
                return res.status(400).send('Could not mark the task as complete. Some error occurred.');
            });
            
        } catch (error) {
            return res.status(400).send('Could not mark the task as complete. Some error occurred.');
        }        

    },

    updateTodo : async (req,res) => {

        // VALIDATING THE Todo Task
        const {error} = todoValidation(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        try {
            ToDo.updateOne({user_id: req.user._id, _id: req.body.todo_id}, {description: req.body.description,
                due_date: req.body.due_date, reminder_date: req.body.reminder_date}).then((data) => {
                // console.log(data);
                if(data.n <= 0)
                    return res.status(400).send('Could not update the task.');
                else
                    return res.status(200).send('Task successfully updated.');
            }).catch(function (err) {
                // console.log(err);
                return res.status(400).send('Could not update the task. Some error occurred.');
            });
            
        } catch (error) {
            return res.status(400).send('Could not update the task. Some error occurred.');
        }
        

    },

    deleteTodo : async (req,res) => {

        // HERE INSTEAD OF ACTUALLY DELETING THE RECORD, WE COULD HAVE SET A FLAG FOR EACH RECORD TO BE ENABLED OR DISABLED.
        try {
            ToDo.deleteOne({user_id: req.user._id, _id: req.body.todo_id}).then((data) => {
                // console.log(data);
                if(data.deletedCount <= 0)
                    return res.status(400).send('Could not delete the task.');
                else
                    return res.status(200).send('Task successfully deleted.');
            }).catch(function (err) {
                // console.log(err);
                return res.status(400).send('Could not delete the task. Some error occurred.');
            });
            
        } catch (error) {
            return res.status(400).send('Could not delete the task. Some error occurred.');
        }      

    }

};