import express from 'express';
import mongoose from 'mongoose';
import Users from '../models/Users.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { secretJWT } from '../config/keys.js'

const router = express.Router();

const User = new mongoose.model('User', Users);

router.post('/', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        res.status(400).json({ message: "Veuillez entrer toutes les données"});
    }
    else {
        User.findOne({ email })
            .then((user) => {
                if (!user) {
                    res.status(400).json({ message: "l'utilisateur n'existe pas"});
                }
                else {
                    bcrypt.compare(password, user.password)
                          .then((isMatch) => {
                              if (!isMatch) {
                                  res.status(400).json({ message: "le mot de passe est invalide"});
                              } else {
                                  jwt.sign(
                                      { id: user.id },
                                      secretJWT,
                                      { expiresIn: '12h'},
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
                                                  image: user?.image,
                                              }
                                          });
                                      }
                                  )
                              }
                          })
                          .catch((err) => res.status(400).json({message: err}));
                }
            })
            .catch((err) => res.status(400).json({message: err}));
    }
})

export default router;