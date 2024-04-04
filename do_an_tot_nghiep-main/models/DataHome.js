const mongoose = require('mongoose');

const param = mongoose.Schema(
    {
        ngaythangnam : {
            type : String,
        },
        homename :{
            type : String,
        },
        thoigianbat : {
            type : Number,
        },
        hummax :{
            type : Number,
        },
        hummin : {
            type : Number,
        },
        temmax :{
            type : Number,
        },
        temmin : {
            type : Number,
        },
        
    },
    {
        timestamps : true
    }
)
const DataHome = mongoose.model('DataHome',param);  // đặt 2 cái useLed giống nhau

module.exports = DataHome;