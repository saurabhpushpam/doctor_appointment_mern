const express = require('express');
const app = express();
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();
const colors = require('colors');
const cors = require("cors");
const http = require("http");
const connectDB = require("./config/db");

const path = require("path");
app.use(express.static(path.join(__dirname, './client/build')))

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, './client/build/index.html'));
})


app.use(express.json());
app.use(cors());

app.use(morgan('dev'))


// mongodb connection
connectDB();


// routes 
const userroute = require("./routes/userRoutes");
app.use('/api', userroute);

const adminroute = require("./routes/adminRoutes");
app.use('/api', adminroute);

const doctorroute = require("./routes/doctorRoutes");
app.use('/api', doctorroute);


// const DB = "mongodb+srv://spuspam111:Sp123456@cluster0.0taaaup.mongodb.net/getapi?retryWrites=true&w=majority";


const port = process.env.PORT || 8000


app.get("/", (req, res) => {
    res.status(200).send({
        message: `server runnning`
    })
})

app.listen(port, () => {
    console.log(`server running in ${process.env.NODE_MODE} mode at port no. ${process.env.PORT}`.bgBlack.blue

    );
})


