const mongoose = require('mongoose');   //userModels

const paramuser = mongoose.Schema(
    {
        username : {
            type : String,
        },
        password : {
            type : String,
        },
        homename:{
            type : String,
        },
        email:{
            type : String,
        }
        
    },
    {
        timestamps : true
    }
)
const User = mongoose.model('User',paramuser);

module.exports = User;