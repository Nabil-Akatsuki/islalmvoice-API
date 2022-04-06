const express = require('express');
const router = require('express').Router();
const { userModels } = require('../models/UserModels');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const joi = require('joi');


const schema = joi.object({
    nom: joi.string().hostname().min(3).max(15).required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'any.empty': err.message = 'Le champs nom ne doit être vide';
                    break;
                case 'string.min': err.message = 'Le nom doit contenir au moins 3 caractères';
                    break;
                case 'string.max': err.message = ' Le nom doit contenir 15 caractères maximum'
            }
        })
        return errors;
    }),
    prenom: joi.string().hostname().min(3).max(15).required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'any.empty': err.message = 'Le champs nom ne doit être vide';
                    break;
                case 'string.min': err.message = 'Le nom doit contenir au moins 3 caractères';
                    break;
                case 'string.max': err.message = ' Le nom doit contenir 15 caractères maximum'
            }
        })
        return errors;
    }),
    birthDay: joi.date(),
    userMail: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'any.empty': err.message = 'Le champs e-mail ne doit être vide';
                    break;
                case 'string.email': err.message = 'e-mail invalide';
                    break;
            }
        })
        return errors;
    }),
    userPass: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
});
const schema2 = joi.object({
    userMail: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'any.empty': err.message = 'Le champs e-mail ne doit être vide';
                    break;
                case 'string.email': err.message = 'e-mail invalide';
                    break;
            }
        })
        return errors;
    }),
    userPass: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
})

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
        const value = await schema.validateAsync({
            nom: req.body.nom,
            prenom: req.body.prenom,
            birthDay: req.body.birthDay,
            userMail: req.body.userMail,
            userPass: req.body.userPass
        });
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
            userPass: bcrypt.hashSync(req.body.userPass, 5),
            checked: true

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
                    userPass: bcrypt.hashSync(req.body.userPass, 5)
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
        const value = await schema2.validateAsync({
            userMail: req.body.userMail,
            userPass: req.body.userPass
        })
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
       /*  if (user.checked !== true) {
            return res.status(400).json('Votre compte est bloqué')
        } */

        let token = jwt.sign({ user_id: user._id },
            process.env.JWT_SECRET, {
            expiresIn: "1day"
        });


        res.status(200).json({
            email: user.userMail,
            firstName: user.nom,
            lastName: user.prenom,
            userId: user._id,
            token
        })
    } catch (error) {
        res.status(500).json(error.message)
    }
})
router.get("/:userId", async (req, res) => {
    try {
        let requestUser = req.params.userId;
        if (!requestUser) {
            return res.status(400).json("Id utilisateur manquant!");
        };
        let user = await userModels.findById(requestUser).select({ userPass: 0 });
        if (!user) {
            req.status(404).json("Utilisateur non trouvé");
        }
        res.json(user);
        
    } catch (error) {
        res.status(500).json(error.message || "Internal server error");
    }
});
router.put('/blocus/:id', async (req, res) => {
    try {
        const users = await userModels.findById(req.params.id);
        if (!users) {
            return res.status(404).json('Utilisateur introuvable');
        }
        let updateBlocage = await userModels.findOneAndUpdate({ _id: req.params.id }, {
            $set:{checked: req.body.checked}
        })
        res.status(200).json('Utilisateur bloqué avec succès')
    } catch (error) {
        res.status(500).json(error.message)
    }
})

module.exports = router