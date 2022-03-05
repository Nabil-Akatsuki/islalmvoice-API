const express = require('express');
const router = require('express').Router();
const {loginModels} = require('../models/loginModels');

router.get('/', async(req, res)=>{
    try {
        const users = await loginModels.find();
        res.json(users);
    } catch (error) {
        res.status(404).json(error.message)
    }
})