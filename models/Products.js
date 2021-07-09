import mongoose from 'mongoose';


const productSchema = new mongoose.Schema({
    owner_id: {
        type: String,
        required: true,
        index: true,
    },
    title: {
        type: String,
        required: true,
    },
    images: {
        type: [String],

    },
    lieu: {
        type: String,
        required: true,
    },
    features: {
        type: Array
    },
    price: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    timing: {
        type: [String],
        required: true,
    },
    rate: {
        type: Number,
    },
    ville: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    }
});

export default productSchema;