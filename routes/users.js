import express from 'express';
import mongoose from 'mongoose';
import Users from '../models/Users.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import { secretJWT } from '../config/keys.js';
import auth from '../middleware/authMiddleware.js';


const router = express.Router();

//storage configuration

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null,  './uploads/usersImage');
    },
    filename: function(req, file, callback) {
        callback(
            null,
            file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        );
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        const typeAccepted = /jpeg|jpg|png/;

        if (typeAccepted.test(path.extname(file.originalname.toLowerCase()))) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    }
})


// user model

const User = new mongoose.model('User', Users);

// get all users

router.get('/all', (req, res) => {
    User.find()
        .then((users) => res.json(users))
        .catch((err) => res.status(400).json({message: err}));
});

//get a user with the id

router.get('/:id', (req, res) => {
    User.findById(req.params.id)
        .then((user) => res.status(400).json(user))
        .catch((err) => res.status(400).json(err));
})

// create a user

router.post('/add/:role', (req, res) => {
    const {
        firstName,
        lastName,
        email,
        password,
        num,
        entreprise,
    } = req.body;
    const role = req.params.role === "client" 
                                    ? 'client' 
                                    : req.params.role === "gerant" && 'gerant';
    
    if (!firstName || !lastName || !email || !password || !num) {
        res.status(400).json({message: "veuillez entrer toutes les données"});
    }
    else {
        User.findOne({ email })
            .then((user) => {
                if (user) {
                    res.status(400).json({message: "l'utilisateur existe déjà"});
                } 
                else {
                    if (!role) {
                        res.status(400).json({message: "le role est invalide"});
                    } else {
                        const newUser = new User({
                            firstName,
                            lastName,
                            email,
                            password,
                            num,
                            role,
                            entreprise,
                        });

                        bcrypt.genSalt(10, (err, salt) => {
                            if (err) throw err;
                            bcrypt.hash(newUser.password, salt, (err, hash) => {
                                if (err) throw err;
                                newUser.password = hash;
                                newUser.save()
                                       .then((user) => {
                                           jwt.sign(
                                               { id: user.id },
                                               secretJWT,
                                               { expiresIn: "12h" },
                                               (err, token) => {
                                                   if (err) throw err;
                                                   res.json({
                                                       token,
                                                       user: {
                                                           id: user.id,
                                                           firstName: user.firstName,
                                                           lastName: user.lastName,
                                                           email: user.email,
                                                           num: user.num,
                                                           role: user.role,
                                                       }
                                                   })
                                               }
                                           )
                                       })
                            })
                        })
                    }

                }
            })
            .catch((err) => res.status(400).json({message: err}));
    }
});


// user update 

router.post('/updateImg/:id', auth, upload.single('uploads'), (req, res) => {
    const imgUrl = req.file?.filename ? "http://localhost:3001/usersImage/" + req.file.filename : "";

    if (!imgUrl) {
        res.status(400).json({message: "Veuillez entrer votre photo"});
    } 
    else {
        User.findByIdAndUpdate(req.params.id, { image: imgUrl }, {new: true})
            .then(() => res.status(202).json({message: "Photo enregistrée"}))
            .catch((err) => res.status(400).json({message: err}));
    }
})

router.post('/updateInfo/:id', auth, (req, res) => {
    const {
        firstName,
        lastName,
        email,
        num,
    } = req.body;

    if (!firstName || !lastName || !email || !num) {
        res.status(400).json({message: "Veuillez remplir toutes les champs"});
    } else {
        User.findByIdAndUpdate(
            req.params.id,
            {
                firstName,
                lastName,
                email,
                num,
            },
            {new: true},
        )
        .then(() => res.status(202).json({message: "Les informations sont modifiées"}))
        .catch((err) => res.status(400).json({error: err}));
    }
})

//get user who is logged in

router.get('/', auth, (req, res) => {
    User.findById(req.user.id)
        .then((user) => res.status(200).json(user))
        .catch((err) => res.status(400).json({message: err}));
})


export default router;