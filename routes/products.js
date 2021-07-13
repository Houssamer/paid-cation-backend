import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import Products from '../models/Products.js';
import path from 'path';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

//storage configuration

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads/productsImage');
    },
    filename: function (req, file, callback) {
        callback(
            null,
            file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        );
    }
})

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

//products model

const Product = new mongoose.model('Product', Products);

//get all products 

router.get('/all', (req, res) => {
    Product.find()
            .then((products) => res.status(200).json(products))
            .catch((err) => res.status(400).json({message: err}));
});

// get a product by id

router.get('/:id', (req, res) => {
    Product.findById(req.params.id)
            .then(((product) => res.status(200).json(product)))
            .catch((err) => res.status(400).json({message: err}));
});

//get a product by city

router.get('/:city', (req, res) => {
    Product.find({ville: req.params.city})
            .then((products) => res.status(200).json(products))
            .catch((err) => res.status(400).json({message: err}));
})

//get a product by owner_id 

router.get('/owner/:id', (req, res) => {
    Product.find({owner_id: req.params.id})
            .then((products) => res.status(200).json(products))
            .catch((err) => res.status(400).json({message: err}))
})

//create a product
router.post('/add', auth, (req, res) => {
    const {
        owner_id,
        title,
        lieu,
        price,
        features,
        type,
        timing,
        ville,
        description,
        rate
    } = req.body;

    if (!title || !lieu || !price || !features || !type || !timing || !ville || !description || !rate) {
        res.status(400).json({message: "Veuillez entrer toutes les données"});
    } else {
        const newProduct = new Product({
            owner_id,
            title,
            lieu,
            price,
            features,
            type,
            timing,
            ville,
            description,
            rate,
        });

        newProduct.save()
                  .then((product) => res.status(201).json({product}))
                  .catch((err) => res.status(400).json({message: err}));
    } 
})

router.post('/add/image/:id', auth, upload.array('multi-files-add'), (req, res) => {
    const images = req.files.map((file) => "http://localhost:3001/productsImage/" + file.filename);

    if (!images) {
        res.status(400).json({message: "Veuillez entrer au moins une image"})
    } else {
        Product.findByIdAndUpdate(req.params.id, {images: images}, {new: true})
                .then(() => res.status(201).json({message: "ajoutée"}))
                .catch((err) => res.status(400).json({message: err}));
    }


})


//update a product
router.post('/update/:id', auth, (req, res) => {
    const {
        owner_id,
        title,
        lieu,
        price,
        features,
        type,
        timing,
        ville,
        description,
        rate,
    } = req.body;

    if (!owner_id || !title || !lieu || !price || !features || !type || !timing || !ville || !description || !rate) {
        res.status(400).json({message: "Veuillez entrer toutes les champs"});
    } else {
        Product.findByIdAndUpdate(
            req.params.id,
            {
                owner_id,
                title,
                lieu,
                price,
                features,
                type,
                timing,
                ville,
                description,
                rate
            },
            {
                new: true
            }
        )
        .then(() => res.status(202).json({message: "Updated"}))
        .catch((err) => res.status(400).json({message: err}));
    }
})

router.post('/update/image/:id', auth, upload.array('multi-files-update'), (req, res) => {
    const images = req.files.map((file) => "http://localhost:3001/productsImage/" + file.filename);

    if (!images) {
        res.status(400).json({message: "Veuillez entrer au moins une image"});
    } else {

        Product.findByIdAndUpdate(req.params.id, { $push: {images: images}}, {new: true})
                .then(() => res.status(200).json({message: "updated"}))
                .catch((err) => res.status(400).json({message: err}));
    }
})


export default router;