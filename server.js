import express from 'express';
import mongoose from 'mongoose';
import usersRoute from './routes/users.js';
import productsRoute from './routes/products.js';
import authRoute from './routes/auth.js';
import reservationRoute from './routes/reservation.js';
import reservationDsipoRoute from './routes/reservations_dispo.js';


const app = express();
const PORT = process.nextTick.PORT || 3001;

//middlewares

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('./public'));
app.use("/usersImage", express.static("./uploads/usersImage"));
app.use('/productsImage', express.static("./uploads/productsImage"));
app.use((req, res, next) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, x-auth-token"  
    );
    next();
});
app.use('/api/users', usersRoute);
app.use('/api/products', productsRoute)
app.use('/api/auth', authRoute);
app.use('/api/reservations', reservationRoute);
app.use('/api/reservations/dispo', reservationDsipoRoute);

//setting up the database

mongoose
    .connect("mongodb://localhost:27017/paid_cation", {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then(() => console.log("connected to mongodb"))
    .catch(err => console.log(err));

//App welcome

app.get('/', (req, res) => {
    res.json({message: 'Welcome !!!'});
});

//listen port

app.listen(PORT, () => console.log("app running on port" + PORT));