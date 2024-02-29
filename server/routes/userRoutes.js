const express = require("express");
const get_route = express();

const user_controller = require("../controllers/userController");

get_route.set('view engine', 'ejs');
get_route.set('views', "./views/users");
//get_route.set('views', __dirname + '/views/users');

const bodyParser = require("body-parser");
get_route.use(bodyParser.json());
get_route.use(bodyParser.urlencoded({ extended: true }));
const auth = require("../middleware/auth");

const multer = require("multer");
const path = require("path");


get_route.use(express.static('public'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/productImages'), function (err, success) {

            if (err) {
                throw err
            }

        });
    },

    filename: function (req, file, cb) {

        const name = Date.now() + '-' + file.originalname;
        cb(null, name, function (error, success) {

            if (error) {
                throw error
            }

        });

    }
});

const upload = multer({ storage: storage });


get_route.post('/register', user_controller.register_user);
get_route.post('/login', user_controller.user_login);
get_route.get('/getuser', auth, user_controller.getuser);
// get_route.get('/getalluser', auth, user_controller.getiduser);
get_route.post('/getuserbyid', auth, user_controller.getuserbyid);

//APply Doctor || POST
get_route.post("/apply-doctor", auth, user_controller.applyDoctorController);

//Notifiaction  Doctor || POST
get_route.post("/get-all-notification", auth, user_controller.getAllNotificationController);

//Notifiaction  Doctor || POST
get_route.post("/delete-all-notification", auth, user_controller.deleteAllNotificationController);

//GET ALL DOC
get_route.get("/getAllDoctor", auth, user_controller.getAllDocotrsController);

//BOOK APPOINTMENT
get_route.post("/book-appointment", auth, user_controller.bookeAppointmnetController);

//Booking Avliability
get_route.post("/booking-availbility", auth, user_controller.bookingAvailabilityController);

//Appointments List
get_route.get("/user-appointments", auth, user_controller.userAppointmentsController);


module.exports = get_route;

