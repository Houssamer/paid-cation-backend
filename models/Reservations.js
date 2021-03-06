import mongoose from 'mongoose';


const reservationSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        index: true,
    },
    product_id: {
        type: String,
        required: true,
        index: true,
    },
    owner_id: {
        type: String,
        required: true,
        index: true,
    },
    nombreMembres: {
        type: Number,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    duree: {
        type: String,
        required: true,
    },
    date_depart: {
        type: Date,
        required: true,
    },
    date_arrivee: {
        type: Date,
        required: true,
    },
    day: {
        type: Date,
        required: false,
    }, 
    image: {
        type: String,
        required: true,
    },
    num: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },

});

export default reservationSchema;