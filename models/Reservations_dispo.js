import mongoose from 'mongoose';


const reservation_dispoSchema = new mongoose.Schema({
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
    }
});

export default reservation_dispoSchema;