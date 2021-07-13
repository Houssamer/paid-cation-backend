import express from 'express';
import mongoose from 'mongoose';
import Reservations from '../models/Reservations.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// reservations model

const Reservation = new mongoose.model('Reservation', Reservations);

//get all reservation for a user with id

router.get('/user/:id', auth, (req, res) => {
    Reservation.find({ user_id: req.params.id})
               .then((reservations) => res.status(200).json(reservations))
               .catch((err) => res.status(400).json({message: err}));
})

//get a reservation with id

router.get('/:id', auth, (req, res) => {
    Reservation.findById(req.params.id)
               .then((reservation) => res.status(200).json(reservation))
               .catch((err) => res.status(400).json({message: err}));
})

//get reservations by owner id

router.get('/owner/:id', auth, (req, res) => {
    Reservation.find({ owner_id: req.params.id})
               .then((reservations) => res.status(200).json(reservations))
               .catch((err) => res.status(400).json({message: err}));
})

//get reservations by product

router.get('/product/:id', auth, (req, res) => {
    Reservation.find({ product_id: req.params.id})
               .then((reservations) => res.status(200).json(reservations))
               .catch((err) => res.status(400).json({message: err}));
})

//create a reservation with days

router.post('/add/day', auth, (req, res) => {
    const {
        date_arrivee, 
        date_depart, 
        nombreMembres, 
        price,
        user_id,
        product_id,
        owner_id,
        duree,
        image,
        num,
        email,
    } = req.body;

    if (!date_arrivee || !date_depart || !nombreMembres || !price || !user_id || !product_id || !owner_id || !duree || !image || !num || !email) {
        res.status(400).json({message: "Veuillez entrer toutes les champs"});
    } else {
        const newReservation = new Reservation({
            date_arrivee,
            date_depart,
            nombreMembres,
            price,
            user_id,
            product_id,
            owner_id,
            duree,
            image,
            num,
            email,
        });

        newReservation.save()
                      .then(() => res.status(201).json({message: "Ajouté"}))
                      .catch((err) => res.status(400).json({message: err}));
    }
})

//create a reservation with hours

router.post('/add/hour', auth, (req, res) => {
    const {
        day,
        date_arrivee,
        date_depart,
        nombreMembres,
        price,
        user_id,
        product_id,
        owner_id,
        duree,
        image,
        num,
        email,
    } = req.body;

    if (!day || !date_arrivee || !date_depart || !nombreMembres || !price || !user_id || !product_id || !owner_id || !duree || !num || !email || !image) {
        res.status(400).json({message: "Veuillez entrer toutes les champs"});
    } else {
        const newReservation = new Reservation({
            day,
            date_arrivee,
            date_depart,
            nombreMembres,
            price,
            user_id,
            product_id,
            owner_id,
            duree,
            image, 
            num,
            email,
        });

        newReservation.save()
                      .then(() => res.status(201).json({message: "created"}))
                      .catch((err) => res.status(400).json({message: err}));
    }
})


export default router;