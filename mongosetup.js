const mongose=require('mongoose');

mongose.connect("mongodb://127.0.0.1:27017/codefusion");

const userschema=new mongose.Schema({
  email:String,
  name:String,
  password:String,
  signup_as:String,
})

module.exports=mongose.model("users",userschema)

