/**
* ADD USER AUTHORIZATION
*   via command line: "meteor add accounts-ui"
*   "accounts-ui" package adds templates to add login widgets
*   via command line: "meteor add accounts-password"
*   "accounts-password" package adds password support for accounts
*
* REMOVE DEFAULT UNSECURE SETTING FROM METEOR APP
*   insecure is intended for development only
*   via command line: "meteor remove insecure"
*
* REMOVE DEFAULT AUTO-PUBLISH SETTING FROM METEOR APP
*   meteor uses "subscribers" instead of request-response cycle
*   by default, when users add data to the DB, meteor auto-publishes the data for all users to see
*   remove Auto-Publish and indicate to meteor which data each user should see
*   via command line: "meteor remove auto-publish"
* 
* USEFUL COMMANDS FOR THE BROWSER CONSOLE
*   displays the data objects within the MongoDB collection
*       Tasks.find().fetch();
*   inserts data object into MongoDB collection
*       Tasks.insert({name: "Task Name", createAt: new Date()});
*   removes data object from MongoDB collection using taskId {string}
*       Tasks.remove({taskId});
*
* ADDS BOOTSTRAP LIBRARY
*   via command line: "meteor add twbs:bootstrap"
*
*/

Tasks = new Mongo.Collection("tasks");


/**
* CLIENT SIDE CODE
* If the user is on the client side, find, return and publish the tasks {string} created with their userId {string}
* 
* @Meteor.subscribe
*   allows users to subscribe/see tasks
* 
* @Template.task.helpers
*   sorts the tasks based on their createdAt date
*   puts the newest task at the top of the list
* 
* @Template.task.events
*   @method "submit .add-task"
*       adds a task
*       meteor calls the "addTask" method and passes in the "name" variable
*       clears the input form after submitting a task
* 
* 
* 
* 
* 
* 
*/ 


if(Meteor.isClient) {
    Meteor.subscribe('tasks');  
 
    Template.tasks.helpers({
        tasks: function(){
                   return Tasks.find({}, {sort:{createdAt:-1}});
               }   
    });     

    Template.tasks.events({
        "submit .add-task": function(event){
                                var name = event.target.name.value;
                                Meteor.call("addTask", name);               
                                event.target.name.value = "";            //clears input form after submission
                                return false; 
                            },  //end "submit .add-task" method                         
        
        "click .delete-task": function(event) {
                                  if(confirm("Delete Task?")) {
                                      Meteor.call("deleteTask", this._id);
                                  } //end if statement
                                  return false;
                              },   //end click .delete-task method

        "click .edit-task": function () {
                                  // Set the checked property to the opposite of its current value
                                  var name = this._id;                                  
                                  Meteor.call("editTask", name);                                                 
                                  return false; 
                                },
        
        "click .complete-task": function () {
                                  // Set the checked property to the opposite of its current value
                                  var name = this._id;                                  
                                  Meteor.call("toggleChecked", name);                                                 
                                  return false; 
                                }                                                                
    }); //end of Templates.tasks.events

}

/**
* SERVER SIDE CODE
* If the client is on the server, find, return and publish the tasks {string} created with their userId {string}
*/

if (Meteor.isServer) {
    Meteor.publish('tasks', function() {
        return Tasks.find({userId: this.userId});  
    });                                             
}                                                   


/**
* METEOR METHODS
* Allows the user to add tasks to the DB and delete tasks from the DB
* 
* @namespace Meteor
* 
* @method addTask
* If the user is not logged in with a userId, throw an error
* If the user is logged in, allow them to insert a task
* 
*   @Tasks.insert
*   Inserts the task name {string}, the date {object} the task is created, and the userId {string}
* 
* @method deleteTask
* Takes a taskId as an argument, and removes the task
*/

Meteor.methods({
    addTask:function(name){
                if(!Meteor.userId()){
                throw new Meteor.Error("You Have Hit An Error: Access Denied!");
            } 

        Tasks.insert({
            name: name,
            createdAt: new Date(),
            userId: Meteor.userId(),
            checked: false
        }); 
    },
          
    deleteTask: function(taskId){
        Tasks.remove(taskId);
    },

    editTask: function(taskId){
        Tasks.update(taskId, {
            $set: {checked: false}
        });
    },

    toggleChecked: function(taskId){
        Tasks.update(taskId, {
            $set: {checked: ! this.checked},
            $set: {checked: false}
        });
    }      
}); 
