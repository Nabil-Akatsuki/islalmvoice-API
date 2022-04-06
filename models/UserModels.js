const { boolean } = require('joi');
const mongoose = require('mongoose');
const userModels = mongoose.model(
    "userData",
    {
        nom: {type:String, require: true},
        prenom : {type:String, require:true},
        birthDay : {type:String, require:true},
        sexe : {type:String, require:true},
        userMail : {type:String, require:true},
        userPass : {type:String, require:true},
        date :{type:Date, default:Date.now},
        checked:{type:Boolean, require:true}
    },
   "tableData" 
);

module.exports = {userModels};