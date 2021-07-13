import express from 'express';
import mongoose from 'mongoose';
import ReservationDispo from '../models/Reservations_dispo.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

//reservation dispo model

const Reservation_dispo = new mongoose.model('ReservationDispo', ReservationDispo);

// get all reservation_dispo

router.get('/all', auth, (req, res) => {
    Reservation_dispo.find()
                     .then((reservations_dispo) => res.status(200).json(reservations_dispo))
                     .catch((err) => res.status(400).json({message: err}));
})

//get reservation_dispo by product_id

router.get('/product/:id', auth, (req, res) => {
    Reservation_dispo.find({ product_id: req.params.id})
                     .then((reservations_dispo) => res.status(200).json(reservations_dispo))
                     .catch((err) => res.status(400).json({message: err}));
})

// get reservation_dispo by id

router.get('/:id', auth, (req, res) => {
    Reservation_dispo.findById(req.params.id)
                     .then((reservation_dispo) => res.status(200).json(reservation_dispo))
                     .catch((err) => res.status(400).json({message: err}))
})

//create reservation_dispo

router.post('/add/day', auth, (req, res) => {
    const {
        product_id,
        date_arrivee,
        date_depart,
    } = req.body;

    if (!product_id || !date_arrivee || !date_depart) {
        res.status(400).json({message: "Veuillez entrer toutes les champes"});
    } else {
        const newReservationDispo = new Reservation_dispo({
            product_id,
            date_arrivee,
            date_depart,
        });

        newReservationDispo.save()
                           .then(() => res.status(201).json({message: "Created"}))
                           .catch((err) => res.status(400).json({message: err}));
    }
})

router.post('/add/hour', auth, (req, res) => {
    const {
        product_id,
        date_arrivee,
        date_depart,
        day,
    } = req.body;

    if (!product_id || !date_arrivee || !date_depart || !day) {
        res.status(400).json({message: "Veuillez entrer toutes les champes"});
    } else {
        const newReservationDispo = new Reservation_dispo({
            product_id,
            date_arrivee,
            date_depart,
            day,
        });

        newReservationDispo.save()
                           .then(() => res.status(201).json({message: "Created"}))
                           .catch((err) => res.status(400).json({message: err}));
    }
})

//verifying if a reservations is already here 

router.post('/verify/day', auth, (req, res) => {
    const {
        product_id,
        date_depart,
        date_arrivee,
    } = req.body;

    if (!product_id || !date_depart || !date_arrivee) {
        res.status(400).json({message: "Veuillez entrer toutes les champs"})
    } else {
        Reservation_dispo.find({product_id: product_id})
                         .then((reservations) => {
                             if (reservations) {
                                 reservations.forEach((reservation) => {
                                    if (
                                        reservation.date_arrivee === date_arrivee 
                                        || 
                                        reservation.date_arrivee < date_depart
                                        ||
                                        (date_arrivee < reservation.date_arrivee && date_depart > reservation.date_arrivee)
                                        ) {
                                        res.status(400).json({message: "Not dispo"}).end();
                                    }
                                 })
                                 res.status(200).json({message: "Dispo"});
                             } else {
                                 res.status(200).json({message: "Dispo"});
                             }
                         })
                         .catch((err) => {
                             res.status(400).json({message: err});
                         })
    }

})

router.post('/verify/hour', auth, (req, res) => {
    const {
        day,
        product_id,
        date_depart,
        date_arrivee,
    } = req.body;
    if (!day || !product_id || !date_arrivee || !date_depart) {
        res.status(400).json({message: "Veuillez entrer toutes les champs"})
    } else {
        Reservation_dispo.find({product_id: product_id})
                         .then((reservations) => {
                             if (reservations) {
                                 reservations.forEach((reservation) => {
                                    if (day === reservation.day) {
                                        if (
                                            reservation.date_arrivee === date_arrivee 
                                            || 
                                            reservation.date_arrivee < date_depart
                                            ||
                                            (date_arrivee < reservation.date_arrivee && date_depart > reservation.date_arrivee)
                                            ) {
                                            res.status(400).json({message: "Not dispo"}).end();
                                        }
                                        res.status(200).json({message: "Dispo"});
                                    } else {
                                        res.status(200).json({message: 'Dispo'}).end();
                                    }
                                })
                             } else {
                                 res.status(200).json({message: "Dispo"});
                             }
                         })
                         .catch((err) => {
                             res.status(400).json({message: err});
                         })
    }
})

export default router;