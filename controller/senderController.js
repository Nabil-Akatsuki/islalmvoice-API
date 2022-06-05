const express = require('express');
const router = require('express').Router();
const { messageModal } = require('../models/MessageModal');
const joi = require('joi');

const schemaMessage = joi.object({
    senderMail: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    senderMessage: joi.string().required().min(10).max(500)
});

router.post('/', async (req, res) => {
    try {
        const value = await schemaMessage.validateAsync({
            senderMail: req.body.senderMail,
            senderMessage: req.body.senderMessage
        })

        let senderMail = req.body.senderMail;
        let senderMessage = req.body.senderMessage

        const newMessage = new messageModal({
            senderMail: req.body.senderMail,
            senderMessage: req.body.senderMessage
        });
        newMessage.save();
        res.status(200).json('Message envoyé avec succes')
    } catch (error) {
        res.status(400).json(error.message);
    }
})


module.exports = router