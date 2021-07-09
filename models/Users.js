import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    role: {
        type: String,
        required: true,
    },
    num: {
        type: String,
        required: true,
    },
    entreprise: {
        type: String,
        required: false,
    },  
});

export default userSchema;