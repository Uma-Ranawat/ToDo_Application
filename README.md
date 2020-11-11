Execute this project using "npm start" and access on localhost:3000.

This project contains the front-end and the back-end code for ToDo application.
To join the front-end with the back-end, I had to set the routes and pass the data appropriately through the routes and added code for dynamic rendering of the front-end pages according to the data they receive.

For eg : to view all the tasks of the currently logged in user as well as all the tasks of all the currently logged in users (Todo List - List should display all the todos of the logged-in users ordered by their due-date.), the same view file 'users/todoList' is rendered but the content and layout of few things are different according to the page the user wants to access.
