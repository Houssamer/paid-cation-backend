import mongoose from 'mongoose';


const reservationDispoSchema = new mongoose.Schema({
    product_id: {
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
        required: false
    }
});

export default reservationDispoSchema;