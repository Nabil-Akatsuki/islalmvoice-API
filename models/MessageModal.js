const { boolean } = require('joi');
const mongoose = require('mongoose');
const messageModal = mongoose.model(
    "message",
    {
        senderMail: {type:String, require: true},
        senderMessage : {type:String, require:true},
        date :{type:Date, default:Date.now}
    },
    "messages"
);

module.exports = {messageModal};