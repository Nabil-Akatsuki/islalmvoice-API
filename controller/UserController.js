const express = require('express');
const router = require('express').Router();
const { userModels } = require('../models/UserModels');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");



router.get('/', async (req, res) => {
    try {
        const users = await userModels.find();
        res.json(users);
    } catch (error) {
        res.status(500).json(error.message);
    }
});
router.post('/', async (req, res) => {

    try {

        let userMail = req.body.userMail;
        let userPass = req.body.userPass;
        console.log(req.body)

        if (userMail?.length === 0 || userMail == null) {
            return res.status(404).json('Veuillez entrer votre mail');
        }
        if (userPass?.length === 0 || userPass == null) {
            return res.status(404).json('Veuillez entrer votre Mot de passe');
        }
        const user = await userModels.findOne({ userMail });
        if (user) {
            return res.status(404).json('Cet utilisateur existe déjà');
        }
        const newUser = new userModels({
            nom: req.body.nom,
            prenom: req.body.prenom,
            birthDay: req.body.birthDay,
            sexe: req.body.sexe,
            userMail: req.body.userMail,
            userPass: bcrypt.hashSync(req.body.userPass, 5)

        });
        newUser.save();
        res.json('Votre inscription a été prise en compte')
    } catch (error) {
        res.status(503).json(error.message);
    }
});
router.put('/:id', async (req, res) => {
    try {
        let userMail = req.body.userMail;
        let userPass = req.body.userPass;

        if (userMail?.length === 0 || userMail == null) {
            return res.status(404).json('Veuillez entrer votre mail');
        }
        if (userPass?.length === 0 || userPass == null) {
            return res.status(404).json('Veuillez entrer votre Mot de passe');
        }
        const user = await userModels.findOne({ userMail });
        if (!user) {
            return res.status(404).json('adresse ou mot de passe invalide')
        }
        const users = await userModels.findById(req.params.id);
        if (!users) {
            return res.status(404).json('Utilisateur introuvable');
        }
        const userUpdate = await userModels.updateOne({ _id: req.params.id },
            {
                $set:
                {
                    nom: req.body.nom,
                    prenom: req.body.prenom,
                    birthDay: req.body.birthDay,
                    sexe: req.body.sexe,
                    userMail: req.body.userMail,
                    userPass: req.body.userPass
                }
            })
        res.json('Information modifié avec succès');
    } catch (error) {
        res.status(404).json(error.message);
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const users = await userModels.findById(req.params.id);
        if (!users) {
            return res.status(404).json('Utilisateur introuvable');
        }
        const usersRemove = await userModels.deleteOne({ _id: req.params.id });
        res.json('Utilisateur supprimé avec succès')
    } catch (error) {
        res.status(404).json(error.message);
    }
});
router.post('/login', async (req, res) => {
    try {
        let userMail = req.body.userMail;
        let userPass = req.body.userPass;
    
        if (userMail?.length === 0 || userMail == null) {
            return res.status(404).json('Veuillez entrer votre mail');
        }
        if (userPass?.length === 0 || userPass == null) {
            return res.status(404).json('Veuillez entrer votre Mot de passe');
        }
        const user = await userModels.findOne({ userMail });
        if (!user) {
            return res.status(404).json('adresse ou mot de passe invalide')
        }
        const checkPassword = bcrypt.compareSync(userPass, user.userPass);
        if (!checkPassword) {
            return res.status(404).json('adresse ou mot de passe invalide')
        }
        
        let token = jwt.sign({ user_id: user._id },
            process.env.JWT_SECRET, {
            expiresIn: "1day"
        });
     

        res.status(200).json({
            email : user.userMail,
            firstName: user.nom,
            lastName : user.prenom,
            token
        })
    } catch (error) {
        res.status(500).json(error.message)
    }
    
})
module.exports = router