
const mongoose= require("mongoose");

const Product= mongoose.Schema({


    product_name:{
        type:String ,
        required:true
    },
    description:{
        type:String ,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    stock_quantity:{
        type:Number,
        required:true,
    },

    image_url:{
        type:String,
        required:true,
    },

    createdAt:{
        type:Date,
        default:Date.now()
    },

    updatedAt:{
        type:Date,
        default:Date.now()
    }



});

module.exports=mongoose.model("product",Product)