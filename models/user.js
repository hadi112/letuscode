const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//creating schema
const UserSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        require:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

module.exports = User = mongoose.model('users',UserSchema);