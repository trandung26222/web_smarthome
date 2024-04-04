const mongoose = require('mongoose');

const paramSM = mongoose.Schema(
    {
        homename : {
            type : String,
        },
        password : {
            type : String,
        },
        idcard : {
            type : String, 
        },
        nhietdo : {
            type : Number, 
        },
        doam : {
            type : Number, 
        },
        quat :{
            type : Boolean,
        },
        starttimeLiving : {
            type : Date,
        },
        starttimeBed : {
            type : Date,
        },
        starttimeKitchen : {
            type : Date,
        },
        address : {
            type : String,
        },
        ledphongkhach : {
            type : String, // bat - tat
        },
        ledphongngu : {
            type : String, // bat - tat
        },
        ledphongbep : {
            type : String, // bat - tat
        },
        dooropen : {
            type : Boolean,
        },
        rogas : {
            type : Boolean,
        },
        haverain:{
            type : Boolean,
        },
        light : {
            type : Boolean,
        }
    },
    {
        timestamps : true
    }
)
const SmartHome = mongoose.model('SmartHome',paramSM);

module.exports = SmartHome;